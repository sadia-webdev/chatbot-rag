import { db } from "@/db/drizzle";
import { business, conversation, message } from "@/db/schema";
import { auth } from "@/lib/auth";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { searchDocuments } from "@/lib/search";

const maxDuration = 30;

export async function POST(request: Request) {
  const {
    messages,
    conversationId,
  }: {
    messages: UIMessage[];
    conversationId?: string;
  } = await request.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const businessResult = await db
    .select()
    .from(business)
    .where(eq(business.userId, session.user.id))
    .limit(1);

  if (businessResult.length === 0) {
    return new Response("Business not found", { status: 404 });
  }

  const currentBusiness = businessResult[0];

  const modelMessages = await convertToModelMessages(messages);

  const latestMessage = messages[messages.length - 1];

  const textPart = latestMessage?.parts.find((part) => part.type === "text");

  if (!textPart || latestMessage.role !== "user") {
    return new Response("Invalid user message", { status: 400 });
  }

  
let currentConversation;

if (conversationId) {
  const conversationResult = await db
    .select()
    .from(conversation)
    .where(eq(conversation.id, conversationId))
    .limit(1);

  if (conversationResult.length > 0) {
    currentConversation = conversationResult[0];

    // Conversation exists, but belongs to another user
    if (currentConversation.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }
  } else {
    // Conversation does not exist → create it
    const title = textPart.text.slice(0, 50);

    const newConversation = await db
      .insert(conversation)
      .values({
        id: conversationId,
        title,
        userId: session.user.id,
      })
      .returning();

    currentConversation = newConversation[0];
  }
}

// Save the user's message
await db.insert(message).values({
  id: crypto.randomUUID(),
  content: textPart.text,
  role: latestMessage.role,
  conversationId: currentConversation.id,
  userId: session.user.id,
});



  const results = await searchDocuments(textPart.text, currentBusiness.id);

  const context = results
    .map((result) => result.metadata?.text)
    .filter(Boolean)
    .join("\n\n");

  const result = await streamText({
    model: google("gemini-2.5-flash"),

    system: `You are a helpful AI assistant for a business.

Answer the user's question using the business information provided below.

If the answer is not contained in the business information, say you don't have that information. Do not make up facts.

Business information:
${context}`,

    messages: modelMessages,
  });

  const responseText = await result.text;

  await db.insert(message).values({
    id: crypto.randomUUID(),
    content: responseText,
    role: "assistant",
    conversationId: conversationId!,
    userId: session.user.id,
  });

  return result.toUIMessageStreamResponse();
}

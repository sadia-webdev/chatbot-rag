import { db } from "@/db/drizzle";
import { conversation, message } from "@/db/schema";
import { auth } from "@/lib/auth";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

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

  const modelMessages = await convertToModelMessages(messages);

  const existingConversation = conversationId
    ? await db
        .select()
        .from(conversation)
        .where(
          and(
            eq(conversation.id, conversationId),
            eq(conversation.userId, session.user.id),
          ),
        )
        .limit(1)
    : [];



  if (existingConversation.length === 0) {
    await db.insert(conversation).values({
    id: conversationId!,
    title: "New conversation",
    userId: session.user.id,
  });


  const latestMessage = messages[messages.length - 1];

  const textPart = latestMessage.parts.find((part) => part.type === "text");

  if (!textPart || latestMessage.role !== "user") {
    return new Response("Invalid user message", { status: 400 });
  }

  await db.insert(message).values({
    id: crypto.randomUUID(),
    content: textPart.text,
    role: latestMessage.role,
    conversationId: conversationId!,
    userId: session.user.id,
  });

  } else {
    // Existing conversation
    // reuse it
  }

  


  const result = streamText({
    model: google("gemini-2.5-flash"),
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

import { db } from "@/db/drizzle";
import { conversation } from "@/db/schema";
import { auth } from "@/lib/auth";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { headers } from "next/headers";

const maxDuration = 30

export async function POST(request: Request){
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


   let currentConversationId = conversationId;

   if (!currentConversationId) {

     currentConversationId = crypto.randomUUID();

     await db.insert(conversation).values({
       id: currentConversationId,
       title: "New conversation",
       userId: session.user.id,
     });
   }


    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages: await modelMessages
    });

    return result.toUIMessageStreamResponse()
}
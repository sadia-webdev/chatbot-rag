import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

const maxDuration = 30

export async function POST(request: Request){
    const {messages }: { messages: UIMessage[]} = await request.json()

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse()
}
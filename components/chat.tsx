"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ChatProps = {
  conversationId: string;
  initialMessages: UIMessage[];
};

export default function Chat({ conversationId, initialMessages }: ChatProps) {
  const [input, setInput] = useState("");

  const router = useRouter();
  const [isNewChat] = useState(initialMessages.length === 0);

  const { messages, sendMessage } = useChat({
    messages: initialMessages,
    body: {
      conversationId,
    },
  });

  return (
    <div className='flex min-h-screen p-12'>
      <div className='container mx-auto flex flex-col'>
        {/* messages */}
        <div className='flex-1 overflow-y-auto'>
          {messages.map((message, i) => (
            <div
              key={`${message.id}-${i}`}
              className={
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={`max-w-md rounded-lg px-6 py-1 ${
                  message.role === "user"
                    ? "bg-accent text-white"
                    : "text-accent"
                }`}
              >
                {message.parts.map((part, i) =>
                  part.type === "text" ? <div key={i}>{part.text}</div> : null,
                )}
              </div>
            </div>
          ))}
        </div>

        {/* form */}
        <form 
        className="fixed bottom-0"
          onSubmit={(e) => {
            e.preventDefault();

            if (!input.trim()) return;

            sendMessage(
              { text: input },
              {
                body: {
                  conversationId,
                },
              },
            );

            if (isNewChat) {
              setTimeout(() => {
                router.refresh();
              }, 500);
            }

            setInput("");

          }}
          className='flex items-end gap-2'
        >
          <Input
            className='py-6 text-white text-accent'
            type='text'
            placeholder='ask anything'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            type='submit'
            className='cursor-pointer bg-accent px-6 py-6 hover:bg-accent/80'
          >
            send
          </Button>
        </form>
      </div>
    </div>
  );
}

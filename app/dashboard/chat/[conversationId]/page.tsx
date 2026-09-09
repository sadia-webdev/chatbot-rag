"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { useState, use } from "react";

type PageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

const Page = ({ params }: PageProps) => {
  const { conversationId } = use(params);

  const [input, setInput] = useState("");

  const { messages, sendMessage } = useChat({
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
                    ? "bg-green-900 text-white"
                    : "text-white"
                }`}
              >
                {message.parts.map((part, i) => (
                  <div key={i}>{part.text}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* form */}
        <form
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
            setInput("");
          }}
          className='flex items-end gap-2'
        >
          <Input
            className='py-6 text-white'
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
};

export default Page;

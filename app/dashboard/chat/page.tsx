"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

const Page = () => {
  const [input, setInput] = useState("");

  const { messages, sendMessage } = useChat();

  console.log(messages);

  return (
    <div className=' flex min-h-screen p-12'>
      <div className='container  mx-auto  flex flex-col'>
        {/* messages  */}

        <div className=' flex-1  overflow-y-auto  '>
          {messages.map((message, i) => (
            <div
              key={`${message.id}-${i}`}
              className={
                message.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={`max-w-md px-6 py-1 rounded-lg ${message.role === "user" ? "bg-green-900 text-white" : "text-white"}`}
              >
                {message.parts.map((part, i) => (
                  <div key={i}>{part.text}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* form  */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput("");
          }}
          className='flex gap-2 items-end '
        >
          <Input
            className='text-white py-6'
            type='text'
            placeholder='ask anything'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type='submit' className='py-6 px-6 cursor-pointer bg-accent hover:bg-accent/80'>
            send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;

"use client";

import { Send } from "lucide-react";
import { useState } from "react";

interface Message {
  id: number;
  text: string;
  sent: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentMessage = event.currentTarget.message.value.trim();
    if (!currentMessage) {
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      text: currentMessage,
      sent: true,
    };
    setMessages(messages.concat(newMessage));
    getChatBotMessages(currentMessage);

    event.currentTarget.message.value = "";
  };

  const getChatBotMessages = async (prompt: string) => {
    const response = await fetch("/api/chat?prompt=" + prompt, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const newMessage = {
      id: messages.length + 1,
      text: data.data,
      sent: false,
    };
    setMessages(messages.concat(newMessage));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sent ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                  message.sent
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6"
      >
        <div className="flex space-x-3">
          <input
            type="text"
            name="message"
            placeholder="Type a message..."
            className="flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-gray-900 placeholder-gray-400 rounded-md py-2 pl-3 ring-1 ring-gray-300"
          />
          <button className="inline-flex items-center rounded-lg px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm">
            <Send className="h-5 w-5 mr-2" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

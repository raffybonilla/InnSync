"use client";

import { useState } from "react";

type Message = {
  id: string;
  sender: "user" | "assistant";
  text: string;
};

export default function Chatbot({
  initial = [],
}: {
  initial?: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: input,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      const reply: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: data.reply ?? "Sorry, I couldn't respond.",
      };

      setMessages((m) => [...m, reply]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 2),
          sender: "assistant",
          text: "Error: could not reach chat server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">No messages yet.</div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded w-fit max-w-[80%] ${
              m.sender === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Ask the assistant..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-black text-white px-4 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InboxPage() {
  const router = useRouter();

  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  const chats = [
    {
      id: 1,
      name: "Hotel Cebu Grand",
      handler: "Juan D. Cruz",
      messages: [
        { sender: "hotel", text: "Your room is ready for check-in." },
        { sender: "user", text: "Okay thank you!" },
      ],
    },
    {
      id: 2,
      name: "Shangri-La Cebu",
      handler: "Maria S. Reyes",
      messages: [
        { sender: "hotel", text: "Do you need airport pickup?" },
        { sender: "user", text: "Yes please." },
      ],
    },
    {
      id: 3,
      name: "Radisson Blu",
      handler: "Carlos M. Lim",
      messages: [
        { sender: "hotel", text: "Your booking has been confirmed." },
        { sender: "user", text: "Nice!" },
      ],
    },
  ];

  const activeChat = chats.find((c) => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* LEFT SIDE */}
      <div className="w-1/3 bg-white border-r p-4">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">

          <button
            onClick={() => router.push("/user/dashboard")}
            className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            ← Back
          </button>

          <h1 className="text-xl font-bold">Inbox</h1>

          <button
            onClick={() => setShowNewChat(true)}
            className="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            + New Chat
          </button>

        </div>

        {/* CHAT LIST */}
        <div className="flex flex-col">

          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`text-left p-3 border-b hover:bg-gray-100 w-full ${
                selectedChat === chat.id ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-semibold">{chat.name}</p>
              <p className="text-xs text-gray-500">
                Handled by {chat.handler}
              </p>
            </button>
          ))}

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 p-6">

        {!activeChat ? (
          <p className="text-gray-500">
            Select a conversation
          </p>
        ) : (
          <div className="bg-white p-5 rounded shadow">

            {/* CHAT HEADER */}
            <h2 className="text-lg font-bold mb-1">
              {activeChat.name}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Handled by: {activeChat.handler}
            </p>

            {/* MESSAGES */}
            <div className="space-y-3">
              {activeChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded w-fit ${
                    msg.sender === "user"
                      ? "bg-blue-100 ml-auto"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="mt-4 flex gap-2">
              <input
                placeholder="Type a message..."
                className="w-full border p-2 rounded"
              />
              <button className="bg-black text-white px-4 rounded">
                Send
              </button>
            </div>

          </div>
        )}

      </div>

      {/* NEW CHAT MODAL */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-[90%] max-w-md p-6 rounded">

            <h2 className="text-lg font-bold mb-3">
              Start New Chat
            </h2>

            <input
              placeholder="Hotel name..."
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              placeholder="Message..."
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-2">

              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>

              <button className="flex-1 bg-blue-600 text-white py-2 rounded">
                Send
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
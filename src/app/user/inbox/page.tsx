"use client";

import { useState } from "react";

export default function InboxPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  const chats = [
    {
      id: 1,
      name: "Hotel Cebu Grand",
      message: "Your room is ready for check-in.",
      time: "2 mins ago",
    },
    {
      id: 2,
      name: "Shangri-La Cebu Staff",
      message: "Do you need airport pickup?",
      time: "1 hour ago",
    },
    {
      id: 3,
      name: "Radisson Blu",
      message: "Your booking has been confirmed.",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* LEFT CHAT LIST */}
      <div className="w-1/3 bg-white border-r p-4">

        {/* 🔥 TOP HEADER + NEW CHAT */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-xl font-bold">Inbox</h1>

          <button
            onClick={() => setShowNewChat(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            + New Chat
          </button>

        </div>

        {/* CHAT LIST */}
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className="p-3 border-b hover:bg-gray-100 cursor-pointer"
          >
            <p className="font-semibold">{chat.name}</p>
            <p className="text-sm text-gray-500">{chat.message}</p>
            <p className="text-xs text-gray-400">{chat.time}</p>
          </div>
        ))}

      </div>

      {/* RIGHT CHAT VIEW */}
      <div className="flex-1 p-6">

        {!selectedChat ? (
          <p className="text-gray-500">
            Select a conversation to view messages
          </p>
        ) : (
          <div className="bg-white p-5 rounded shadow">

            <h2 className="text-lg font-bold mb-2">
              Chat opened
            </h2>

            <div className="space-y-3 mt-4">

              <div className="bg-gray-100 p-3 rounded">
                Hello! Your booking is confirmed.
              </div>

              <div className="bg-blue-100 p-3 rounded ml-auto w-fit">
                Thank you!
              </div>

            </div>

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

      {/* 🔥 NEW CHAT MODAL */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-[90%] max-w-md p-6 rounded shadow">

            <h2 className="text-lg font-bold mb-3">
              Start New Chat
            </h2>

            <input
              placeholder="Hotel name..."
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              placeholder="Your message..."
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
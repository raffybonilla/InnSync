"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  sender: "hotel" | "user";
  text: string;
};

type Chat = {
  id: number;
  name: string;
  handler: string;
  messages: Message[];
};

export default function InboxPage() {
  const router = useRouter();

  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [showNewChat, setShowNewChat] = useState(false);

  // MESSAGE INPUT
  const [messageInput, setMessageInput] = useState("");

  // NEW CHAT INPUTS
  const [newHotel, setNewHotel] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // CHATS
  const [chats, setChats] = useState<Chat[]>([
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

    // SAMPLE AUTO BOOKING CHAT
    {
      id: 4,
      name: "Quest Hotel Cebu",
      handler: "Hotel Staff",
      messages: [
        {
          sender: "hotel",
          text: "Thank you for booking at Quest Hotel Cebu.",
        },
        {
          sender: "hotel",
          text: "Feel free to message us for concerns.",
        },
      ],
    },
  ]);

  // ACTIVE CHAT
  const activeChat = chats.find((c) => c.id === selectedChat);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  sender: "user",
                  text: messageInput,
                },
              ],
            }
          : chat
      )
    );

    setMessageInput("");

    // AUTO HOTEL REPLY
    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    sender: "hotel",
                    text: "Hotel received your message.",
                  },
                ],
              }
            : chat
        )
      );
    }, 1000);
  };

  // CREATE NEW CHAT
  const createNewChat = () => {
    if (!newHotel.trim() || !newMessage.trim()) return;

    const newChat: Chat = {
      id: Date.now(),
      name: newHotel,
      handler: "Hotel Staff",
      messages: [
        {
          sender: "user",
          text: newMessage,
        },
        {
          sender: "hotel",
          text: `Welcome to ${newHotel}. How can we help you?`,
        },
      ],
    };

    setChats((prev) => [...prev, newChat]);

    setSelectedChat(newChat.id);

    setNewHotel("");
    setNewMessage("");
    setShowNewChat(false);
  };

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

          <h1 className="text-xl font-bold">
            Inbox
          </h1>

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
              className={`text-left p-3 border-b hover:bg-gray-100 w-full transition ${
                selectedChat === chat.id
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <p className="font-semibold">
                {chat.name}
              </p>

              <p className="text-xs text-gray-500">
                Handled by {chat.handler}
              </p>

              <p className="text-xs text-gray-400 mt-1 truncate">
                {
                  chat.messages[
                    chat.messages.length - 1
                  ]?.text
                }
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
          <div className="bg-white p-5 rounded shadow h-full flex flex-col">

            {/* CHAT HEADER */}
            <div className="border-b pb-3 mb-4">

              <h2 className="text-lg font-bold">
                {activeChat.name}
              </h2>

              <p className="text-sm text-gray-500">
                Handled by: {activeChat.handler}
              </p>

            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">

              {activeChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

            </div>

            {/* INPUT */}
            <div className="mt-4 flex gap-2">

              <input
                value={messageInput}
                onChange={(e) =>
                  setMessageInput(e.target.value)
                }
                placeholder="Type a message..."
                className="w-full border p-2 rounded"
              />

              <button
                onClick={sendMessage}
                className="bg-black text-white px-4 rounded hover:bg-gray-800"
              >
                Send
              </button>

            </div>

          </div>
        )}

      </div>

      {/* NEW CHAT MODAL */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[90%] max-w-md p-6 rounded shadow-lg">

            <h2 className="text-lg font-bold mb-3">
              Start New Chat
            </h2>

            <input
              value={newHotel}
              onChange={(e) =>
                setNewHotel(e.target.value)
              }
              placeholder="Hotel name..."
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
              }
              placeholder="Message..."
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-2">

              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={createNewChat}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
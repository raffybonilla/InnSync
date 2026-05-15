"use client";

import { useState, useEffect } from "react";
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

  const [messageInput, setMessageInput] = useState("");
  const [newHotel, setNewHotel] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [hasNewBooking, setHasNewBooking] = useState(true);

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
  ]);

  // ================= NEW BOOKING ALERT =================
  useEffect(() => {
    if (!hasNewBooking) return;

    const timer = setTimeout(() => {
      setChats((prev) => [
        {
          id: Date.now(),
          name: "New Booking Alert",
          handler: "System",
          messages: [
            {
              sender: "hotel",
              text: "New guest booked Radisson Blu Cebu - Deluxe Room.",
            },
          ],
        },
        ...prev,
      ]);

      setHasNewBooking(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [hasNewBooking]);

  const activeChat = chats.find((c) => c.id === selectedChat);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: "user", text: messageInput },
              ],
            }
          : chat
      )
    );

    setMessageInput("");

    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) =>
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
    }, 900);
  };

  // ================= CREATE CHAT =================
  const createNewChat = () => {
    if (!newHotel.trim() || !newMessage.trim()) return;

    const newChat: Chat = {
      id: Date.now(),
      name: newHotel,
      handler: "Hotel Staff",
      messages: [
        { sender: "user", text: newMessage },
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
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
      <div className="flex flex-1">
        {/* ================= SIDEBAR ================= */}
        <div className="w-64 bg-[#3a4659] text-white p-4 flex flex-col">
          <h1 className="text-2xl font-bold mb-8">Inn Sync</h1>

          <button
            onClick={() => router.push("/user/profile")}
            className="text-left py-3 px-2 rounded hover:bg-white/10 transition"
          >
            👤 Profile
          </button>

          <button
            onClick={() => router.push("/user/dashboard")}
            className="text-left py-3 px-2 rounded hover:bg-white/10 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/user/inbox")}
            className="text-left py-3 px-2 rounded bg-white/20 font-bold"
          >
            Inbox
          </button>

          <button
            onClick={() => router.push("/user/wallet")}
            className="text-left py-3 px-2 rounded hover:bg-white/10 transition"
          >
            My Wallet
          </button>

          <button
            onClick={() => router.push("/user/notifications")}
            className="text-left py-3 px-2 rounded hover:bg-white/10 transition"
          >
            Notifications
          </button>

          <button className="mt-auto text-left py-3 px-2 rounded hover:bg-red-500/20 text-red-300 transition">
            Logout
          </button>
        </div>

        {/* ================= LEFT PANEL ================= */}
        <div className="w-[350px] bg-white border-r p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => router.push("/user/dashboard")}
              className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 font-semibold"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-bold">Inbox</h1>

            <button
              onClick={() => setShowNewChat(true)}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
            >
              + New Chat
            </button>
          </div>

          <div className="flex flex-col overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`text-left p-4 border-b transition ${
                  selectedChat === chat.id
                    ? "bg-gray-200 border-l-4 border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="font-bold text-black">{chat.name}</p>

                <p className="text-xs text-gray-700 mt-1">
                  Handled by {chat.handler}
                </p>

                <p className="text-sm text-gray-600 mt-2 truncate">
                  {chat.messages[chat.messages.length - 1]?.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="flex-1 p-6">
          {!activeChat ? (
            <div className="bg-white rounded shadow p-6">
              <p className="text-gray-600 font-semibold">
                Select a conversation
              </p>
            </div>
          ) : (
            <div className="bg-white p-5 rounded shadow h-full flex flex-col">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-black">
                  {activeChat.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  Handled by: {activeChat.handler}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {activeChat.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[75%] border ${
                      msg.sender === "user"
                        ? "ml-auto bg-black text-white"
                        : "bg-[#90a1b9] text-black"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={sendMessage}
                  className="bg-black text-white px-5 py-3 rounded hover:bg-gray-800"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#3a4659] text-white text-center py-3 text-sm">
        © 2026 Inn Sync — Hotel Booking System
      </footer>

      {/* ================= NEW CHAT MODAL ================= */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">
              Start New Chat
            </h2>

            <input
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              placeholder="Hotel name..."
              className="w-full border border-gray-300 p-3 rounded mb-3"
            />

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              className="w-full border border-gray-300 p-3 rounded mb-4 h-28 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 bg-gray-200 py-3 rounded hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={createNewChat}
                className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold"
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
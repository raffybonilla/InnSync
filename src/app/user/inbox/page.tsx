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
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <div className="flex flex-1">

        {/* ================= SIDEBAR ================= */}
        <div className="w-64 bg-[#3a4659] text-white p-5 flex flex-col justify-between">

          <div>

            <h1 className="text-2xl font-bold mb-8">
              Inn Sync
            </h1>

            <div className="space-y-3">

              <button
                onClick={() => router.push("/user/dashboard")}
                className="w-full text-left bg-[#4a5870] hover:bg-[#56657f] px-4 py-3 rounded-lg font-medium transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => router.push("/user/profile")}
                className="w-full text-left bg-[#4a5870] hover:bg-[#56657f] px-4 py-3 rounded-lg font-medium transition"
              >
                My Profile
              </button>

              <button
                onClick={() => router.push("/user/wallet")}
                className="w-full text-left bg-[#4a5870] hover:bg-[#56657f] px-4 py-3 rounded-lg font-medium transition"
              >
                My Wallet
              </button>

              <button
                className="w-full text-left bg-white text-black px-4 py-3 rounded-lg font-semibold"
              >
                Inbox
              </button>

              <button
                onClick={() => router.push("/user/notifications")}
                className="w-full text-left bg-[#4a5870] hover:bg-[#56657f] px-4 py-3 rounded-lg font-medium transition"
              >
                Notifications
              </button>

              <button
                onClick={() => router.push("/user/settings")}
                className="w-full text-left bg-[#4a5870] hover:bg-[#56657f] px-4 py-3 rounded-lg font-medium transition"
              >
                Settings
              </button>

              <button
                onClick={() => router.push("/user/help")}
                className="w-full text-left bg-[#4a5870] hover:bg-[#56657f] px-4 py-3 rounded-lg font-medium transition"
              >
                Help & Support
              </button>

            </div>

          </div>

          <button
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition"
          >
            Logout
          </button>

        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex flex-1 text-black">

          {/* ================= LEFT PANEL ================= */}
          <div className="w-1/3 bg-white border-r p-4">

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-4">

              <h1 className="text-2xl font-bold text-black">
                Inbox
              </h1>

              <button
                onClick={() => setShowNewChat(true)}
                className="ml-auto bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 font-semibold transition"
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
                    selectedChat === chat.id ? "bg-gray-200" : ""
                  }`}
                >
                  <p className="font-bold text-black text-base">
                    {chat.name}
                  </p>

                  <p className="text-xs text-gray-800 font-medium">
                    Handled by {chat.handler}
                  </p>

                  <p className="text-sm text-gray-700 mt-1 truncate font-medium">
                    {chat.messages[chat.messages.length - 1]?.text}
                  </p>

                </button>
              ))}

            </div>

          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="flex-1 p-6">

            {!activeChat ? (
              <p className="text-gray-600 font-semibold">
                Select a conversation
              </p>
            ) : (
              <div className="bg-white p-5 rounded-xl shadow h-full flex flex-col text-black">

                {/* CHAT HEADER */}
                <div className="border-b pb-3 mb-4">

                  <h2 className="text-lg font-bold text-black">
                    {activeChat.name}
                  </h2>

                  <p className="text-sm text-gray-700 font-medium">
                    Handled by: {activeChat.handler}
                  </p>

                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">

                  {activeChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl max-w-[75%] border text-base font-medium ${
                        msg.sender === "user"
                          ? "bg-white text-black ml-auto border-gray-300"
                          : "bg-[#90a1b9] text-black border-[#7d8aa1]"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}

                </div>

                {/* INPUT */}
                <div className="mt-4 flex gap-2 items-center">

                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full border-2 border-gray-400 p-3 rounded-lg focus:outline-none focus:border-black bg-white text-black placeholder-gray-600 font-medium"
                  />

                  <button
                    onClick={sendMessage}
                    className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 font-semibold transition"
                  >
                    Send
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#3a4659] text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between">

        <p className="text-sm font-medium">
          © 2026 Inn Sync. All rights reserved.
        </p>

        <div className="flex gap-5 mt-2 md:mt-0 text-sm">

          <button className="hover:underline">
            Privacy Policy
          </button>

          <button className="hover:underline">
            Terms & Conditions
          </button>

        </div>

      </footer>

      {/* ================= NEW CHAT MODAL ================= */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg text-black">

            <h2 className="text-lg font-bold mb-3">
              Start New Chat
            </h2>

            <input
              value={newHotel}
              onChange={(e) => setNewHotel(e.target.value)}
              placeholder="Hotel name..."
              className="w-full border p-2 rounded mb-3 text-black font-medium"
            />

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              className="w-full border p-2 rounded mb-3 text-black font-medium"
            />

            <div className="flex gap-2">

              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={createNewChat}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
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
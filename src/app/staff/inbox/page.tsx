'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

type ChatStatus = 'Open' | 'On Hold' | 'Closed';

type Sender = 'staff' | 'guest';

interface Message {
  sender: Sender;
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  title: string;
  status: ChatStatus;
  unread: number;
  handler: string;
  lastMessage: string;
  messages: Message[];
}

export default function StaffInboxPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | ChatStatus>('All');
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: 'Room 204 — Guest request',
      status: 'Open',
      unread: 2,
      handler: 'Alex Morgan',
      lastMessage: 'Thank you! I will send housekeeping now.',
      messages: [
        { sender: 'guest', text: 'Can I get extra towels please?', time: '09:12 AM' },
        { sender: 'staff', text: 'Sure, I am sending housekeeping now.', time: '09:14 AM' },
      ],
    },
    {
      id: 2,
      title: 'Room 312 — Maintenance issue',
      status: 'On Hold',
      unread: 0,
      handler: 'Bernadette Lee',
      lastMessage: 'We are waiting for the technician.',
      messages: [
        { sender: 'guest', text: 'The AC is not cooling in my room.', time: 'Yesterday' },
        { sender: 'staff', text: 'I have logged this with maintenance.', time: 'Yesterday' },
      ],
    },
    {
      id: 3,
      title: 'Room 105 — Checkout confirmation',
      status: 'Closed',
      unread: 0,
      handler: 'Mark Santos',
      lastMessage: 'Thank you for staying with us.',
      messages: [
        { sender: 'guest', text: 'Can I check out at 11 AM?', time: '2 days ago' },
        { sender: 'staff', text: 'Yes, that works perfectly.', time: '2 days ago' },
      ],
    },
  ]);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/auth/staff');
      return;
    }

    const storedUser = JSON.parse(userJson);
    if (!storedUser || storedUser.role !== 'staff') {
      router.push('/auth/staff');
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [router]);

  const filteredConversations = useMemo(
    () =>
      statusFilter === 'All'
        ? conversations
        : conversations.filter((conversation) => conversation.status === statusFilter),
    [statusFilter, conversations]
  );

  useEffect(() => {
    if (statusFilter === 'All') return;
    const visibleIds = filteredConversations.map((conversation) => conversation.id);
    if (selectedChat === null || !visibleIds.includes(selectedChat)) {
      setSelectedChat(visibleIds[0] ?? conversations[0]?.id ?? null);
    }
  }, [statusFilter, filteredConversations, selectedChat, conversations]);

  const activeChat = useMemo(() => {
    if (statusFilter === 'All') {
      return conversations.find((conversation) => conversation.id === selectedChat) ?? conversations[0];
    }

    return (
      filteredConversations.find((conversation) => conversation.id === selectedChat) ??
      filteredConversations[0] ??
      conversations.find((conversation) => conversation.id === selectedChat) ??
      conversations[0]
    );
  }, [selectedChat, conversations, statusFilter, filteredConversations]);

  const handleSendMessage = () => {
    if (!activeChat || !newMessage.trim()) return;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeChat.id
          ? {
              ...conversation,
              unread: 0,
              lastMessage: newMessage.trim(),
              messages: [
                ...conversation.messages,
                { sender: 'staff', text: newMessage.trim(), time: 'Now' },
              ],
            }
          : conversation
      )
    );
    setNewMessage('');
  };

  const handleStartNewChat = () => {
    if (!newChatTitle.trim() || !newChatMessage.trim()) return;

    const newId = Math.max(0, ...conversations.map((chat) => chat.id)) + 1;
    const newConversation: Conversation = {
      id: newId,
      title: newChatTitle.trim(),
      status: 'Open',
      unread: 0,
      handler: user?.fullName || 'Staff',
      lastMessage: newChatMessage.trim(),
      messages: [
        { sender: 'staff', text: newChatMessage.trim(), time: 'Now' },
      ],
    };

    setConversations((current) => [newConversation, ...current]);
    setSelectedChat(newId);
    setNewChatTitle('');
    setNewChatMessage('');
    setShowNewChat(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <StaffLayout activePage="inbox" user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Chat</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Reply to guest requests, track open conversations, and keep all hotel communication in one place.
            </p>
          </div>
          <button
            onClick={() => setShowNewChat(true)}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-white shadow-sm transition hover:bg-slate-700"
          >
            + New Conversation
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
          <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-slate-500 text-sm uppercase tracking-[0.16em]">Filter</p>
                <h2 className="text-xl font-semibold">Conversations</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['All', 'Open', 'On Hold', 'Closed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      statusFilter === filter
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="search"
                placeholder="Search conversations"
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
            </div>

            <div className="max-h-[640px] space-y-3 overflow-y-auto pr-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                    selectedChat === conversation.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{conversation.title}</p>
                      <p className="text-sm text-slate-500">Handled by {conversation.handler}</p>
                    </div>
                    <span className="text-xs text-slate-500">{conversation.status}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-600 line-clamp-2">{conversation.lastMessage}</p>
                    {conversation.unread > 0 ? (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">{conversation.unread}</span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-slate-500 text-sm uppercase tracking-[0.16em]">Chat details</p>
                <h2 className="text-2xl font-semibold text-slate-900">{activeChat?.title}</h2>
              </div>
              <span className="rounded-full border px-4 py-2 text-sm text-slate-700">{activeChat?.status}</span>
            </div>

            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-2">
              {activeChat?.messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-3 text-sm shadow-sm ${
                      message.sender === 'staff' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="mt-2 text-xs text-slate-400">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <input
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Write a reply..."
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
              <button
                onClick={handleSendMessage}
                className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Create new conversation</h2>
                <p className="text-sm text-slate-500">Start a new guest or service request thread.</p>
              </div>
              <button
                onClick={() => setShowNewChat(false)}
                className="text-slate-500 transition hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Subject</label>
                <input
                  value={newChatTitle}
                  onChange={(event) => setNewChatTitle(event.target.value)}
                  placeholder="Room number or request summary"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Initial message</label>
                <textarea
                  value={newChatMessage}
                  onChange={(event) => setNewChatMessage(event.target.value)}
                  placeholder="Type the first message here..."
                  rows={5}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowNewChat(false)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartNewChat}
                  className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}

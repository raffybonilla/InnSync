"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#3a4659] text-white p-4 flex flex-col">

        <h1 className="text-2xl font-bold mb-6">Inn Sync</h1>

        {/* PROFILE MINI */}
        <div className="mb-6 flex items-center gap-3 bg-white/10 p-3 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
            U
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {user?.email || "User"}
            </span>
            <span className="text-xs text-white/70">Welcome back</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          <Link href="/user/dashboard" className="p-2 hover:bg-white/10 rounded">
            🏠 Dashboard
          </Link>

          <Link href="/user/profile" className="p-2 hover:bg-white/10 rounded">
            👤 Profile
          </Link>

          <Link href="/user/inbox" className="p-2 hover:bg-white/10 rounded">
            📩 Inbox
          </Link>

          <Link href="/user/wallet" className="p-2 hover:bg-white/10 rounded">
            💰 My Wallet
          </Link>

          <Link href="/user/notifications" className="p-2 hover:bg-white/10 rounded">
            🔔 Notifications
          </Link>

          <Link href="/user/settings" className="p-2 hover:bg-white/10 rounded">
            ⚙️ Settings
          </Link>

          <Link href="/user/help" className="p-2 hover:bg-white/10 rounded">
            ❓ Help & Support
          </Link>

        </nav>

        {/* LOGOUT */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="mt-auto text-left text-red-200 hover:bg-red-500/30 p-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="fixed bottom-0 left-64 right-0 bg-[#3a4659] text-white text-xs py-3 flex justify-center gap-6">

        <Link href="/terms">Terms & Conditions</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/cookies">Cookie Policy</Link>

      </footer>

    </div>
  );
}
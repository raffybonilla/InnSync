"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();

      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  // ✅ IMPORTANT FIX (NO FLICKER)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const showSidebar = user && !isAuthPage;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      {showSidebar && (
        <aside className="w-64 bg-[#3a4659] text-white p-4 flex flex-col">

          <h1 className="text-xl font-bold mb-6">Inn Sync</h1>

          <nav className="flex flex-col gap-2">

            <Link href="/user/dashboard">🏠 Dashboard</Link>
            <Link href="/hotels">🏨 Hotels</Link>
            <Link href="/user/profile">👤 Profile</Link>
            <Link href="/user/wallet">💰 Wallet</Link>

          </nav>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="mt-auto text-red-300"
          >
            Logout
          </button>

        </aside>
      )}

      {/* MAIN */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}
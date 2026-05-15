"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const showSidebar = user && !isAuthPage;

  return (
    <div className="flex min-h-screen">

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

      {/* CONTENT */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
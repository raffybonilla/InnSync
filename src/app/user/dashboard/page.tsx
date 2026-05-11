"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UserDashboard() {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  // 🔔 NOTIFICATION COUNT (SYNCED WITH ALERTS LOGIC)
  const [notifCount, setNotifCount] = useState(0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // 🔥 FETCH NOTIFICATIONS FROM SAME SOURCE (bookings-based alerts)
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("id");

    if (!error && data) {
      setNotifCount(data.length);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // optional auto refresh sync (keeps badge updated)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ RESET WHEN USER CLEARS NOTIFICATIONS PAGE
  const handleMarkAsReadSync = () => {
    setNotifCount(0);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-white shadow-md p-5 space-y-4">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Inn Sync
        </h1>

        <Link
          href="/user/profile"
          className="block text-gray-700 hover:text-blue-600 transition"
        >
          👤 Profile
        </Link>

        <div className="font-semibold text-blue-600">
          🏠 Dashboard
        </div>

        <Link
          href="/user/inbox"
          className="block text-gray-700 hover:text-blue-600 transition"
        >
          📩 Inbox
        </Link>

        <Link
          href="/user/wallet"
          className="block text-gray-700 hover:text-blue-600 transition"
        >
          💰 My Wallet
        </Link>

        {/* 🔔 NOTIFICATIONS (SYNCED BADGE) */}
        <Link
          href="/user/notifications"
          onClick={handleMarkAsReadSync}
          className="block text-gray-700 hover:text-blue-600 relative transition"
        >
          🔔 Notifications

          {notifCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {notifCount > 99 ? "99+" : notifCount}
            </span>
          )}
        </Link>

        {/* LOGOUT */}
        <button
          onClick={() => setShowLogout(true)}
          className="mt-10 bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 text-gray-800">

        {/* HEADER */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

          <h2 className="text-xl font-bold text-gray-800">
            Dashboard
          </h2>

          <Link
            href="/user/profile"
            className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 text-sm font-medium text-gray-700 transition"
          >
            My Profile
          </Link>

        </div>

        {/* HERO */}
        <div className="bg-blue-600 text-white p-10">

          <h2 className="text-3xl font-bold">
            Find your perfect stay in Cebu
          </h2>

          <p className="mt-2 opacity-90">
            Search hotels, compare prices, and book instantly
          </p>

          <div className="mt-5 flex gap-2">

            <input
              placeholder="Search hotels..."
              className="w-full p-3 rounded text-black outline-none"
            />

            <button className="bg-black text-white px-6 rounded hover:bg-gray-800 transition">
              Search
            </button>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="p-6 grid md:grid-cols-1 gap-4">

          <Link
            href="/hotels"
            className="bg-white p-6 rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-gray-800">
              🏨 Book Hotels
            </h3>

            <p className="text-gray-600 mt-1">
              Browse hotels in Cebu and view details
            </p>
          </Link>

        </div>

        {/* EXTRA SECTIONS */}
        <div className="p-6 grid md:grid-cols-2 gap-4">

          <div className="bg-white p-5 rounded shadow">
            <h3 className="font-bold text-lg mb-2 text-gray-800">
              🏨 Recommended Hotels
            </h3>

            <p className="text-gray-500">
              Top picks for you in Cebu.
            </p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <h3 className="font-bold text-lg mb-2 text-gray-800">
              ℹ️ About Us
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Inn Sync is a modern hotel booking platform designed for travelers in Cebu.
              We aim to make booking faster, easier, and more reliable.
            </p>
          </div>

        </div>

      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center">

            <h2 className="text-xl font-semibold text-gray-800">
              Log out of Inn Sync?
            </h2>

            <p className="text-gray-500 mt-2">
              You will need to sign in again.
            </p>

            <div className="flex gap-3 mt-6">

              {/* ✅ FIXED CANCEL BUTTON (VISIBLE NOW) */}
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UserDashboard() {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-white shadow-md p-5 space-y-4">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Inn Sync
        </h1>

        <Link href="/user/profile" className="block hover:text-blue-600">
          👤 Profile
        </Link>

        <div className="font-semibold text-blue-600">
          🏠 Dashboard
        </div>

        <Link href="/user/inbox" className="block hover:text-blue-600">
          📩 Inbox
        </Link>

        <Link href="/user/wallet" className="block hover:text-blue-600">
          💰 My Wallet
        </Link>

        <Link href="/user/bookings" className="block hover:text-blue-600">
          🏨 Booking History
        </Link>

        <Link href="/user/notifications" className="block hover:text-blue-600">
          🔔 Notifications
        </Link>

        {/* LOGOUT */}
        <button
          onClick={() => setShowLogout(true)}
          className="mt-10 bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1">

        {/* HEADER */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

          <h2 className="text-xl font-bold">
            Dashboard
          </h2>

          <Link
            href="/user/profile"
            className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 text-sm font-medium"
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
              className="w-full p-3 rounded text-black"
            />

            <button className="bg-black px-6 rounded">
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
            <h3 className="text-xl font-bold">
              🏨 Book Hotels
            </h3>

            <p className="text-gray-600 mt-1">
              Browse hotels in Cebu and view details
            </p>
          </Link>

        </div>

        {/* ================= EXTRA SECTIONS ================= */}
        <div className="p-6 grid md:grid-cols-2 gap-4">

          {/* Recommended Hotels */}
          <div className="bg-white p-5 rounded shadow">

            <h3 className="font-bold text-lg mb-2">
              🏨 Recommended Hotels
            </h3>

            <p className="text-gray-500">
              Top picks for you in Cebu.
            </p>

          </div>

          {/* About Us */}
          <div className="bg-white p-5 rounded shadow">

            <h3 className="font-bold text-lg mb-2">
              ℹ️ About Us
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Inn Sync is a modern hotel booking platform designed for travelers in Cebu.
              We aim to make booking faster, easier, and more reliable with real-time
              availability, secure payments, and seamless user experience.
            </p>

          </div>

        </div>

      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center">

            <h2 className="text-xl font-semibold">
              Log out of Inn Sync?
            </h2>

            <p className="text-gray-500 mt-2">
              You will need to sign in again.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 bg-gray-100 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white py-2 rounded"
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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: number;
  hotel_name: string;
  status: "confirmed" | "pending" | "cancelled";
  created_at: string;
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "alerts">("alerts");
  const [bookings, setBookings] = useState<Booking[]>([]);

  // ✅ FETCH FROM SUPABASE
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setBookings(data);
      }
    };

    fetchBookings();
  }, []);

  // ✅ TIME FORMAT (e.g. "2 days ago")
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  // ✅ STATUS COLORS
  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">

        <Link
          href="/user/dashboard"
          className="text-2xl font-bold hover:text-blue-600"
        >
          ←
        </Link>

        <h1 className="text-2xl font-bold">
          Notifications
        </h1>

      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded ${
            activeTab === "bookings"
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          🏨 Recent Bookings
        </button>

        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 rounded ${
            activeTab === "alerts"
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          🔔 Alerts
        </button>

      </div>

      {/* CONTENT */}
      <div className="bg-white p-5 rounded shadow">

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div>

            <h2 className="font-bold text-lg mb-4">
              🏨 Your Bookings
            </h2>

            {bookings.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No bookings found.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">

                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="border-b pb-2 flex justify-between"
                  >

                    <div>
                      <p className="font-medium">
                        {b.hotel_name}
                      </p>

                      <p className="text-gray-500 text-xs">
                        {timeAgo(b.created_at)}
                      </p>
                    </div>

                    <span className={`font-semibold ${statusColor(b.status)}`}>
                      {b.status.toUpperCase()}
                    </span>

                  </li>
                ))}

              </ul>
            )}

          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === "alerts" && (
          <div>

            <h2 className="font-bold text-lg mb-4">
              🔔 Alerts
            </h2>

            <p className="text-gray-500 text-sm">
              No new alerts right now.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: number;
  hotel_name: string;
  status: "confirmed" | "pending" | "cancelled";
  created_at: string;

  total_price?: number;
  payment_method?: string;
  payment_amount?: number;
  used_wallet_cashback?: boolean;
};

type Alert = {
  id: number;
  type: "booking" | "payment" | "sale";
  message: string;
  date: string;
};

export default function NotificationsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"bookings" | "alerts">(
    "alerts"
  );

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔔 ALERTS
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "booking",
      message: "Your booking at Radisson Blu Cebu is confirmed!",
      date: "Today",
    },
    {
      id: 2,
      type: "payment",
      message: "Payment of ₱6000 successful via GCash.",
      date: "Today",
    },
    {
      id: 3,
      type: "sale",
      message: "You earned ₱250 cashback reward!",
      date: "1 day ago",
    },
  ]);

  // UI STATES
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(alerts.length);

  // FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setBookings(data ?? []);
    };

    fetchBookings();
  }, []);

  // TIME FORMAT
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  // STATUS COLORS
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

        {/* ALERTS + BADGE */}
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 rounded relative ${
            activeTab === "alerts"
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          🔔 Alerts ({unreadCount})

        </button>

      </div>

      {/* CONTENT */}
      <div className="bg-white p-5 rounded shadow">

        {errorMsg && (
          <p className="text-red-500 mb-3">
            {errorMsg}
          </p>
        )}

        {/* ================= BOOKINGS ================= */}
        {activeTab === "bookings" && (
          <div>

            <h2 className="font-bold text-lg mb-4">
              🏨 Full Bookings View
            </h2>

            {bookings.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No bookings found.
              </p>
            ) : (
              <div className="space-y-4">

                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="border rounded-xl p-5 bg-white shadow-sm"
                  >

                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold">
                          {b.hotel_name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          {timeAgo(b.created_at)}
                        </p>
                      </div>

                      <p className={`font-bold ${statusColor(b.status)}`}>
                        {b.status.toUpperCase()}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">

                      <div className="flex justify-between">
                        <p className="text-gray-500">Total Price</p>
                        <p>₱{b.total_price?.toLocaleString() ?? "0"}</p>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-gray-500">Payment Method</p>
                        <p>{b.payment_method ?? "N/A"}</p>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-gray-500">Paid Amount</p>
                        <p>₱{b.payment_amount?.toLocaleString() ?? "0"}</p>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-gray-500">Used Cashback</p>
                        <p>{b.used_wallet_cashback ? "Yes" : "No"}</p>
                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        {/* ================= ALERTS ================= */}
        {activeTab === "alerts" && (
          <div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="font-bold text-lg">
                🔔 Alerts
              </h2>

              <div className="flex gap-2 items-center relative">

                {/* SEARCH */}
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="border px-2 py-1 rounded text-sm"
                />

                {/* MENU */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-xl px-2"
                >
                  ⋯
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 bg-white border shadow rounded w-40 z-50">

                    <button
                      onClick={() => {
                        setUnreadCount(0);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      Mark all as read
                    </button>

                  </div>
                )}

              </div>

            </div>

            {/* ALERT LIST */}
            <div className="space-y-3">

              {alerts
                .filter((a) =>
                  a.message
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((a) => (
                  <div
                    key={a.id}
                    className="border p-4 rounded-lg bg-gray-50 flex justify-between"
                  >

                    <div>
                      <p className="font-medium">
                        {a.message}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {a.date}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        a.type === "booking"
                          ? "bg-green-100 text-green-700"
                          : a.type === "payment"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {a.type.toUpperCase()}
                    </span>

                  </div>
                ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
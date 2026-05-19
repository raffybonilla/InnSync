"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function NotificationsPage() {
  const [bookingTab, setBookingTab] = useState<"active" | "finished">("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

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

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-700";
      case "pending":
        return "text-yellow-700";
      case "cancelled":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );

  const finishedBookings = bookings.filter(
    (b) => b.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/user/dashboard" className="text-2xl font-bold">
          ←
        </Link>

        <h1 className="text-2xl font-bold">Bookings</h1>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-6 rounded shadow">

        {errorMsg && (
          <p className="text-red-600 mb-3 font-medium">
            {errorMsg}
          </p>
        )}

        <h2 className="font-bold text-xl mb-4">
          🏨 Your Bookings
        </h2>

        {/* TOGGLE */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setBookingTab("active")}
            className={`px-4 py-2 rounded font-semibold ${
              bookingTab === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setBookingTab("finished")}
            className={`px-4 py-2 rounded font-semibold ${
              bookingTab === "finished"
                ? "bg-gray-700 text-white"
                : "bg-gray-200"
            }`}
          >
            Finished
          </button>
        </div>

        {/* ACTIVE */}
        {bookingTab === "active" ? (
          activeBookings.length === 0 ? (
            <p className="text-gray-600">No active bookings.</p>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-xl p-5 bg-white shadow-sm"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-lg font-bold">
                        {b.hotel_name}
                      </h2>

                      <p className="text-sm text-gray-700">
                        Created: {timeAgo(b.created_at)}
                      </p>
                    </div>

                    <p className={`font-bold ${statusColor(b.status)}`}>
                      {b.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* FINISHED */
          finishedBookings.length === 0 ? (
            <p className="text-gray-600">No finished bookings.</p>
          ) : (
            <div className="space-y-4">
              {finishedBookings.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-xl p-5 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-lg font-bold">
                        {b.hotel_name}
                      </h2>

                      <p className="text-sm text-gray-700">
                        Created: {timeAgo(b.created_at)}
                      </p>
                    </div>

                    <p className={`font-bold ${statusColor(b.status)}`}>
                      {b.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
}
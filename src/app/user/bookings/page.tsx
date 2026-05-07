"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: number;
  hotel_name: string;
  created_at: string;
  status: "pending" | "confirmed" | "cancelled";
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔥 FETCH REAL BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("FETCH ERROR:", error);
        setErrorMsg(error.message);
        return;
      }

      setBookings(data ?? []);
    };

    fetchBookings();
  }, []);

  // ⏱️ TIME FORMAT
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  // 🎨 STATUS COLORS
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

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-white px-4 py-2 rounded shadow"
      >
        ← Back
      </button>

      {/* PAGE */}
      <div className="bg-white p-6 rounded shadow">

        <h1 className="text-2xl font-bold mb-4">
          🏨 My Bookings
        </h1>

        {/* ❗ ERROR DISPLAY */}
        {errorMsg && (
          <p className="text-red-500 mb-3">
            {errorMsg}
          </p>
        )}

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <p className="text-gray-500">
            No bookings found.
          </p>
        ) : (
          <div className="space-y-3">

            {bookings.map((b) => (
              <div
                key={b.id}
                className="border p-4 rounded flex justify-between items-center"
              >

                {/* LEFT */}
                <div>
                  <h2 className="font-semibold">
                    {b.hotel_name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {formatDate(b.created_at)}
                  </p>
                </div>

                {/* RIGHT STATUS */}
                <p className={`font-bold ${statusColor(b.status)}`}>
                  {b.status.toUpperCase()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
} 
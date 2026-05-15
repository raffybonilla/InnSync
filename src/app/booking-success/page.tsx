"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function BookingSuccessPage() {
  const router = useRouter();
  const inserted = useRef(false);

  // ================= SUCCESS ALERT =================
  useEffect(() => {
    const createNotification = async () => {
      if (inserted.current) return;
      inserted.current = true;

      try {
        const { error } = await supabase.from("alerts").insert([
          {
            type: "booking",
            message: "🎉 Booking successful!",
            created_at: new Date().toISOString(),
            read: false,
          },
        ]);

        if (error) {
          console.log("Alert insert error:", error.message);
        }
      } catch (err: any) {
        console.log("Unexpected error:", err.message);
      }
    };

    createNotification();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow text-center w-[320px]">

        <h1 className="text-2xl font-bold text-green-600">
          🎉 Booking Successful
        </h1>

        <p className="mt-3 text-gray-600">
          Your hotel reservation has been confirmed.
        </p>

        <div className="mt-5 flex flex-col gap-3">

          <button
            onClick={() => router.push("/user/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/hotels")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Book Another Room
          </button>

        </div>

      </div>
    </div>
  );
}
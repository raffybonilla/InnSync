"use client";

import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="mb-4 bg-white px-4 py-2 rounded shadow"
      >
        ← Back
      </button>

      {/* PAGE TITLE */}
      <div className="bg-white p-6 rounded shadow">

        <h1 className="text-2xl font-bold mb-4">
          🏨 My Bookings
        </h1>

        {/* SAMPLE BOOKINGS */}
        <div className="space-y-3">

          <div className="border p-4 rounded">
            <h2 className="font-semibold">
              Radisson Blu Cebu
            </h2>

            <p className="text-sm text-gray-500">
              May 7, 2026
            </p>

            <p className="text-green-600 font-semibold mt-1">
              BOOKED ✔
            </p>
          </div>

          <div className="border p-4 rounded">
            <h2 className="font-semibold">
              Shangri-La Mactan
            </h2>

            <p className="text-sm text-gray-500">
              May 5, 2026
            </p>

            <p className="text-green-600 font-semibold mt-1">
              BOOKED ✔
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
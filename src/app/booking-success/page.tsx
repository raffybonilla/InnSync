"use client";

import { useRouter } from "next/navigation";

export default function BookingSuccessPage() {
  const router = useRouter();

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
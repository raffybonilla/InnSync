"use client";

import { useParams } from "next/navigation";

export default function HotelDetails() {
  const { id } = useParams();

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        Hotel Details (ID: {id})
      </h1>

      <p className="mt-2 text-gray-600">
        This is where hotel info + booking + payment will be shown.
      </p>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Book Now
      </button>

    </div>
  );
}
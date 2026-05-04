"use client";

import Link from "next/link";

const hotels = [
  { id: 1, name: "Radisson Blu Cebu", price: "₱6,000/night" },
  { id: 2, name: "Shangri-La Mactan", price: "₱12,000/night" },
  { id: 3, name: "Marco Polo Cebu", price: "₱5,500/night" },
];

export default function HotelsPage() {
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Cebu Hotels
      </h1>

      <div className="grid gap-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white p-4 rounded shadow">

            <h2 className="font-bold text-lg">{hotel.name}</h2>
            <p className="text-gray-600">{hotel.price}</p>

            <Link
              href={`/hotels/${hotel.id}`}
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>

          </div>
        ))}
      </div>

    </div>
  );
}
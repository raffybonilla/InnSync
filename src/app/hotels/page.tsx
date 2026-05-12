"use client";

import { useRouter } from "next/navigation";

const hotels = [
  {
    id: 1,
    name: "Radisson Blu Cebu",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    caption: "Iconic luxury hotel near SM City Cebu",
  },
  {
    id: 2,
    name: "Shangri-La Mactan",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    caption: "Luxury beachfront resort in Mactan Island",
  },
  {
    id: 3,
    name: "Quest Hotel Cebu",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
    caption: "Affordable stay in Cebu business district",
  },
];

export default function HotelsPage() {
  const router = useRouter();

  return (
    <div className="p-6">

      {/* ================= HEADER WITH BACK BUTTON ================= */}
      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => router.push("/user/dashboard")}
          className="text-2xl font-bold hover:scale-110 transition"
        >
          ←
        </button>

        <h1 className="text-3xl font-bold">
          Hotels / Airbnb Cebu
        </h1>

      </div>

      {/* ================= HOTEL GRID ================= */}
      <div className="grid md:grid-cols-3 gap-5">

        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="border rounded-xl overflow-hidden shadow cursor-pointer hover:scale-[1.02] transition"
            onClick={() => router.push(`/hotels/${hotel.id}`)}
          >

            <img
              src={hotel.image}
              className="h-52 w-full object-cover"
              alt={hotel.name}
            />

            <div className="p-4">

              <h2 className="font-bold text-xl">
                {hotel.name}
              </h2>

              <p className="text-gray-600">
                {hotel.caption}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
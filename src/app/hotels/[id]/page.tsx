"use client";

import { useParams, useRouter } from "next/navigation";

const hotels = [
  {
    id: 1,
    name: "Radisson Blu Cebu",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.8,
    details: "Deluxe Room • City View",
    amenities: ["Free WiFi", "Free Breakfast", "Pool", "Max 2 Guests"],
  },
  {
    id: 2,
    name: "Shangri-La Mactan",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    rating: 4.9,
    details: "Ocean View • Beach Access",
    amenities: ["Free WiFi", "Breakfast", "Beach Access", "Max 3 Guests"],
  },
];

export default function HotelDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const hotel = hotels.find((h) => h.id === Number(params.id));

  if (!hotel)
    return (
      <p className="p-10 text-lg font-semibold text-gray-700">
        Hotel not found
      </p>
    );

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-900">

      {/* ================= BACK BUTTON (ADDED) ================= */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black font-semibold text-lg"
      >
        <span className="text-2xl">←</span>
        Back
      </button>

      {/* ================= IMAGE ================= */}
      <img
        src={hotel.image}
        className="w-full h-96 object-cover rounded-xl shadow-lg"
      />

      {/* ================= TITLE ================= */}
      <h1 className="text-4xl font-bold mt-5 text-gray-900">
        {hotel.name}
      </h1>

      {/* ================= RATING ================= */}
      <p className="text-lg font-semibold text-yellow-600 mt-2">
        ⭐ {hotel.rating}
      </p>

      {/* ================= DETAILS ================= */}
      <p className="mt-3 text-lg text-gray-800 font-medium">
        {hotel.details}
      </p>

      {/* ================= AMENITIES ================= */}
      <h2 className="text-2xl font-bold mt-8 text-gray-900">
        Amenities
      </h2>

      <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-800 text-lg font-medium">
        {hotel.amenities.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>

      {/* ================= BUTTON ================= */}
      <button
        onClick={() =>
          router.push(`/user/wallet?hotel=${hotel.id}`)
        }
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md"
      >
        Book Now
      </button>
    </div>
  );
}
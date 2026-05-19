"use client";

import { useRouter } from "next/navigation";

const hotels = [
  {
    id: 1,
    name: "Radisson Blu Cebu",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rating: 4.8,
    price: 6000,
  },
  {
    id: 2,
    name: "Shangri-La Mactan",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    rating: 4.9,
    price: 12000,
  },
  {
    id: 3,
    name: "Quest Hotel Cebu",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    rating: 4.3,
    price: 5500,
  },
];

export default function HotelsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        Hotels in Cebu
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((h) => (
          <div
            key={h.id}
            onClick={() => router.push(`/hotels/${h.id}`)}
            className="bg-white rounded-xl shadow cursor-pointer overflow-hidden"
          >
            <img src={h.image} className="h-48 w-full object-cover" />

            <div className="p-4">
              <h2 className="font-bold text-xl">{h.name}</h2>
              <p className="text-gray-600">⭐ {h.rating}</p>
              <p className="font-bold text-blue-600">
                ₱{h.price}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/hotels/${h.id}`);
                }}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
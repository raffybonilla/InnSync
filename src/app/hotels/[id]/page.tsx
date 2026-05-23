"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  formatAmenities,
  LISTING_IMAGES,
  type ApiHotel,
  type ApiRoom,
} from "@/lib/dashboardListings";

export default function HotelDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<ApiHotel | null>(null);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const [hotelRes, roomsRes] = await Promise.all([
          fetch(`/api/hotels?hotelId=${hotelId}`),
          fetch("/api/rooms"),
        ]);

        if (hotelRes.ok) {
          const data = await hotelRes.json();
          setHotel(data.hotels?.[0] || null);
        }

        if (roomsRes.ok) {
          const data = await roomsRes.json();
          const available = (data.rooms || []).filter(
            (r: ApiRoom) => (r.status || "available") === "available"
          );
          setRooms(available);
        }
      } catch (error) {
        console.error("Error loading hotel:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) fetchHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <p className="p-10 text-lg font-semibold text-gray-700">Loading hotel...</p>
    );
  }

  if (!hotel) {
    return (
      <p className="p-10 text-lg font-semibold text-gray-700">Hotel not found</p>
    );
  }

  const amenityList = Array.from(
    new Set(rooms.flatMap((r) => r.amenities || []))
  );
  const amenityLabels = amenityList.length
    ? formatAmenities(amenityList).split(" • ")
    : ["WiFi", "Breakfast", "Pool Access"];

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-900">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-black font-semibold text-lg"
      >
        <span className="text-2xl">←</span>
        Back
      </button>

      <img
        src={LISTING_IMAGES[0]}
        alt={hotel.name}
        className="w-full h-96 object-cover rounded-xl shadow-lg"
      />

      <h1 className="text-4xl font-bold mt-5 text-gray-900">{hotel.name}</h1>

      <p className="text-lg font-semibold text-yellow-600 mt-2">
        ⭐ {hotel.rating || 4.5}
      </p>

      <p className="mt-3 text-lg text-gray-800 font-medium">📍 {hotel.location}</p>
      <p className="mt-1 text-gray-700">
        {hotel.available ?? 0} of {hotel.rooms ?? 0} rooms available
      </p>

      {rooms.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8 text-gray-900">Available Rooms</h2>
          <ul className="mt-3 space-y-2">
            {rooms.map((room) => (
              <li
                key={room.id}
                onClick={() => router.push(`/rooms/${room.id}`)}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:border-blue-300 transition"
              >
                <p className="font-semibold">
                  Room {room.room_number} — {room.room_type}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {formatAmenities(room.amenities) || room.description}
                </p>
                <p className="text-blue-600 font-semibold mt-1">
                  ₱{room.price_per_night}/night • {room.capacity} guests
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="text-2xl font-bold mt-8 text-gray-900">Amenities</h2>

      <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-800 text-lg font-medium">
        {amenityLabels.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>

      <button
        onClick={() => router.push(`/user/wallet?hotel=${hotel.id}`)}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md"
      >
        Book Now
      </button>
    </div>
  );
}

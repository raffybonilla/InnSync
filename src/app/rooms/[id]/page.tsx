"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AMENITIES_MAP } from "@/lib/amenities";
import { LISTING_IMAGES, type ApiRoom } from "@/lib/dashboardListings";

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);

  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="flex gap-0.5">
        {stars.map((filled, i) => (
          <span key={i} className={filled ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
      <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
      <span className="text-gray-500 text-sm">123 rates</span>
    </div>
  );
}

export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [hotelName, setHotelName] = useState("Inn Sync Hotel");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const [roomRes, hotelsRes] = await Promise.all([
          fetch(`/api/rooms?id=${roomId}`),
          fetch("/api/hotels"),
        ]);

        if (roomRes.ok) {
          const data = await roomRes.json();
          setRoom(data.room);
        }

        if (hotelsRes.ok) {
          const data = await hotelsRes.json();
          const active = (data.hotels || []).find(
            (h: { status?: string }) => (h.status || "active") === "active"
          );
          if (active?.name) setHotelName(active.name);
        }
      } catch (error) {
        console.error("Error loading room:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-700 text-lg">Room not found</p>
      </div>
    );
  }

  const rating = 4.8;
  const sqm = 28 + room.capacity * 4;
  const guestLabel =
    room.capacity <= 1
      ? "1 adult"
      : room.capacity === 2
        ? "2 adults"
        : `${room.capacity - 1}-${room.capacity} adults`;

  const description =
    room.description ||
    `Enjoy a comfortable stay in our ${room.room_type.toLowerCase()}, located in Cebu City. ` +
      `This room accommodates up to ${room.capacity} guest${room.capacity === 1 ? "" : "s"} with modern amenities, ` +
      `free Wi-Fi, and everything you need for a relaxing visit.`;

  const amenityIds = room.amenities?.length
    ? room.amenities
    : ["wifi", "aircon", "tv", "breakfast"];

  const imageIndex =
    parseInt(room.room_number.replace(/\D/g, ""), 10) || 0;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <button
        onClick={() => router.back()}
        className="mx-6 mt-6 flex items-center gap-2 text-gray-700 hover:text-black font-medium"
      >
        <span className="text-xl">←</span> Back
      </button>

      {/* Hero image */}
      <div className="mt-4 px-6">
        <img
          src={LISTING_IMAGES[imageIndex % LISTING_IMAGES.length]}
          alt={room.room_type}
          className="w-full h-[320px] md:h-[400px] object-cover"
        />
      </div>

      {/* Room info */}
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {room.room_type}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-4 h-4 bg-yellow-400 shrink-0" />
                  <span className="text-gray-800 font-medium">{hotelName}</span>
                </div>
              </div>
              <StarRating rating={rating} />
            </div>

            <p className="text-gray-500 mt-3 text-sm md:text-base">
              {sqm} sqm | {guestLabel} | Room {room.room_number}
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed max-w-3xl">
              {description}
            </p>

            <p className="mt-4 text-lg font-semibold text-gray-900">
              ₱{room.price_per_night.toLocaleString()}{" "}
              <span className="text-sm font-normal text-gray-500">per night</span>
            </p>
          </div>

          <button
            onClick={() => router.push(`/user/wallet?room=${room.id}`)}
            className="shrink-0 bg-[#3d9e4f] hover:bg-[#358a45] text-white font-semibold text-lg px-10 py-4 rounded-md shadow-sm self-start lg:mt-16"
          >
            Book Now!
          </button>
        </div>

        {/* Main amenities */}
        <div className="mt-12 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Main Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 max-w-4xl">
            {amenityIds.map((id) => {
              const amenity = AMENITIES_MAP[id];
              if (!amenity) return null;
              return (
                <div key={id} className="flex flex-col items-center text-center">
                  <span className="text-4xl mb-3">{amenity.icon}</span>
                  <span className="text-sm text-gray-800 leading-snug max-w-[140px]">
                    {amenity.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

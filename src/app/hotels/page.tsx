"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Amenities from "@/components/Amenities";
import { LISTING_IMAGES } from "@/lib/dashboardListings";

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  revenue: string;
  rooms?: number;
  available?: number;
  status?: string;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  amenities?: string[];
  description?: string;
  status?: string;
}

export default function HotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hotelsRes, roomsRes] = await Promise.all([
          fetch("/api/hotels"),
          fetch("/api/rooms"),
        ]);

        if (hotelsRes.ok) {
          const hotelsData = await hotelsRes.json();
          setHotels(
            (hotelsData.hotels || []).filter(
              (h: Hotel) => (h.status || "active") === "active"
            )
          );
        }

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(
            (roomsData.rooms || []).filter(
              (r: Room) => (r.status || "available") === "available"
            )
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const hasHotels = hotels.length > 0;
  const hasRooms = rooms.length > 0;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-2">Explore Our Hotels</h1>
      <p className="text-gray-600 mb-8">Find your perfect accommodation</p>

      {!hasHotels && !hasRooms ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hotels or rooms available at the moment</p>
        </div>
      ) : (
        <div className="space-y-12">
          {hasHotels && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => {
                const hotelRooms = rooms;
                const availableRooms = hotelRooms.filter(
                  (r) => r.status === "available"
                ).length;
                const avgPrice =
                  hotelRooms.length > 0
                    ? Math.round(
                        hotelRooms.reduce((sum, r) => sum + r.price_per_night, 0) /
                          hotelRooms.length
                      )
                    : 0;
                const combinedAmenities = Array.from(
                  new Set(hotelRooms.flatMap((r) => r.amenities || []))
                );

                return (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                    onClick={() => router.push(`/hotels/${hotel.id}`)}
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <div className="text-6xl">🏨</div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="font-bold text-xl text-slate-900">{hotel.name}</h2>
                          <p className="text-sm text-gray-600">📍 {hotel.location}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                          ⭐ {hotel.rating || 4.5}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                        <div>🛏️ {hotelRooms.length} rooms</div>
                        <div>✅ {availableRooms} available</div>
                      </div>

                      {combinedAmenities.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Popular Amenities:
                          </p>
                          <Amenities
                            amenities={combinedAmenities}
                            maxDisplay={4}
                            layout="row"
                            size="sm"
                          />
                        </div>
                      )}

                      <div className="border-t pt-4 flex items-center justify-between">
                        {avgPrice > 0 && (
                          <div>
                            <p className="text-xs text-gray-500">From per night</p>
                            <p className="font-bold text-lg text-blue-600">
                              ₱{avgPrice.toLocaleString()}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/hotels/${hotel.id}`);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          View Hotel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasRooms && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                    onClick={() => router.push(`/rooms/${room.id}`)}
                  >
                    <img
                      src={LISTING_IMAGES[index % LISTING_IMAGES.length]}
                      alt={room.room_type}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h2 className="font-bold text-xl text-slate-900">{room.room_type}</h2>
                      <p className="text-sm text-gray-600 mt-1">Room {room.room_number}</p>
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="mt-3">
                          <Amenities amenities={room.amenities} maxDisplay={3} layout="row" size="sm" />
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <p className="font-bold text-lg text-blue-600">
                          ₱{room.price_per_night.toLocaleString()}
                          <span className="text-xs font-normal text-gray-500"> / night</span>
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/rooms/${room.id}`);
                          }}
                          className="px-4 py-2 bg-[#3d9e4f] text-white rounded-lg hover:bg-[#358a45] font-medium"
                        >
                          View Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

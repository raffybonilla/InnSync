"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { bookingStore } from "@/lib/bookingStore";

// ================= HOTEL DATA (FROM YOUR ORIGINAL) =================
const hotels: any = {
  "1": {
    name: "Radisson Blu Cebu",
    rooms: [
      {
        name: "Deluxe Room",
        price: 6000,
        guests: 2,
        rating: 4.6,
        inclusions: "Breakfast • Pool • WiFi • City View",
        image:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        caption: "Modern comfort room overlooking Cebu skyline",
      },
      {
        name: "Executive Suite",
        price: 9000,
        guests: 3,
        rating: 4.8,
        inclusions: "Lounge Access • Breakfast • Premium View",
        image:
          "https://images.unsplash.com/photo-1551887373-6c1a4a3c8b6d",
        caption: "Spacious suite designed for premium relaxation",
      },
    ],
  },

  "2": {
    name: "Shangri-La Mactan",
    rooms: [
      {
        name: "Ocean View Room",
        price: 12000,
        guests: 2,
        rating: 4.9,
        inclusions: "Private Beach • Spa • Breakfast",
        image:
          "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101a",
        caption: "Wake up to ocean waves and sunrise views",
      },
    ],
  },

  "3": {
    name: "Quest Hotel Cebu",
    rooms: [
      {
        name: "Standard Room",
        price: 3500,
        guests: 2,
        rating: 4.3,
        inclusions: "WiFi • Breakfast • Gym Access",
        image:
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
        caption: "Simple and cozy room for budget travelers",
      },
    ],
  },
};

export default function HotelDetailPage() {
  const router = useRouter();
  const params = useParams();

  const hotelId = String(params.id);
  const hotel = hotels[hotelId];

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ================= SAFE CHECK =================
  if (!hotel) {
    return (
      <div className="p-6 text-red-600">
        <h1 className="text-xl font-bold">Hotel not found</h1>
        <p>Invalid ID: {hotelId}</p>

        <button
          className="mt-4 underline"
          onClick={() => router.push("/hotels")}
        >
          ← Back to Hotels
        </button>
      </div>
    );
  }

  // ================= ROOM SELECT =================
  const selectRoom = (room: any) => {
    setSelectedRoom(room);
    setShowConfirm(true);
  };

  const confirmRoom = () => {
    bookingStore.set({
      hotel: hotel.name,
      room: selectedRoom.name,
      price: selectedRoom.price,
      guests: selectedRoom.guests,
      checkIn: "",
      checkOut: "",
    });

    // 🔔 NOTIFICATION TRIGGER (ADDED)
    console.log("🔔 Notification: User booked a room");
    console.log(
      `Hotel: ${hotel.name}, Room: ${selectedRoom.name}, Price: ₱${selectedRoom.price}`
    );

    // OPTIONAL (future use if you add notifications store)
    // localStorage.setItem(
    //   "latestNotification",
    //   JSON.stringify({
    //     type: "booking",
    //     message: `Booked ${selectedRoom.name} at ${hotel.name}`,
    //   })
    // );

    setShowConfirm(false);

    router.push(`/hotels/${hotelId}/checkout`);
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">

      {/* HEADER */}
      <button
        onClick={() => router.push("/hotels")}
        className="mb-5 underline"
      >
        ← Back to Hotels
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {hotel.name}
      </h1>

      {/* ================= ROOMS ================= */}
      <div className="grid md:grid-cols-2 gap-5">

        {hotel.rooms.map((room: any, index: number) => (
          <div
            key={index}
            className="border rounded-xl overflow-hidden shadow bg-white hover:scale-[1.01] transition"
          >

            <img
              src={room.image}
              alt={room.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-4">

              <h2 className="text-xl font-bold">
                {room.name}
              </h2>

              <p className="text-green-600 font-bold">
                ₱{room.price}
              </p>

              <p className="mt-1">
                ⭐ {room.rating}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                {room.inclusions}
              </p>

              <p className="italic text-black/70 mt-2">
                {room.caption}
              </p>

              <button
                onClick={() => selectRoom(room)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Select Room
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-5 rounded-xl w-[300px] text-center">

            <h2 className="font-bold text-lg">
              Confirm Room
            </h2>

            <p className="mt-2">
              {selectedRoom.name}
            </p>

            <p>
              ₱{selectedRoom.price}
            </p>

            <div className="flex gap-2 mt-5">

              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded w-full"
              >
                Cancel
              </button>

              <button
                onClick={confirmRoom}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { bookingStore } from "@/lib/bookingStore";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = String(params.id);

  const booking = bookingStore.get?.() || {};

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(booking.guests || 1);

  if (!booking.hotel) {
    return (
      <div className="p-6 text-red-600">
        No booking found.
        <br />
        <button
          className="underline mt-3"
          onClick={() => router.push(`/hotels/${hotelId}`)}
        >
          ← Back to Hotel
        </button>
      </div>
    );
  }

  const extra =
    guests > booking.guests
      ? (guests - booking.guests) * 500
      : 0;

  const total = (booking.price || 0) + extra;

  const proceedToPayment = () => {
    bookingStore.set({
      ...booking,
      checkIn,
      checkOut,
      guests,
      total,
    });

    router.push("/payment");
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">

      <button
        onClick={() => router.push(`/hotels/${hotelId}`)}
        className="underline mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Checkout
      </h1>

      <div className="border p-4 rounded mb-4">
        <p><b>Hotel:</b> {booking.hotel}</p>
        <p><b>Room:</b> {booking.room}</p>
        <p><b>Base Price:</b> ₱{booking.price}</p>
      </div>

      <label>Check-in</label>
      <input
        type="date"
        className="border p-2 w-full mb-3"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />

      <label>Check-out</label>
      <input
        type="date"
        className="border p-2 w-full mb-3"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />

      <label>Guests</label>
      <input
        type="number"
        className="border p-2 w-full mb-3"
        value={guests}
        onChange={(e) => setGuests(+e.target.value)}
      />

      {extra > 0 && (
        <p className="text-red-600">
          Extra Charge: ₱{extra}
        </p>
      )}

      <p className="font-bold text-lg mt-3">
        Total: ₱{total}
      </p>

      <button
        onClick={proceedToPayment}
        className="bg-green-600 text-white w-full py-2 mt-5 rounded"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
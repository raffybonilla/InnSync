"use client";

import { useRouter } from "next/navigation";
import { bookingStore } from "@/lib/bookingStore";
import { useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const booking = bookingStore.get?.() || {};

  const [method, setMethod] = useState("GCash");
  const [account, setAccount] = useState("");

  const wallet = 1234;
  const cashback = 250;

  // ================= SAFE DATA =================
  const checkIn = booking.checkIn ? new Date(booking.checkIn) : null;
  const checkOut = booking.checkOut ? new Date(booking.checkOut) : null;

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  // ================= BASE PRICE =================
  const pricePerNight = booking.price || 0;

  // ================= GUEST LOGIC (NEW) =================
  const guests = booking.guests || 2;

  const extraGuests = Math.max(0, guests - 2);
  const extraFee = extraGuests * 500;

  // ================= TOTAL CALCULATION =================
  const baseTotal = pricePerNight * nights;
  const finalTotal = baseTotal + extraFee;

  const walletUse = 0;
  const cashbackUse = 0;

  const remaining = finalTotal - walletUse - cashbackUse;

  // ================= VALIDATION =================
  if (!booking.hotel) {
    return (
      <div className="p-6 text-red-600">
        No payment data found.
        <br />
        <button
          className="underline mt-3"
          onClick={() => router.push("/hotels")}
        >
          ← Back to Hotels
        </button>
      </div>
    );
  }

  // ================= CONFIRM BOOKING =================
  const confirmBooking = () => {
    bookingStore.set({
      ...booking,
      total: finalTotal,
      payment: method,
      account,
      status: "confirmed",
    });

    router.push("/booking-success");
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">

      <button
        onClick={() =>
          router.push(`/hotels/${booking.hotelId || 1}/checkout`)
        }
        className="underline mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Payment
      </h1>

      {/* ================= SUMMARY ================= */}
      <div className="border p-4 rounded mb-4">

        <p><b>Hotel:</b> {booking.hotel}</p>
        <p><b>Room:</b> {booking.room}</p>
        <p><b>Price per Night:</b> ₱{pricePerNight}</p>
        <p><b>Nights:</b> {nights}</p>
        <p><b>Guests:</b> {guests}</p>

        <hr className="my-2" />

        <p>Base Total: ₱{baseTotal}</p>
        <p>Extra Guests Fee: ₱{extraFee}</p>

        <hr className="my-2" />

        <p className="font-bold text-lg text-green-600">
          Final Total: ₱{finalTotal}
        </p>

      </div>

      {/* ================= PAYMENT METHOD ================= */}
      <div className="mb-4">
        <p className="font-bold">Payment Method</p>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2 w-full"
        >
          <option>GCash</option>
          <option>Maya</option>
          <option>PayPal</option>
          <option>Card</option>
        </select>
      </div>

      {/* ================= ACCOUNT ================= */}
      <div className="mb-4">
        <p className="font-bold">Account Number</p>
        <input
          className="border p-2 w-full"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="09XXXXXXXXX"
        />
      </div>

      {/* ================= REMAINING ================= */}
      <p className="text-red-600 font-bold">
        Remaining: ₱{remaining}
      </p>

      <button
        onClick={confirmBooking}
        className="bg-green-600 text-white w-full py-2 mt-5 rounded"
      >
        Confirm Booking
      </button>

    </div>
  );
}
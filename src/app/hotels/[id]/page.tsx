"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type PaymentMethod = "GCash" | "Card" | "";

export default function HotelDetails() {
  const { id } = useParams();
  const router = useRouter();

  const hotelPrices: Record<string, number> = {
    "1": 6000,
    "2": 12000,
    "3": 5500,
  };

  const price = hotelPrices[id as string] || 5000;

  // 💰 WALLET
  const [balance, setBalance] = useState(1234);
  const [cashback, setCashback] = useState(250);

  // OPTIONS
  const [useCashback, setUseCashback] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("GCash");

  // MODAL + UI
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const available = useCashback ? balance + cashback : balance;

  // 🏨 BOOKING LOGIC
  const handleConfirmBooking = async () => {
    setErrorMsg("");

    let newBalance = balance;
    let newCashback = cashback;

    if (useCashback) {
      const usedCashback = Math.min(cashback, price);
      newCashback = cashback - usedCashback;
    }

    newBalance = available - price;

    setBalance(newBalance);
    setCashback(newCashback);

    const { error } = await supabase.from("bookings").insert([
      {
        hotel_name: `Hotel ID ${id}`,
        price,
        status: "pending",
        payment_method: paymentMethod,
        created_at: new Date(),
      },
    ]);

    if (error) {
      setErrorMsg("Failed to save booking.");
      return;
    }

    setShowModal(false);
    setShowSuccess(true);
  };

  return (
    <div className="p-6">

      {/* BACK */}
      <button onClick={() => router.back()} className="mb-4 text-gray-600">
        ← Back
      </button>

      {/* INFO */}
      <h1 className="text-2xl font-bold">Hotel Details</h1>

      <p className="mt-2">Price: ₱{price}</p>

      <p className="text-sm text-gray-500">
        Available: ₱{available}
      </p>

      {/* ERROR */}
      {errorMsg && (
        <p className="text-red-500 mt-2">{errorMsg}</p>
      )}

      {/* OPTIONS */}
      <div className="mt-4 p-4 border rounded bg-white">

        <p className="font-medium mb-2">💰 Use Cashback</p>

        <div className="flex gap-2">
          <button
            onClick={() => setUseCashback(true)}
            className={`px-3 py-1 rounded ${
              useCashback ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Yes
          </button>

          <button
            onClick={() => setUseCashback(false)}
            className={`px-3 py-1 rounded ${
              !useCashback ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            No
          </button>
        </div>

        <p className="font-medium mt-4 mb-2">💳 Payment Method</p>

        <div className="flex gap-2">
          <button
            onClick={() => setPaymentMethod("GCash")}
            className={`px-3 py-1 rounded ${
              paymentMethod === "GCash"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            GCash
          </button>

          <button
            onClick={() => setPaymentMethod("Card")}
            className={`px-3 py-1 rounded ${
              paymentMethod === "Card"
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            Card
          </button>
        </div>

      </div>

      {/* BOOK BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-5 bg-green-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded w-[90%] max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-lg font-bold">
              Proceed with booking?
            </h2>

            <p className="text-gray-500 mt-2">
              Confirm your reservation.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleConfirmBooking();
                  setShowSuccess(true);
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}

      {/* SUCCESS */}
      {showSuccess && (
        <div className="mt-6 bg-green-100 p-4 rounded">

          <h2 className="text-green-700 font-bold">
            BOOKING SUCCESSFUL 🎉
          </h2>

          <div className="flex gap-3 mt-3">

            <button
              onClick={() => router.push("/user/notifications")}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Notifications
            </button>

            <button
              onClick={() => router.push("/user/dashboard")}
              className="bg-green-600 text-white px-3 py-2 rounded"
            >
              Dashboard
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
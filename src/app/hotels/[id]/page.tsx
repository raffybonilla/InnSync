"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type PaymentMethod = "GCash" | "Card" | "PayPal" | "";

export default function HotelDetails() {
  const { id } = useParams();
  const router = useRouter();

  const hotelPrices: Record<string, number> = {
    "1": 6000,
    "2": 12000,
    "3": 5500,
  };

  const hotelNames: Record<string, string> = {
    "1": "Radisson Blu Cebu",
    "2": "Shangri-La Mactan",
    "3": "Quest Hotel Cebu",
  };

  const price = hotelPrices[id as string] || 5000;
  const hotelName = hotelNames[id as string] || "Hotel";

  // WALLET
  const [balance, setBalance] = useState(1234);
  const [cashback, setCashback] = useState(250);

  // UI
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  // OPTIONS
  const [useCashback, setUseCashback] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("GCash");

  const [paymentAmount, setPaymentAmount] = useState("");

  // TOTAL WALLET
  const totalWallet = balance + cashback;

  // ✅ FIXED LOGIC (IMPORTANT)
  const walletApplied = useCashback ? totalWallet : 0;
  const remainingBalance = Math.max(price - walletApplied, 0);

  // BOOKING
  const handleBooking = async () => {
    setErrorMsg("");

    let updatedBalance = balance;
    let updatedCashback = cashback;

    // USE WALLET / CASHBACK
    if (useCashback) {
      let remaining = price;

      if (updatedCashback > 0) {
        const cashbackUsed = Math.min(updatedCashback, remaining);
        updatedCashback -= cashbackUsed;
        remaining -= cashbackUsed;
      }

      if (remaining > 0) {
        const balanceUsed = Math.min(updatedBalance, remaining);
        updatedBalance -= balanceUsed;
        remaining -= balanceUsed;
      }
    }

    setBalance(updatedBalance);
    setCashback(updatedCashback);

    const { error } = await supabase.from("bookings").insert([
      {
        hotel_name: hotelName,
        hotel_id: id,
        total_price: price,
        payment_method: paymentMethod,
        used_wallet_cashback: useCashback,
        payment_amount: Number(paymentAmount),
        status: "confirmed",
        created_at: new Date(),
      },
    ]);

    if (error) {
      setErrorMsg("Booking failed.");
      return;
    }

    setShowPaymentModal(false);
    setShowSuccess(true);
  };

  return (
    <div className="p-6">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-gray-600"
      >
        ← Back
      </button>

      {/* HOTEL INFO */}
      <h1 className="text-3xl font-bold">{hotelName}</h1>

      <p className="mt-3 text-lg font-medium">
        Price: ₱{price.toLocaleString()}
      </p>

      {errorMsg && (
        <p className="text-red-500 mt-3">{errorMsg}</p>
      )}

      {/* BOOK BUTTON */}
      <button
        onClick={() => setShowConfirm(true)}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
      >
        Book Now
      </button>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center">

            <h2 className="text-2xl font-bold">
              Proceed Booking?
            </h2>

            <p className="text-gray-500 mt-2">
              Continue your reservation.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  setShowPaymentModal(true);
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg"
              >
                Proceed
              </button>

            </div>

          </div>

        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[90%] max-w-md rounded-xl p-6">

            <h2 className="text-2xl font-bold">
              Payment Details
            </h2>

            {/* TOTAL */}
            <div className="mt-5">
              <p className="text-gray-600 text-sm">Total Price</p>
              <p className="text-2xl font-bold">
                ₱{price.toLocaleString()}
              </p>
            </div>

            {/* WALLET TOGGLE */}
            <div className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                checked={useCashback}
                onChange={() => setUseCashback(prev => !prev)}
              />

              <p className="text-sm">
                Use available balance or cashback
              </p>
            </div>

            {/* ✅ FIXED DISPLAY (NEVER DISAPPEARS) */}
            <div className="mt-5 bg-gray-100 p-3 rounded">

              <p className="text-sm text-gray-600">
                Wallet Applied
              </p>

              <p className="font-bold">
                ₱{walletApplied}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                Remaining Balance
              </p>

              <p className="text-xl font-bold">
                ₱{remainingBalance}
              </p>

            </div>

            {/* PAYMENT METHODS */}
            <div className="mt-5">

              <p className="font-medium mb-3">
                Select Payment Method
              </p>

              <div className="flex gap-2 flex-wrap">

                <button
                  onClick={() => setPaymentMethod("GCash")}
                  className={`px-4 py-2 rounded ${
                    paymentMethod === "GCash"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  GCash
                </button>

                <button
                  onClick={() => setPaymentMethod("Card")}
                  className={`px-4 py-2 rounded ${
                    paymentMethod === "Card"
                      ? "bg-black text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Card
                </button>

                <button
                  onClick={() => setPaymentMethod("PayPal")}
                  className={`px-4 py-2 rounded ${
                    paymentMethod === "PayPal"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  PayPal
                </button>

              </div>
            </div>

            {/* INPUT */}
            <div className="mt-5">
              <p className="font-medium mb-2">Enter Amount</p>

              <input
                type="number"
                value={paymentAmount}
                onChange={(e) =>
                  setPaymentAmount(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-7">

              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleBooking}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg"
              >
                Pay Now
              </button>

            </div>

          </div>

        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center">

            <h2 className="text-2xl font-bold text-green-600">
              Booking Successful 🎉
            </h2>

            <p className="mt-3 text-gray-600">
              Your booking has been confirmed.
            </p>

            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  router.push("/user/notifications")
                }
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Booking History
              </button>

              <button
                onClick={() =>
                  router.push("/user/dashboard")
                }
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Dashboard
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
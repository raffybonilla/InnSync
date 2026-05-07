"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

type Transaction = {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
};

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

  // 📜 DATA
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // ⚠️ UI STATES
  const [errorMsg, setErrorMsg] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  // 💳 PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");

  // ✅ SUCCESS
  const [showSuccess, setShowSuccess] = useState(false);

  const total = balance + cashback;
  const needed = price > total ? price - total : 0;

  // 🏨 FINAL BOOKING FUNCTION
  const completeBooking = () => {
    const currentTotal = balance + cashback;

    let remaining = currentTotal - price;

    const newCashback = Math.min(cashback, remaining);
    const newBalance = remaining - newCashback;

    setBalance(newBalance);
    setCashback(newCashback);

    // ✅ SAVE BOOKING
    setBookings([
      {
        id: Date.now(),
        title: `Hotel ID ${id} - BOOKED ✔`,
        date: new Date().toISOString().split("T")[0],
        price,
      },
      ...bookings,
    ]);

    // ✅ SAVE TRANSACTION
    setTransactions([
      {
        id: Date.now(),
        title: `Hotel Booking (ID: ${id})`,
        date: new Date().toISOString().split("T")[0],
        amount: -price,
        type: "debit",
      },
      ...transactions,
    ]);

    setErrorMsg("");
    setShowTopUp(false);
    setShowSuccess(true);
  };

  // 💳 TOP-UP
  const handleTopUp = () => {
    const amount = Number(topUpAmount);

    if (!paymentMethod) {
      setErrorMsg("Please select payment method (GCash or Card)");
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMsg("Enter valid amount");
      return;
    }

    const updatedBalance = balance + amount;

    setBalance(updatedBalance);

    // ✅ SAVE TOP-UP TRANSACTION
    setTransactions([
      {
        id: Date.now(),
        title: `Top-up via ${paymentMethod}`,
        date: new Date().toISOString().split("T")[0],
        amount,
        type: "credit",
      },
      ...transactions,
    ]);

    setErrorMsg("");
    setTopUpAmount("");

    // ✅ AUTO BOOK AFTER TOP-UP
    const newTotal = updatedBalance + cashback;

    if (newTotal >= price) {
      completeBooking();
    }
  };

  // 🏨 BOOK BUTTON
  const handleBook = () => {
    const currentTotal = balance + cashback;

    // ❌ INSUFFICIENT
    if (price > currentTotal) {
      setErrorMsg(`❌ Insufficient balance. Need ₱${needed}`);
      setShowTopUp(true);
      return;
    }

    // ✅ ENOUGH BALANCE
    completeBooking();
  };

  return (
    <div className="p-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="mb-4 text-gray-600"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-2xl font-bold">
        Hotel Details (ID: {id})
      </h1>

      {/* PRICE */}
      <p className="mt-2 text-gray-600">
        Price: ₱{price}
      </p>

      {/* WALLET */}
      <p className="text-sm text-gray-500">
        Available Balance + Cashback: ₱{total}
      </p>

      {/* ERROR */}
      {errorMsg && (
        <p className="mt-3 text-red-500 font-medium">
          {errorMsg}
        </p>
      )}

      {/* BOOK BUTTON */}
      <button
        onClick={handleBook}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>

      {/* 💳 TOP-UP SECTION */}
      {showTopUp && (
        <div className="mt-6 p-4 border rounded bg-gray-50">

          <h2 className="font-bold mb-2">
            Top-up Wallet
          </h2>

          {/* PAYMENT METHOD */}
          <div className="mb-3">

            <p className="text-sm mb-1">
              Select Payment Method:
            </p>

            <button
              onClick={() => setPaymentMethod("GCash")}
              className={`px-3 py-1 mr-2 rounded ${
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

          {/* INPUT */}
          <input
            type="number"
            placeholder={`Enter amount (Need ₱${needed})`}
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          {/* PAY NOW */}
          <button
            onClick={handleTopUp}
            disabled={!topUpAmount || !paymentMethod}
            className={`w-full px-4 py-2 rounded text-white ${
              topUpAmount && paymentMethod
                ? "bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>

          <p className="text-xs text-gray-500 mt-2">
            Using: {paymentMethod || "None"}
          </p>

        </div>
      )}

      {/* ✅ SUCCESS */}
      {showSuccess && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">

          <h2 className="text-green-700 font-bold text-lg">
            ✅ BOOKED
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Your booking has been confirmed successfully.
          </p>

          <div className="flex gap-3 mt-4">

            <button
              onClick={() => router.push("/user/wallet")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Transaction History
            </button>

            <button
              onClick={() => router.push("/user/dashboard")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Recent Bookings
            </button>

          </div>

        </div>
      )}

      {/* BOOKINGS */}
      {bookings.length > 0 && (
        <div className="mt-8">

          <h2 className="font-bold mb-2">
            Recent Bookings
          </h2>

          {bookings.map((b) => (
            <div key={b.id} className="border-b py-2">

              <p className="font-medium">
                {b.title}
              </p>

              <p className="text-xs text-gray-500">
                {b.date}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
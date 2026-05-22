"use client";

import { useMemo, useState } from "react";

type PaymentMethod = "gcash" | "maya" | "paypal" | "card" | null;

export default function PaymentPage() {
  /* ================= MOCK DATA ================= */
  const room = {
    name: "Deluxe Room",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    location: "Radisson Blu Cebu",
    pricePerNight: 6000,
    maxGuests: 2,
  };

  const [checkIn, setCheckIn] = useState("2026-05-20");
  const [checkOut, setCheckOut] = useState("2026-05-22");
  const [guests, setGuests] = useState(2);

  const [useWallet, setUseWallet] = useState(false);
  const walletBalance = 5000;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [accountInput, setAccountInput] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= CALCULATIONS ================= */

  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const perNight = room.pricePerNight;
  const baseTotal = perNight * nights;

  const extraGuestCost =
    guests > room.maxGuests ? (guests - room.maxGuests) * 500 : 0;

  const totalAmount = baseTotal + extraGuestCost;

  /* ================= FIXED WALLET LOGIC (DISCOUNT ONLY) ================= */

  const walletDiscount = useWallet
    ? Math.min(walletBalance, totalAmount)
    : 0;

  const remainingToPay = totalAmount - walletDiscount;

  /* ================= PAY ================= */

  const handlePay = () => {
    if (!paymentMethod) return alert("Please select payment method");

    if (paymentMethod !== "card") {
      if (accountInput.length !== 11) {
        return alert("Enter valid 11-digit number");
      }
    }

    // If wallet fully covers, no need payment method validation issue
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#1d2433] text-white p-6 hidden lg:flex flex-col justify-between">

        <div>
          <div className="flex flex-col items-center mb-10">
            <img
              src="/profile.jpg"
              className="w-20 h-20 rounded-full border-2 border-white"
            />
            <h2 className="mt-3 font-semibold">User Name</h2>
          </div>

          <div className="space-y-2">

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]">
              Dashboard
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]">
              Profile
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]">
              Inbox
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]">
              Notifications
            </button>

            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]">
              Settings
            </button>

          </div>
        </div>

        <div>
          <button className="w-full text-left px-4 py-3 text-red-300 hover:bg-[#2b3448] rounded-xl">
            Log out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-6">

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

          {/* ROOM */}
          <div className="flex gap-4 p-4 border-b">
            <img src={room.image} className="w-40 h-28 rounded-lg object-cover" />

            <div>
              <h2 className="text-xl font-bold">{room.name}</h2>
              <p className="text-gray-500">{room.location}</p>

              <p className="text-sm text-gray-600 mt-1">
                ₱{perNight.toLocaleString()} per night
              </p>
            </div>
          </div>

          {/* DATES */}
          <div className="p-4 grid grid-cols-2 gap-4 border-b">
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="border p-2 rounded" />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="border p-2 rounded" />
          </div>

          {/* GUESTS */}
          <div className="p-4 border-b">
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="border p-2 w-full rounded"
            />

            {guests > room.maxGuests && (
              <p className="text-red-500 text-sm mt-1">
                Additional Guest Fee: ₱{extraGuestCost.toLocaleString()}
              </p>
            )}
          </div>

          {/* BREAKDOWN */}
          <div className="p-4 border-b space-y-1">

            <p className="font-semibold text-lg">Price Breakdown</p>

            <p className="text-sm text-gray-600">
              ₱{perNight.toLocaleString()} × {nights} night(s)
            </p>

            <p className="text-sm text-gray-600">
              Room Total: ₱{baseTotal.toLocaleString()}
            </p>

            {extraGuestCost > 0 && (
              <p className="text-sm text-red-500">
                Extra Guest Fee: ₱{extraGuestCost.toLocaleString()}
              </p>
            )}

            <hr />

            <p className="text-xl font-bold">
              Total: ₱{totalAmount.toLocaleString()}
            </p>
          </div>

          {/* WALLET (OPTIONAL DISCOUNT ONLY) */}
          <div className="p-4 border-b">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={useWallet}
                onChange={() => setUseWallet(!useWallet)}
              />
              Use Wallet (₱{walletBalance})
            </label>

            {useWallet && (
              <p className="text-sm mt-2">
                Wallet Discount: -₱{walletDiscount.toLocaleString()}
              </p>
            )}

            <p className="text-sm font-semibold mt-1">
              Remaining to Pay: ₱{remainingToPay.toLocaleString()}
            </p>
          </div>

          {/* PAYMENT */}
          <div className="p-4 border-b">
            <div className="flex gap-2 flex-wrap">
              {["gcash", "maya", "paypal", "card"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m as PaymentMethod)}
                  className={`border px-3 py-2 rounded ${
                    paymentMethod === m ? "bg-black text-white" : ""
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            {paymentMethod && (
              <input
                className="border p-2 w-full mt-3 rounded"
                placeholder={paymentMethod === "card" ? "Card Number" : "09XXXXXXXXX"}
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
              />
            )}
          </div>

          {/* PAY */}
          <div className="p-4">
            <button
              onClick={handlePay}
              className="w-full bg-green-600 text-white p-3 rounded"
            >
              Pay Now
            </button>
          </div>

        </div>
      </div>

      {/* SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h2 className="text-green-600 font-bold text-xl">
              Payment Successful 🎉
            </h2>

            <p>{room.name}</p>
            <p>Total Paid: ₱{remainingToPay.toLocaleString()}</p>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
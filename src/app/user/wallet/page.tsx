"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/userLogout";

type View = "menu" | "balance" | "payment" | "transactions";

type Transaction = {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  paymentMethod?: string;
};

export default function WalletPage() {
  const router = useRouter();

  const [view, setView] = useState<View>("menu");

  const [balance, setBalance] = useState(1234);
  const [cashback, setCashback] = useState(250);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      title: "Radisson Blu Cebu",
      date: "2026-05-01",
      amount: -5000,
      type: "debit",
      paymentMethod: "Wallet",
    },
    {
      id: 2,
      title: "Shangri-La Cebu",
      date: "2026-04-20",
      amount: -8000,
      type: "debit",
      paymentMethod: "GCash",
    },
    {
      id: 3,
      title: "Cashback Reward",
      date: "2026-05-02",
      amount: 250,
      type: "credit",
      paymentMethod: "System",
    },
  ]);

  const totalWallet = balance + cashback;

  const getToday = () => new Date().toISOString().split("T")[0];

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ id: prev.length + 1, ...tx }, ...prev]);
  };

  /* ================= SAFE WALLET DISCOUNT ================= */
  const applyWalletDiscount = (amount: number) => {
    return Math.min(totalWallet, amount);
  };

  const goBack = () => {
    if (view === "menu") {
      router.push("/user/dashboard");
    } else {
      setView("menu");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex text-gray-900">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#1d2433] text-white p-6 hidden lg:flex flex-col justify-between">

        <div>
          <div className="flex flex-col items-center mb-10">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-white object-cover"
            />

            <h2 className="mt-3 text-lg font-semibold">User Name</h2>
          </div>

          <div className="space-y-2">

            <button
              onClick={() => router.push("/user/profile")}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]"
            >
              Profile
            </button>

            <button
              onClick={() => router.push("/user/dashboard")}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/user/inbox")}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]"
            >
              Inbox
            </button>

            <button
              onClick={() => setView("menu")}
              className="w-full text-left px-4 py-3 rounded-xl bg-[#2b3448]"
            >
              My Wallet
            </button>

            <button
              onClick={() => router.push("/user/notifications")}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]"
            >
              Notifications
            </button>

            <button
              onClick={() => router.push("/user/settings")}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]"
            >
              Settings
            </button>

          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#2b3448]">
            Help & Support
          </button>

          <button
            onClick={() => logoutUser(router)}
            className="w-full text-left px-4 py-3 rounded-xl text-red-300 hover:bg-[#2b3448]"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white px-10 py-6 border-b flex items-center gap-4">
          <button onClick={goBack} className="text-2xl font-bold">
            ←
          </button>

          <h1 className="text-3xl font-semibold">
            My Wallet
          </h1>
        </header>

        <main className="flex-1 p-10">

          {/* MENU */}
          {view === "menu" && (
            <div className="space-y-4 max-w-xl">

              <button
                onClick={() => setView("balance")}
                className="w-full p-5 bg-white rounded-2xl shadow-sm text-left"
              >
                Wallet Balance
              </button>

              <button
                onClick={() => setView("payment")}
                className="w-full p-5 bg-white rounded-2xl shadow-sm text-left"
              >
                Payment 
              </button>

              <button
                onClick={() => setView("transactions")}
                className="w-full p-5 bg-white rounded-2xl shadow-sm text-left"
              >
                Transaction History
              </button>

            </div>
          )}

          {/* BALANCE */}
          {view === "balance" && (
            <div className="p-8 bg-blue-200 rounded-2xl max-w-xl">

              <h2 className="text-2xl font-bold mb-4">
                Wallet Balance
              </h2>

              <p className="text-4xl font-bold">
                ₱{totalWallet.toLocaleString()}
              </p>

              <p className="mt-4">
                Balance: ₱{balance.toLocaleString()}
              </p>

              <p>
                Cashback: ₱{cashback.toLocaleString()}
              </p>

            </div>
          )}

          {/* PAYMENT */}
          {view === "payment" && (
            <PaymentMini
              totalWallet={totalWallet}
              balance={balance}
              cashback={cashback}
              setBalance={setBalance}
              setCashback={setCashback}
              applyWalletDiscount={applyWalletDiscount}
              addTransaction={addTransaction}
              getToday={getToday}
            />
          )}

          {/* TRANSACTIONS */}
          {view === "transactions" && (
            <div className="bg-white p-6 rounded-2xl">

              <h2 className="text-xl font-bold mb-4">
                Transactions
              </h2>

              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between border-b py-3"
                >
                  <div>
                    <p className="font-medium">{tx.title}</p>

                    <p className="text-sm text-gray-500">
                      {tx.date}
                    </p>

                    <p className="text-xs">
                      {tx.paymentMethod}
                    </p>
                  </div>

                  <p
                    className={
                      tx.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {tx.amount < 0 ? "-" : "+"}₱
                    {Math.abs(tx.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="bg-[#1d2433] text-white px-10 py-5 text-sm">
          © 2026 Inn Sync. All rights reserved.
        </footer>

      </div>
    </div>
  );
}

/* ================= PAYMENT MINI ================= */

function PaymentMini({
  totalWallet,
  balance,
  cashback,
  setBalance,
  setCashback,
  applyWalletDiscount,
  addTransaction,
  getToday,
}: any) {

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

  const [method, setMethod] = useState("");
  const [account, setAccount] = useState("");

  const [success, setSuccess] = useState(false);

  const nights = useMemo(() => {
    const diff =
      (new Date(checkOut).getTime() -
        new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const base = room.pricePerNight * nights;

  const extra =
    guests > room.maxGuests
      ? (guests - room.maxGuests) * 500
      : 0;

  const total = base + extra;

  const walletDiscount = useWallet
    ? applyWalletDiscount(total)
    : 0;

  const remaining = total - walletDiscount;

  const handlePay = () => {

    if (!method) {
      return alert("Select payment method");
    }

    if (method !== "card" && account.length !== 11) {
      return alert("Invalid number");
    }

    let discount = 0;

    if (useWallet) {

      discount = Math.min(totalWallet, total);

      let remainingWallet = discount;

      let newBalance = balance;
      let newCashback = cashback;

      if (newBalance >= remainingWallet) {

        newBalance -= remainingWallet;

      } else {

        remainingWallet -= newBalance;
        newBalance = 0;
        newCashback -= remainingWallet;

      }

      setBalance(newBalance);
      setCashback(newCashback);
    }

    const finalAmount = total - discount;

    addTransaction({
      title: room.name,
      date: getToday(),
      amount: -finalAmount,
      type: "debit",
      paymentMethod: method,
    });

    setSuccess(true);
  };

  return (
    <div className="bg-white p-6 rounded-2xl space-y-4 max-w-2xl">

      <div className="flex gap-4">

        <img
          src={room.image}
          className="w-40 h-28 rounded-xl object-cover"
        />

        <div>
          <h2 className="font-bold">
            {room.name}
          </h2>

          <p className="text-gray-500">
            {room.location}
          </p>

          <p>
            ₱{room.pricePerNight} per night
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">

        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border p-2 rounded"
        />

      </div>

      <input
        type="number"
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        className="border p-2 w-full rounded"
      />

      <label className="flex gap-2 items-center">

        <input
          type="checkbox"
          checked={useWallet}
          onChange={() => setUseWallet(!useWallet)}
        />

        Use Wallet (₱{totalWallet.toLocaleString()})

      </label>

      {useWallet && (
        <p className="text-sm text-gray-500">
          Wallet Discount: ₱
          {walletDiscount.toLocaleString()}
        </p>
      )}

      <p className="font-bold">
        Remaining: ₱{remaining.toLocaleString()}
      </p>

      <div className="flex gap-2 flex-wrap">

        {["gcash", "maya", "paypal", "card"].map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`border px-3 py-2 rounded ${
              method === m
                ? "bg-black text-white"
                : ""
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}

      </div>

      {method && (
        <input
          placeholder={
            method === "card"
              ? "Card Number"
              : "09XXXXXXXXX"
          }
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="border p-2 w-full rounded"
        />
      )}

      <button
        onClick={handlePay}
        className="w-full bg-green-600 text-white p-3 rounded"
      >
        Pay Now
      </button>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl text-center w-[350px]">

            <h2 className="text-green-600 font-bold text-2xl">
              Payment Successful 🎉
            </h2>

            <p className="mt-3">
              {room.name}
            </p>

            <p className="mt-1">
              Total Paid: ₱{remaining.toLocaleString()}
            </p>

            <button
              onClick={() => setSuccess(false)}
              className="mt-5 bg-black text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
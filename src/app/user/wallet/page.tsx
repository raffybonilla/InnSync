"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type View = "menu" | "balance" | "payment" | "transactions";

type Transaction = {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
};

export default function WalletPage() {
  const router = useRouter();

  const [view, setView] = useState<View>("menu");

  const [balance] = useState(1234);
  const [cashback] = useState(250);

  const transactions: Transaction[] = [
    {
      id: 1,
      title: "Radisson Blu Cebu",
      date: "2026-05-01",
      amount: -5000,
      type: "debit",
    },
    {
      id: 2,
      title: "Shangri-La Cebu",
      date: "2026-04-20",
      amount: -8000,
      type: "debit",
    },
    {
      id: 3,
      title: "Cashback Reward",
      date: "2026-05-02",
      amount: 250,
      type: "credit",
    },
  ];

  const goBack = () => {
    if (view === "menu") {
      router.push("/user/dashboard");
    } else {
      setView("menu");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goBack}
          className="px-3 py-2 bg-gray-200 rounded-lg"
        >
          ←
        </button>

        <h1 className="text-xl font-bold">My Wallet</h1>
      </div>

      {/* ================= MENU VIEW ================= */}
      {view === "menu" && (
        <div className="space-y-3">

          <button
            onClick={() => setView("balance")}
            className="w-full p-4 bg-white rounded-xl shadow text-left"
          >
            💰 Wallet Balance →
          </button>

          <button
            onClick={() => setView("payment")}
            className="w-full p-4 bg-white rounded-xl shadow text-left"
          >
            💳 Payment Options →
          </button>

          <button
            onClick={() => setView("transactions")}
            className="w-full p-4 bg-white rounded-xl shadow text-left"
          >
            📜 Transaction History →
          </button>

        </div>
      )}

      {/* ================= BALANCE VIEW ================= */}
      {view === "balance" && (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">💰 Wallet Balance</h2>

          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-2xl font-bold">₱{balance}</p>

          <p className="text-sm text-gray-500 mt-3">Cashback</p>
          <p className="text-2xl font-bold text-green-600">
            ₱{cashback}
          </p>
        </div>
      )}

      {/* ================= PAYMENT VIEW ================= */}
      {view === "payment" && (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">💳 Payment Options</h2>

          <div className="space-y-2">
            <button className="w-full p-3 bg-blue-500 text-white rounded-lg">
              Pay with GCash
            </button>

            <button className="w-full p-3 bg-gray-800 text-white rounded-lg">
              Pay with Card
            </button>

            <button className="w-full p-3 bg-green-600 text-white rounded-lg">
              Pay with Wallet Balance
            </button>
          </div>
        </div>
      )}

      {/* ================= TRANSACTIONS VIEW ================= */}
      {view === "transactions" && (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">
            📜 Transaction History
          </h2>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {tx.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.date}
                  </p>
                </div>

                <p
                  className={
                    tx.type === "credit"
                      ? "text-green-600 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {tx.type === "credit" ? "+" : "-"}₱
                  {Math.abs(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
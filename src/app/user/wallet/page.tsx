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

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      {
        id: prev.length + 1,
        ...tx,
      },
      ...prev,
    ]);
  };

  const deductWallet = (amount: number, method: string = "Wallet") => {
    let total = balance + cashback;

    if (amount > total) {
      alert("Insufficient wallet balance");
      return false;
    }

    let remaining = total - amount;

    let newCashback = Math.min(cashback, remaining);
    let newBalance = remaining - newCashback;

    setBalance(newBalance);
    setCashback(newCashback);

    addTransaction({
      title: "Hotel Booking Payment",
      date: getToday(),
      amount: -amount,
      type: "debit",
      paymentMethod: method,
    });

    alert("Booking successful! Wallet deducted.");
    return true;
  };

  const payWithMethod = (method: string) => {
    addTransaction({
      title: `Payment via ${method}`,
      date: getToday(),
      amount: 0,
      type: "debit",
      paymentMethod: method,
    });

    alert(`Paid using ${method}`);
  };

  const goBack = () => {
    if (view === "menu") {
      router.push("/user/dashboard");
    } else {
      setView("menu");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">

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

      {/* MENU */}
      {view === "menu" && (
        <div className="space-y-3">

          <button
            className="w-full p-4 bg-white rounded-xl shadow text-left"
            onClick={() => setView("balance")}
          >
            💰 Wallet Balance →
          </button>

          <button
            className="w-full p-4 bg-white rounded-xl shadow text-left"
            onClick={() => setView("payment")}
          >
            💳 Payment Options →
          </button>

          <button
            className="w-full p-4 bg-white rounded-xl shadow text-left"
            onClick={() => setView("transactions")}
          >
            📜 Transaction History →
          </button>

        </div>
      )}

      {/* BALANCE */}
      {view === "balance" && (
        <div className="p-5 rounded-xl shadow" style={{ backgroundColor: "#a7b9e9" }}>

          <h2 className="font-semibold mb-4 text-black">💰 Wallet Balance</h2>

          <p className="text-sm text-black">Total Wallet Balance</p>
          <p className="text-3xl font-bold text-black">₱{totalWallet}</p>

          <div className="mt-4 border-t pt-3 text-black">
            <div className="flex justify-between">
              <span>Available Balance</span>
              <span>₱{balance}</span>
            </div>

            <div className="flex justify-between mt-1">
              <span>Cashback</span>
              <span>₱{cashback}</span>
            </div>
          </div>

          <button
            onClick={() => deductWallet(totalWallet, "Wallet")}
            className="mt-6 w-full bg-blue-700 text-white py-2 rounded"
          >
            Test Book (Use Wallet Balance)
          </button>

        </div>
      )}

      {/* PAYMENT */}
      {view === "payment" && (
        <div className="p-5 rounded-xl shadow text-white" style={{ backgroundColor: "#3e4b5e" }}>

          <h2 className="font-semibold mb-4">💳 Payment Options</h2>

          <button
            onClick={() => payWithMethod("GCash")}
            className="w-full p-3 bg-blue-500 rounded-lg"
          >
            Pay with GCash
          </button>

          <button
            onClick={() => payWithMethod("Card")}
            className="w-full p-3 bg-gray-800 rounded-lg mt-2"
          >
            Pay with Card
          </button>

          <button
            onClick={() => payWithMethod("PayPal")}
            className="w-full p-3 bg-yellow-500 rounded-lg mt-2"
          >
            Pay with PayPal
          </button>

          <button
            onClick={() => payWithMethod("Wallet")}
            className="w-full p-3 bg-blue-700 rounded-lg mt-2"
          >
            Pay with Wallet
          </button>

        </div>
      )}

      {/* TRANSACTIONS */}
      {view === "transactions" && (
        <div className="p-5 rounded-xl shadow text-black" style={{ backgroundColor: "#90a1b9" }}>

          <h2 className="font-semibold mb-4">📜 Transaction History</h2>

          {transactions.map((tx) => (
            <div key={tx.id} className="flex justify-between border-b py-2">

              <div>
                <p className="text-sm font-medium">{tx.title}</p>
                <p className="text-xs">{tx.date}</p>
                {tx.paymentMethod && (
                  <p className="text-xs italic">
                    Method: {tx.paymentMethod}
                  </p>
                )}
              </div>

              <p className={tx.type === "credit" ? "text-green-700" : "text-red-600"}>
                {tx.type === "credit" ? "+" : "-"}₱{Math.abs(tx.amount)}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
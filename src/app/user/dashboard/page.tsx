"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">

      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}
      <div className="w-64 bg-[#3a4659] text-white p-5">

        <h1 className="text-3xl font-bold mb-8">
          Inn Sync
        </h1>

        <div className="flex flex-col gap-3">

          <button
            onClick={() => router.push("/user/profile")}
            className="text-left hover:bg-white/10 p-3 rounded transition"
          >
            👤 Profile
          </button>

          <button
            onClick={() => router.push("/user/dashboard")}
            className="text-left hover:bg-white/10 p-3 rounded transition"
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => router.push("/user/inbox")}
            className="text-left hover:bg-white/10 p-3 rounded transition"
          >
            📩 Inbox
          </button>

          <button
            onClick={() => router.push("/user/wallet")}
            className="text-left hover:bg-white/10 p-3 rounded transition"
          >
            💰 My Wallet
          </button>

          <button
            onClick={() => router.push("/user/notifications")}
            className="text-left hover:bg-white/10 p-3 rounded transition"
          >
            🔔 Notifications
          </button>

          <button
            onClick={handleLogout}
            className="text-left hover:bg-red-500/30 p-3 rounded transition text-red-200"
          >
            Logout
          </button>

        </div>
      </div>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}
      <div className="flex-1 p-8">

        {/* HERO */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">

          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            className="w-full h-[320px] object-cover"
            alt="Hotel"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-10">

            <h1 className="text-4xl font-bold text-white">
              Find your perfect stay in Cebu
            </h1>

            <p className="text-white mt-3 text-lg">
              Search hotels, compare prices, and book instantly
            </p>

          </div>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* ===================================================== */}
          {/* FIXED HERE */}
          {/* ===================================================== */}
          <div
            onClick={() => router.push("/hotels")}
            className="cursor-pointer border rounded-2xl p-6 shadow-lg bg-white hover:scale-[1.02] transition"
          >
            <h2 className="text-2xl font-bold">
              ⭐ Hotels & Airbnb
            </h2>

            <p className="text-gray-600 mt-3">
              View available Cebu hotels with room previews
              and booking options
            </p>
          </div>

          <div
            onClick={() => router.push("/about")}
            className="cursor-pointer border rounded-2xl p-6 shadow-lg bg-white hover:scale-[1.02] transition"
          >
            <h2 className="text-2xl font-bold">
              ℹ️ About Us
            </h2>

            <p className="text-gray-600 mt-3">
              Inn Sync is a modern hotel booking platform
              designed for Cebu travelers.
            </p>
          </div>

        </div>

        {/* INFO */}
        <div className="mt-8 bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-bold mb-3">
            Welcome to Inn Sync
          </h2>

          <p className="text-gray-700 leading-7">
            Browse luxury hotels and Airbnb stays around Cebu.
            Select hotel rooms, review room inclusions, proceed
            to booking, and complete your payment through our
            realistic hotel reservation flow.
          </p>

        </div>

      </div>
    </div>
  );
}
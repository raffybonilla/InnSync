"use client";

import Link from "next/link";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-gray-800">
          Inn Sync
        </h1>

        {/* ONLY BUTTON TO PROFILE */}
        <Link
          href="/user/profile"
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 text-sm font-medium"
        >
          My Profile
        </Link>

      </div>

      {/* HERO SECTION */}
      <div className="bg-blue-600 text-white p-10">
        <h2 className="text-3xl font-bold">
          Find your perfect stay in Cebu
        </h2>

        <p className="mt-2 opacity-90">
          Search hotels, compare prices, and book instantly
        </p>

        <div className="mt-5 flex gap-2">
          <input
            placeholder="Search hotels..."
            className="w-full p-3 rounded text-black"
          />
          <button className="bg-black px-6 rounded">
            Search
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="p-6 grid md:grid-cols-2 gap-4">

        <Link
          href="/hotels"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold">🏨 Book Hotels</h3>
          <p className="text-gray-600 mt-1">
            Browse hotels in Cebu and view details
          </p>
        </Link>

        <Link
          href="/user/settings"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold">⚙ Settings</h3>
          <p className="text-gray-600 mt-1">
            Manage account preferences
          </p>
        </Link>

      </div>

    </div>
  );
}
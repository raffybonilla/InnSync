"use client";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white p-6 rounded shadow">

        <h1 className="text-2xl font-bold">
          Account Settings
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your profile and preferences
        </p>

        <div className="mt-6 space-y-3">

          <input
            className="w-full border p-2 rounded"
            placeholder="Full Name"
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Password"
            type="password"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthday: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-2xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/user/dashboard")}
          className="mb-4 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white p-6 rounded shadow">

          <h1 className="text-2xl font-bold mb-4">
            My Profile
          </h1>

          {/* PHOTO */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl">
              U
            </div>

            <button className="text-blue-600 text-sm">
              Change Photo
            </button>
          </div>

          <div className="space-y-3">

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
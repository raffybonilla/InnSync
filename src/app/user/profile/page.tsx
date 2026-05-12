"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UserProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);

  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthday: "",
    password: "",
  });

  // ================= LOAD USER PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setForm({
          fullName: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          birthday: data.birthday || "",
          password: "",
        });

        setProfilePic(data.avatar_url || null);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= IMAGE UPLOAD =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) return;

    const userId = userData.user.id;

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      birthday: form.birthday,
      avatar_url: profilePic,
      updated_at: new Date(),
    });

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">

      <div className="max-w-2xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => router.push("/user/dashboard")}
          className="mb-4 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white p-6 rounded shadow">

          <h1 className="text-2xl font-bold mb-6">
            My Profile
          </h1>

          {/* PROFILE PIC */}
          <div className="flex flex-col items-center mb-6">

            <div className="w-24 h-24 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center text-white text-2xl">
              {profilePic ? (
                <img
                  src={profilePic}
                  className="w-full h-full object-cover"
                />
              ) : (
                "U"
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-blue-600 text-sm hover:underline"
            >
              Change Profile Picture
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

          </div>

          {/* FORM */}
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

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
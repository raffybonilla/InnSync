"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UserProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  // EDIT STATES
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [confirmSave, setConfirmSave] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    birthday: "",
    password: "",
  });

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const userId = userData.user.id;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setForm({
          fullName: data.full_name || "",
          username: data.username || "",
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

  // ================= OPEN EDIT =================
  const openEdit = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setConfirmValue("");
  };

  // ================= SAVE =================
  const saveChanges = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user || !editField) return;

    const userId = userData.user.id;

    // 🔐 PASSWORD (Auth table)
    if (editField === "password") {
      const { error } = await supabase.auth.updateUser({
        password: editValue,
      });

      if (error) {
        alert(error.message);
        return;
      }

      setShowSuccess(true);
      setConfirmSave(false);
      setEditField(null);
      return;
    }

    // ❌ EMAIL IS LOCKED (safety)
    if (editField === "email") {
      alert("Email is locked and cannot be edited here.");
      return;
    }

    // 🧾 NORMAL PROFILE UPDATE
    const { error } = await supabase
      .from("profiles")
      .update({
        [editField]: editValue,
        updated_at: new Date(),
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [editField]: editValue,
    }));

    setShowSuccess(true);
    setConfirmSave(false);
    setEditField(null);
  };

  // ================= IMAGE =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(file);
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

      {/* SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded text-center w-80">
            <h2 className="text-xl font-bold text-green-600">
              Profile Updated!
            </h2>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => router.push("/user/dashboard")}
          className="mb-4 text-sm bg-gray-200 px-3 py-1 rounded"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white p-6 rounded shadow">

          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          {/* PROFILE PIC */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center text-white text-2xl">
              {profilePic ? (
                <img src={profilePic} className="w-full h-full object-cover" />
              ) : (
                "U"
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-blue-600 text-sm"
            >
              Change Profile Picture
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* ================= FIELDS ================= */}

          <div className="space-y-3">

            {/* FULL NAME */}
            <div className="flex justify-between border p-3 rounded">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{form.fullName}</p>
              </div>
              <span onClick={() => openEdit("full_name", form.fullName)} className="text-blue-600 text-sm cursor-pointer">
                Edit
              </span>
            </div>

            {/* USERNAME */}
            <div className="flex justify-between border p-3 rounded">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{form.username}</p>
              </div>
              <span onClick={() => openEdit("username", form.username)} className="text-blue-600 text-sm cursor-pointer">
                Edit
              </span>
            </div>

            {/* EMAIL (LOCKED) */}
            <div className="flex justify-between border p-3 rounded">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{form.email}</p>
              </div>
              <span className="text-gray-400 text-sm">
                Locked
              </span>
            </div>

            {/* PHONE */}
            <div className="flex justify-between border p-3 rounded">
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-medium">{form.phone}</p>
              </div>
              <span onClick={() => openEdit("phone", form.phone)} className="text-blue-600 text-sm cursor-pointer">
                Edit
              </span>
            </div>

            {/* GENDER */}
            <div className="flex justify-between border p-3 rounded">
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{form.gender}</p>
              </div>
              <span onClick={() => openEdit("gender", form.gender)} className="text-blue-600 text-sm cursor-pointer">
                Edit
              </span>
            </div>

            {/* BIRTHDAY */}
            <div className="flex justify-between border p-3 rounded">
              <div>
                <p className="text-sm text-gray-500">Birthday</p>
                <p className="font-medium">{form.birthday}</p>
              </div>
              <span onClick={() => openEdit("birthday", form.birthday)} className="text-blue-600 text-sm cursor-pointer">
                Edit
              </span>
            </div>

            {/* PASSWORD */}
            <div className="flex justify-between border p-3 rounded">
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="font-medium">••••••••</p>
              </div>
              <span onClick={() => openEdit("password", "")} className="text-blue-600 text-sm cursor-pointer">
                Edit
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-80">

            <h2 className="font-bold mb-3">
              Edit {editField}
            </h2>

            <input
              type={editField === "password" ? "password" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full border p-2 rounded mb-3"
              placeholder="New value"
            />

            {(editField === "username" || editField === "password") && (
              <input
                type={editField === "password" ? "password" : "text"}
                value={confirmValue}
                onChange={(e) => setConfirmValue(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder={`Confirm ${editField}`}
              />
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditField(null)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  if (
                    (editField === "username" || editField === "password") &&
                    editValue !== confirmValue
                  ) {
                    alert("Values do not match!");
                    return;
                  }
                  setConfirmSave(true);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= CONFIRM MODAL ================= */}
      {confirmSave && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded text-center w-80">

            <h2 className="font-bold">
              Are you sure you want to save changes?
            </h2>

            <div className="flex justify-center gap-3 mt-5">

              <button onClick={() => setConfirmSave(false)}>
                No
              </button>

              <button
                onClick={saveChanges}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Yes
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
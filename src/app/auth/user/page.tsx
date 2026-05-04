"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabaseClient";

export default function UserLogin() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseClient();

      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError("Email and password are required.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              username: data.user.user_metadata?.username || "",
              fullName: data.user.user_metadata?.full_name || "",
            })
          );

          router.push("/user/dashboard");
        }
      } else {
        if (
          !formData.fullName ||
          !formData.username ||
          !formData.email ||
          !formData.password
        ) {
          setError("All fields are required.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              username: formData.username,
              role: "user",
            },
          },
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          alert(
            "Registration successful. Please check your email to confirm."
          );

          setFormData({
            username: "",
            email: "",
            password: "",
            fullName: "",
          });

          setIsLogin(true);
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

          <div className="mb-8">
            <h1 className="text-4xl font-serif text-gray-800 mb-2">
              Inn Sync
            </h1>
            <p className="text-sm text-gray-600">
              Smart Hotel-Booth Automation
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {isLogin ? "Welcome Back!" : "Join Us Today"}
          </h2>

          <p className="text-gray-600 mb-6">
            {isLogin
              ? "Experience seamless hotel booking, faster check-ins, and personalized services."
              : "Sign up to experience seamless hotel booking and services."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />

                <input
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </>
            )}

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading
                ? "Loading..."
                : isLogin
                ? "Sign In"
                : "Register"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-blue-600"
          >
            {isLogin ? "Create account" : "Back to login"}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 items-center justify-center text-white text-center p-8">
          <div>
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-bold">
              Welcome to Inn Sync
            </h3>
            <p>Your gateway to hotel booking</p>
          </div>
        </div>

      </div>
    </div>
  );
}
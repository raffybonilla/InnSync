"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/* ===================== LOGOUT MODAL ===================== */
function LogoutModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-bold mb-4">
          Are you sure you want to log out?
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== TERMS MODAL ===================== */
function TermsModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-3">Terms and Conditions</h1>

        <div className="text-sm text-gray-700 space-y-2 max-h-60 overflow-y-auto border p-3 rounded">
          <p>By using Inn Sync, you agree to hotel booking rules.</p>

          <ul className="list-disc pl-5">
            <li>Bookings depend on availability</li>
            <li>Payments required before confirmation</li>
            <li>Cancellations follow policy</li>
          </ul>
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          I agree
        </label>

        <button
          disabled={!checked}
          onClick={onAccept}
          className={`mt-4 w-full py-2 rounded text-white transition ${
            checked
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}

/* ===================== MAIN ===================== */
export default function DashboardPage() {
  const router = useRouter();

  const [showTerms, setShowTerms] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [userName, setUserName] = useState("");

  const [currentBookings, setCurrentBookings] = useState<any[]>([]);
  const [historyBookings, setHistoryBookings] = useState<any[]>([]);

  const [index, setIndex] = useState(0);

  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);

  /* ===================== USER ===================== */
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        setUserName("User");
      }
    };

    fetchUser();
  }, []);

  /* ===================== BOOKINGS ===================== */
  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase.from("bookings").select("*");

      if (data) {
        setCurrentBookings(
          data.filter((b: any) => b.status === "current")
        );

        setHistoryBookings(
          data.filter((b: any) => b.status === "completed")
        );
      }
    };

    fetchBookings();
  }, []);

  const booking = currentBookings[index];

  return (
    <>
      {/* ===================== LOGOUT MODAL ===================== */}
      {showLogout && (
        <LogoutModal
          onCancel={() => setShowLogout(false)}
          onConfirm={() => router.push("/login")}
        />
      )}

      {/* ===================== TERMS MODAL ===================== */}
      {showTerms && (
        <TermsModal onAccept={() => setShowTerms(false)} />
      )}

      <div className="flex min-h-screen bg-gray-100 text-black">
        {/* ================= SIDEBAR ================= */}
        <div className="w-52 bg-[#3a4659] text-white p-4 flex flex-col min-h-screen shadow-lg">
          {/* USER AREA */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-white rounded-full mx-auto" />

            <p className="mt-3 font-semibold text-lg">
              {userName || "User"}
            </p>

            {/* PROFILE */}
            <button
              onClick={() => router.push("/user/profile")}
              className="text-xs text-blue-200 hover:underline mt-1"
            >
              Edit Profile
            </button>
          </div>

          {/* NAVIGATION */}
          <div className="space-y-2">
            <button
              onClick={() => router.push("/user/dashboard")}
              className="w-full p-3 text-left rounded bg-white/20 font-bold hover:bg-white/30 transition"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/user/inbox")}
              className="w-full p-3 text-left rounded hover:bg-white/10 transition"
            >
              Inbox
            </button>

            <button
              onClick={() => router.push("/user/wallet")}
              className="w-full p-3 text-left rounded hover:bg-white/10 transition"
            >
              Wallet
            </button>

            <button
              onClick={() => router.push("/user/notifications")}
              className="w-full p-3 text-left rounded hover:bg-white/10 transition"
            >
              Notifications
            </button>

            <button
              onClick={() => router.push("/user/settings")}
              className="w-full p-3 text-left rounded hover:bg-white/10 transition"
            >
              Settings
            </button>

            <button
              onClick={() => router.push("/user/support")}
              className="w-full p-3 text-left rounded hover:bg-white/10 transition"
            >
              Help & Support
            </button>
          </div>

          {/* LOGOUT */}
          <div className="mt-auto pt-6">
            <button
              onClick={() => setShowLogout(true)}
              className="w-full p-3 text-left rounded text-red-300 hover:bg-red-500/20 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 p-8 pb-24 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">
            👋 Welcome, {userName || "User"}
          </h1>

          {/* ================= CURRENT BOOKING ================= */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Current Booking</h2>

            <button
              onClick={() => router.push("/hotels")}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Browse Hotels
            </button>
          </div>

          {booking ? (
            <div className="bg-white p-6 rounded-2xl shadow mb-8 border">
              <h3 className="text-2xl font-bold">
                {booking.hotel_name}
              </h3>

              <p className="text-gray-700 mt-2">
                {booking.details}
              </p>

              <p className="text-sm text-gray-500 mt-3">
                ⭐ {booking.rating || 4.5}
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => router.push("/user/inbox")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Message Hotel
                </button>

                <button
                  onClick={() => setShowTerms(true)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  View Terms
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <p className="text-gray-500">
                No current booking
              </p>
            </div>
          )}

          {/* ================= BOOKING HISTORY ================= */}
          <h2 className="text-xl font-bold mb-3">
            Booking History
          </h2>

          <div className="bg-white p-5 rounded-2xl shadow space-y-4 border">
            {(historyBookings.length > 0
              ? historyBookings
              : [
                  {
                    hotel_name: "Radisson Blu Cebu",
                    details: "Deluxe Room",
                    sqm: 35,
                    guests: 2,
                    rating: 4.8,
                  },
                  {
                    hotel_name: "Shangri-La Mactan",
                    details: "Ocean View Room",
                    sqm: 45,
                    guests: 3,
                    rating: 4.9,
                  },
                ]
            ).map((b: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-bold text-lg">
                    {b.hotel_name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {b.details} • {b.sqm} sqm • {b.guests} guests
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ⭐ {b.rating}
                  </p>

                  <button
                    onClick={() => setSelectedHistory(b)}
                    className="text-blue-600 text-sm hover:underline mt-1"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="fixed bottom-0 left-52 right-0 bg-[#3a4659] text-white text-xs py-4 px-6 flex justify-between z-40">
        <button
          onClick={() => router.push("/terms")}
          className="hover:underline"
        >
          Terms & Conditions
        </button>

        <button
          onClick={() => router.push("/privacy")}
          className="hover:underline"
        >
          Privacy Policy
        </button>

        <button
          onClick={() => router.push("/cookies")}
          className="hover:underline"
        >
          Cookie Policy
        </button>
      </footer>
    </>
  );
}
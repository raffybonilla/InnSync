"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LegalView =
  | "menu"
  | "appearance"
  | "booking"
  | "legal"
  | "terms"
  | "privacy"
  | "cookies"
  | "ugc"
  | "help";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlView = searchParams.get("view") as LegalView | null;

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [religion, setReligion] = useState("");
  const [currency, setCurrency] = useState("PHP");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12");
  const [bedType, setBedType] = useState("Queen");

  const [view, setView] = useState<LegalView>(urlView || "menu");

  const [showTerms, setShowTerms] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ================= SYNC URL -> VIEW ================= */
  useEffect(() => {
    if (urlView) {
      setView(urlView);
    }
  }, [urlView]);

  /* ================= TERMS CHECK ================= */
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted");
    if (!accepted) setShowTerms(true);
  }, []);

  const acceptTerms = () => {
    localStorage.setItem("termsAccepted", "true");
    setAgreedTerms(true);
    setShowTerms(false);
  };

  const deleteAccount = () => {
    localStorage.clear();
    setShowDeleteConfirm(false);
    router.push("/");
  };

  /* ================= NAV HELPERS ================= */
  const goToView = (v: LegalView) => {
    setView(v);
    router.push(`/user/settings?view=${v}`);
  };

  const goBackSmart = () => {
    if (
      view === "help" ||
      view === "terms" ||
      view === "privacy" ||
      view === "cookies" ||
      view === "ugc"
    ) {
      goToView("legal");
      return;
    }

    if (view === "legal" || view === "appearance" || view === "booking") {
      goToView("menu");
      return;
    }

    router.push("/user/dashboard");
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-2xl mx-auto">

        {/* ================= MENU ================= */}
        {view === "menu" && (
          <div className="space-y-3">

            <button onClick={goBackSmart} className="text-blue-600 mb-2">
              ← Back
            </button>

            <h1 className="text-2xl font-bold mb-4">Settings</h1>

            <button
              onClick={() => setView("appearance")}
              className="w-full text-left p-4 border rounded hover:bg-gray-100"
            >
              Appearance
            </button>

            <button
              onClick={() => setView("booking")}
              className="w-full text-left p-4 border rounded hover:bg-gray-100"
            >
              Booking Defaults
            </button>

            <button
              onClick={() => goToView("legal")}
              className="w-full text-left p-4 border rounded hover:bg-gray-100"
            >
              Legal
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-left p-4 border rounded text-red-600 hover:bg-gray-100"
            >
              Delete Account
            </button>
          </div>
        )}

        {/* ================= APPEARANCE ================= */}
        {view === "appearance" && (
          <div className="space-y-4">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">Appearance</h2>

            <label className="flex justify-between">
              Dark Mode
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </label>

            <select
              className="w-full border p-2 rounded"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Filipino</option>
              <option>Bisaya</option>
            </select>

            <input
              className="w-full border p-2 rounded"
              placeholder="Religion (optional)"
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
            />

            <select
              className="w-full border p-2 rounded"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option>PHP</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
        )}

        {/* ================= BOOKING ================= */}
        {view === "booking" && (
          <div className="space-y-4">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">Booking Defaults</h2>

            <select
              className="w-full border p-2 rounded"
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
            >
              <option>Single</option>
              <option>Double</option>
              <option>Queen</option>
              <option>King</option>
            </select>
          </div>
        )}

        {/* ================= LEGAL MENU ================= */}
        {view === "legal" && (
          <div className="space-y-3">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">Legal</h2>

            <button
              onClick={() => goToView("terms")}
              className="w-full p-4 border rounded hover:bg-gray-100 text-left"
            >
              Terms & Conditions
            </button>

            <button
              onClick={() => goToView("privacy")}
              className="w-full p-4 border rounded hover:bg-gray-100 text-left"
            >
              Privacy Policy
            </button>

            <button
              onClick={() => goToView("cookies")}
              className="w-full p-4 border rounded hover:bg-gray-100 text-left"
            >
              Cookie Policy
            </button>

            <button
              onClick={() => goToView("ugc")}
              className="w-full p-4 border rounded hover:bg-gray-100 text-left"
            >
              UGC Policy
            </button>

            <button
              onClick={() => goToView("help")}
              className="w-full p-4 border rounded hover:bg-gray-100 text-left"
            >
              Help & Support
            </button>
          </div>
        )}

        {/* ================= TERMS ================= */}
        {view === "terms" && (
          <div className="space-y-3">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">Terms & Conditions</h2>
            <p className="text-sm text-gray-600">
              Users must follow booking rules, payment policies, and platform guidelines.
            </p>
          </div>
        )}

        {/* ================= PRIVACY ================= */}
        {view === "privacy" && (
          <div className="space-y-3">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">Privacy Policy</h2>
            <p className="text-sm text-gray-600">
              We collect minimal data to improve booking experience and protect user accounts.
            </p>
          </div>
        )}

        {/* ================= COOKIES ================= */}
        {view === "cookies" && (
          <div className="space-y-3">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">Cookie Policy</h2>
            <p className="text-sm text-gray-600">
              Cookies are used for session management, preferences, and analytics.
            </p>
          </div>
        )}

        {/* ================= UGC ================= */}
        {view === "ugc" && (
          <div className="space-y-3">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">User Generated Content (UGC)</h2>
            <p className="text-sm text-gray-600">
              Users are responsible for content they submit. Offensive content may be removed.
            </p>
          </div>
        )}

        {/* ================= HELP ================= */}
        {view === "help" && (
          <div className="space-y-3">

            <button onClick={goBackSmart} className="text-blue-600">
              ← Back
            </button>

            <h2 className="text-xl font-bold">Help & Support</h2>

            <p className="text-sm text-gray-600">
              Contact support for booking issues, payments, or account concerns.
            </p>

            <div className="mt-3 space-y-2 text-sm">
              <p>📩 Email: support@innsync.app</p>
              <p>📞 Hotline: +63 900 000 0000</p>
              <p>⏰ Available: 24/7</p>
            </div>
          </div>
        )}

      </div>

      {/* ================= TERMS MODAL ================= */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <h2 className="text-xl font-bold">Terms and Conditions</h2>

            <p className="text-sm text-gray-600 mt-3">
              By using this app, you agree to our policies.
            </p>

            <button
              onClick={acceptTerms}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM ================= */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600">
              Delete account permanently?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              This cannot be undone.
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border px-4 py-2 rounded"
              >
                No
              </button>

              <button
                onClick={deleteAccount}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded"
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
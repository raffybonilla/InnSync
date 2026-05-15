"use client";

import { useState } from "react";

export default function TermsModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold mb-3">
          Terms and Conditions
        </h1>

        <div className="text-sm text-gray-600 space-y-2 max-h-60 overflow-y-auto border p-3 rounded">
          <p>
            Welcome to Inn Sync. By using this application, you agree to:
          </p>

          <ul className="list-disc pl-5">
            <li>All bookings are subject to availability</li>
            <li>Cancellation policies may apply per hotel</li>
            <li>Payments must be completed before confirmation</li>
            <li>We are not responsible for external hotel issues</li>
          </ul>
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
            className="w-4 h-4"
          />
          I agree to the Terms and Conditions
        </label>

        <button
          disabled={!checked}
          onClick={onAccept}
          className={`mt-4 w-full py-2 rounded text-white ${
            checked ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Accept & Continue
        </button>

      </div>
    </div>
  );
}
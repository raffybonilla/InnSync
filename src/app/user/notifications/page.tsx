"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: number;
  hotel_name: string;
  status: "active" | "finished";
  created_at: string;

  check_in?: string;
  check_out?: string;
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] =
    useState<"active" | "finished">("active");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // ===================== FETCH BOOKINGS =====================
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const today = new Date();

    const updatedBookings =
      data?.map((booking) => {
        const checkoutDate = booking.check_out
          ? new Date(booking.check_out)
          : null;

        let status: "active" | "finished" = "active";

        if (checkoutDate && today > checkoutDate) {
          status = "finished";
        }

        return {
          ...booking,
          status,
        };
      }) || [];

    setBookings(updatedBookings);
  };

  // ===================== INIT LOAD =====================
  useEffect(() => {
    fetchBookings();
  }, []);

  // ===================== FILTER BOOKINGS =====================
  const filteredBookings = bookings.filter(
    (b) => b.status === activeTab
  );

  // ===================== SAMPLE ROOMS (FOR FINISHED ONLY) =====================
  const getRoomsByHotel = (hotelName: string) => {
    const rooms: Record<string, { name: string; desc: string }[]> = {
      "Radisson Blu Cebu": [
        {
          name: "Deluxe Room",
          desc: "₱6000 • 2 Pax • Breakfast • WiFi",
        },
        {
          name: "Executive Suite",
          desc: "₱9000 • 3 Pax • Lounge Access • Sea View",
        },
      ],
      "Quest Hotel Cebu": [
        {
          name: "Standard Room",
          desc: "₱3500 • 2 Pax • WiFi • City View",
        },
        {
          name: "Superior Room",
          desc: "₱4500 • 2 Pax • Breakfast • Pool Access",
        },
      ],
      "Shangri-La Mactan": [
        {
          name: "Ocean View Room",
          desc: "₱12000 • 2 Pax • Beach Access • Breakfast",
        },
        {
          name: "Garden Suite",
          desc: "₱15000 • 3 Pax • Premium View • Lounge",
        },
      ],
      "Marco Polo Plaza Cebu": [
        {
          name: "Deluxe Mountain View",
          desc: "₱5000 • 2 Pax • Mountain View • WiFi",
        },
        {
          name: "Suite Room",
          desc: "₱8000 • 3 Pax • Lounge Access • City View",
        },
      ],
      "Waterfront Cebu City Hotel & Casino": [
        {
          name: "Standard Room",
          desc: "₱4000 • 2 Pax • Casino Access • WiFi",
        },
        {
          name: "Executive Suite",
          desc: "₱7500 • 3 Pax • Premium Amenities",
        },
      ],
      "Bai Hotel Cebu": [
        {
          name: "Deluxe Room",
          desc: "₱5500 • 2 Pax • City View • Breakfast",
        },
        {
          name: "Corner Suite",
          desc: "₱9500 • 3 Pax • Lounge Access • Skyline View",
        },
      ],
    };

    return rooms[hotelName] || [];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">

        <Link
          href="/user/dashboard"
          className="text-2xl font-bold"
        >
          ←
        </Link>

        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setActiveTab("active")}
          className={`px-5 py-2 rounded-lg font-semibold transition ${
            activeTab === "active"
              ? "bg-green-600 text-white"
              : "bg-white border"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setActiveTab("finished")}
          className={`px-5 py-2 rounded-lg font-semibold transition ${
            activeTab === "finished"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Finished
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        {errorMsg && (
          <p className="text-red-600 mb-4">
            {errorMsg}
          </p>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center py-10">

            <p className="text-gray-500 mb-4">
              No {activeTab} bookings found.
            </p>

            <Link
              href="/hotels"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Browse Hotels
            </Link>

          </div>
        ) : (
          <div className="space-y-4">

            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="border border-gray-200 p-5 rounded-2xl bg-gray-50 shadow-sm"
              >

                <div className="space-y-2">

                  <h2 className="text-xl font-bold text-gray-900">
                    {b.hotel_name}
                  </h2>

                  <p className="text-sm text-gray-700">
                    📅 Check-in:{" "}
                    <span className="font-semibold">
                      {b.check_in || "N/A"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700">
                    🏁 Check-out:{" "}
                    <span className="font-semibold">
                      {b.check_out || "N/A"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700">
                    📌 Status:{" "}
                    <span
                      className={`font-bold ${
                        b.status === "active"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </p>

                  {/* FINISHED ROOMS ONLY */}
                  {b.status === "finished" && (
                    <div className="mt-4 border-t pt-3">
                      <p className="font-semibold mb-2">
                        Stayed Rooms:
                      </p>

                      <div className="space-y-2">
                        {getRoomsByHotel(b.hotel_name).length ===
                        0 ? (
                          <p className="text-sm text-gray-500">
                            No room data available
                          </p>
                        ) : (
                          getRoomsByHotel(b.hotel_name).map(
                            (room, index) => (
                              <div
                                key={index}
                                className="p-2 bg-white border rounded"
                              >
                                <p className="font-medium">
                                  {room.name}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {room.desc}
                                </p>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}
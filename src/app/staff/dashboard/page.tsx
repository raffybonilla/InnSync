"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserSession {
  id: string;
  email: string | null;
  role: string;
  fullName: string;
}

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  totalUsers: number;
  staffCount: number;
  totalRevenue: number;
  recentBookings: any[];
  roomStatuses: Record<string, number>;
}

interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  total_price: number;
  profiles: {
    full_name: string;
    email: string;
  };
  rooms: {
    room_number: string;
    room_type: string;
  };
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  status: string;
  description: string;
  amenities: string[];
}

export default function StaffDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "rooms"
  >("overview");

  // ✅ FIXED ROUTER INITIALIZATION ERROR
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userJson = localStorage.getItem("user");

        if (!userJson) {
          setTimeout(() => {
            router.push("/auth/staff");
          }, 0);
          return;
        }

        const storedUser = JSON.parse(userJson) as UserSession;

        if (!storedUser || storedUser.role !== "staff") {
          setTimeout(() => {
            router.push("/auth/staff");
          }, 0);
          return;
        }

        setUser(storedUser);

        await fetchDashboardData();
      } catch (error) {
        console.error("Session error:", error);

        setTimeout(() => {
          router.push("/auth/staff");
        }, 0);
      }
    };

    checkUser();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, bookingsResponse, roomsResponse] =
        await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/bookings"),
          fetch("/api/rooms"),
        ]);

      const statsData = await statsResponse.json();
      const bookingsData = await bookingsResponse.json();
      const roomsData = await roomsResponse.json();

      if (statsData.stats) {
        setStats(statsData.stats);
      }

      if (bookingsData.bookings) {
        setBookings(bookingsData.bookings);
      }

      if (roomsData.rooms) {
        setRooms(roomsData.rooms);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusUpdate = async (
    bookingId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleRoomStatusUpdate = async (
    roomId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch("/api/rooms", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: roomId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  // ✅ FIXED LOGOUT ROUTER ERROR
  const handleLogout = () => {
    localStorage.removeItem("user");

    setTimeout(() => {
      router.push("/auth/staff");
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const completedCount = bookings.filter((booking) => booking.status === 'checked_out').length;
  const inProgressCount = bookings.filter((booking) => booking.status === 'checked_in').length;
  const pausedCount = bookings.filter((booking) => booking.status === 'pending').length;
  const toInspectCount = bookings.filter((booking) => booking.status === 'confirmed').length;
  const taskStatusTotal = completedCount + inProgressCount + pausedCount + toInspectCount || 1;

  const taskStatus = [
    { label: 'Completed', count: completedCount, color: 'bg-slate-900' },
    { label: 'In Progress', count: inProgressCount, color: 'bg-blue-600' },
    { label: 'Paused', count: pausedCount, color: 'bg-violet-600' },
    { label: 'To Be Inspected', count: toInspectCount, color: 'bg-cyan-500' },
  ];

  const completeWorkPercent = stats?.totalBookings
    ? Math.round((stats.activeBookings / stats.totalBookings) * 100)
    : 0;

  const hoursPercent = stats?.totalRooms
    ? Math.min(100, Math.round(((stats.availableRooms || 0) / stats.totalRooms) * 100) + 20)
    : 60;

  const cleanPercent = stats?.totalRooms
    ? Math.round(((stats.roomStatuses?.available || stats.availableRooms || 0) / stats.totalRooms) * 100)
    : 0;

  return (
    <StaffLayout activePage="dashboard" user={user}>
      <div className="space-y-6">
        <div className="mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Staff Dashboard</p>
            <h1 className="text-3xl font-semibold mt-2">Welcome, {user?.fullName || user?.email}</h1>
            <p className="mt-2 text-slate-500 max-w-2xl">
              Your daily operations snapshot is ready. Keep track of tasks, room readiness, and staff activity in one place.
            </p>
          </div>
        </div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Staff Dashboard
            </p>

            <h1 className="text-3xl font-semibold">
              Welcome, {user?.fullName || user?.email}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "bookings", label: "Bookings" },
              { id: "rooms", label: "Rooms" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === "overview" && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Today's Tasks
                </p>

                <p className="mt-4 text-4xl font-bold">
                  {stats?.pendingBookings || 0}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Active Bookings
                </p>

                <p className="mt-4 text-4xl font-bold">
                  {stats?.activeBookings || 0}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Available Rooms
                </p>

                <p className="mt-4 text-4xl font-bold">
                  {stats?.availableRooms || 0}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Total Revenue
                </p>

                <p className="mt-4 text-4xl font-bold">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold">{user?.fullName || 'Staff Member'}</p>
                        <p className="text-sm text-slate-500">{user?.email || 'staff@example.com'}</p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                        Edit
                      </span>
                    </div>
                    <p className="mt-5 text-sm text-slate-500">
                      Track your team’s progress, stay on top of room readiness, and manage today’s service priorities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Performance</p>
                    <h2 className="text-2xl font-semibold mt-2">Daily Activity</h2>
                  </div>
                </div>
                <div className="mt-6 space-y-5">
                  <div>
                    <div className="flex justify-between text-sm font-medium text-slate-600">
                      <span>Tasks</span>
                      <span>{stats?.pendingBookings || 0}</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, stats?.pendingBookings || 0)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-medium text-slate-600">
                      <span>Complete Work</span>
                      <span>{completeWorkPercent}%</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-slate-900" style={{ width: `${completeWorkPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-medium text-slate-600">
                      <span>Hours</span>
                      <span>{hoursPercent}%</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-cyan-500" style={{ width: `${hoursPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Attendance</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">March</span>
                </div>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Present</p>
                    <p className="mt-3 text-3xl font-semibold">15</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Late</p>
                    <p className="mt-3 text-3xl font-semibold">5</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 text-center">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Absent</p>
                    <p className="mt-3 text-3xl font-semibold">10</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Task Status</p>
                  <span className="text-sm font-semibold text-slate-500">100%</span>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-slate-100">
                    <div className="absolute inset-0 rounded-full border-8 border-slate-200" />
                    <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white text-center">
                      <p className="text-2xl font-semibold">{Math.round((completedCount / taskStatusTotal) * 100)}%</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Completed</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {taskStatus.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.color}`} />
                        <span className="text-slate-600">{item.label}</span>
                      </div>
                      <span className="font-semibold text-slate-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Housekeeping</p>
                  <span className="text-sm font-semibold text-slate-600">{cleanPercent}% Clean</span>
                </div>
                <div className="mt-6">
                  <div className="grid gap-4">
                    <div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Clean</span>
                        <span>{cleanPercent}%</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${cleanPercent}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Dirty</span>
                        <span>{100 - cleanPercent}%</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-300" style={{ width: `${100 - cleanPercent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Today's Event</p>
                  <h2 className="text-xl font-semibold mt-2">Ariana’s Birthday</h2>
                </div>
                <div className="h-16 w-16 overflow-hidden rounded-3xl bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80"
                    alt="Event"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Employees on Leave</p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80"
                        alt="Kevin"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Kevin Hart</p>
                      <p className="text-sm text-slate-500">Health leave end</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Calendar</p>
                  <h2 className="text-xl font-semibold mt-2">September 2025</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  <span>Sep</span>
                  <span>2025</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-7 gap-2 text-center text-sm text-slate-600">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map((day) => (
                  <div key={day} className="font-semibold">{day}</div>
                ))}
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="h-10 rounded-2xl bg-slate-50" />
                ))}
                {[8, 9, 10, 11, 12, 13, 14].map((date) => (
                  <div
                    key={date}
                    className={`flex h-10 items-center justify-center rounded-2xl ${date === 9 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Today's Check-ins
                </h2>

                <div className="space-y-3">
                  {bookings
                    .filter(
                      (booking) =>
                        booking.status === "confirmed" &&
                        new Date(
                          booking.check_in_date
                        ).toDateString() ===
                          new Date().toDateString()
                    )
                    .slice(0, 5)
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">
                            {booking.profiles?.full_name || "Unknown"}
                          </p>

                          <p className="text-sm text-slate-500">
                            Room {booking.rooms?.room_number}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            handleBookingStatusUpdate(
                              booking.id,
                              "checked_in"
                            )
                          }
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Check In
                        </button>
                      </div>
                    ))}

                  {bookings.filter(
                    (booking) =>
                      booking.status === "confirmed" &&
                      new Date(
                        booking.check_in_date
                      ).toDateString() === new Date().toDateString()
                  ).length === 0 && (
                    <p className="text-slate-500 text-center py-4">
                      No check-ins today
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Room Status Overview
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Available</span>

                    <span className="font-semibold text-green-600">
                      {stats?.availableRooms || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Occupied</span>

                    <span className="font-semibold text-red-600">
                      {stats?.occupiedRooms || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Maintenance</span>

                    <span className="font-semibold text-yellow-600">
                      {stats?.roomStatuses?.maintenance || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Cleaning</span>

                    <span className="font-semibold text-blue-600">
                      {stats?.roomStatuses?.cleaning || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
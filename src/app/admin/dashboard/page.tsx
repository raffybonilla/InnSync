'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms' | 'users'>('overview');

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/auth/admin');
      return;
    }

    const storedUser = JSON.parse(userJson) as UserSession;
    if (!storedUser || !['admin', 'manager'].includes(storedUser.role)) {
      router.push('/auth/admin');
      return;
    }

    setUser(storedUser);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, bookingsResponse] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/bookings?status=pending')
      ]);

      const statsData = await statsResponse.json();
      const bookingsData = await bookingsResponse.json();

      if (statsData.stats) {
        setStats(statsData.stats);
      }
      if (bookingsData.bookings) {
        setBookings(bookingsData.bookings);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/admin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white py-5 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">INNSYNC Admin Dashboard</h1>
            <p className="text-slate-300">Welcome back, {user?.fullName || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-rose-600"
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'bookings', label: 'Bookings' },
              { id: 'rooms', label: 'Rooms' },
              { id: 'users', label: 'Users' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === 'overview' && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Rooms</p>
                <p className="mt-4 text-4xl font-bold">{stats?.totalRooms || 0}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active Bookings</p>
                <p className="mt-4 text-4xl font-bold">{stats?.activeBookings || 0}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Revenue</p>
                <p className="mt-4 text-4xl font-bold">${(stats?.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Users</p>
                <p className="mt-4 text-4xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Room Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Available</span>
                    <span className="font-semibold">{stats?.availableRooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Occupied</span>
                    <span className="font-semibold">{stats?.occupiedRooms || 0}</span>
                  </div>
                  {Object.entries(stats?.roomStatuses || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between capitalize">
                      <span className="text-slate-600">{status}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                <div className="space-y-3">
                  {stats?.recentBookings?.slice(0, 5).map((booking: any) => (
                    <div key={booking.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                      <div>
                        <p className="font-medium">{booking.profiles?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-slate-500">Room {booking.rooms?.room_number} • {booking.status}</p>
                      </div>
                      <span className="text-sm font-semibold">${booking.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Pending Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{booking.profiles?.full_name || 'Unknown Guest'}</h3>
                      <p className="text-sm text-slate-600">Room {booking.rooms?.room_number} • {booking.rooms?.room_type}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${booking.total_price}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-slate-500 text-center py-8">No pending bookings</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Room Management</h2>
            <p className="text-slate-600">Room management functionality will be implemented here.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            <p className="text-slate-600">User management functionality will be implemented here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

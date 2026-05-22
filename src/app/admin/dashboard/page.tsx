'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

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
        fetchDashboardData();
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

  const occupancyRate = stats?.totalRooms
    ? Math.round(((stats.occupiedRooms || 0) / stats.totalRooms) * 100)
    : 0;

  const weeklyData = Array.from({ length: 7 }).map((_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    value: Math.floor(Math.random() * 100) + 20
  }));

  const navigationItems = [
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '👥', label: 'User Management' },
    { icon: '🏨', label: 'Hotel & Room Management' },
    { icon: '🎁', label: 'Promotions' },
    { icon: '⚙️', label: 'System Settings' },
    { icon: '🔌', label: 'API & Integration' },
    { icon: '🔧', label: 'Maintenance' },
  ];

  return (
    <AdminLayout activePage="dashboard" user={user}>
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Users</p>
                <p className="mt-3 text-3xl font-semibold">{(stats?.totalUsers || 0).toLocaleString()}</p>
                <p className="mt-2 text-sm font-medium text-green-600">↗ +12.3%</p>
              </div>
              <span className="text-4xl">👤</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active Hotels</p>
                <p className="mt-3 text-3xl font-semibold">{stats?.totalRooms || 0}</p>
                <p className="mt-2 text-sm font-medium text-green-600">↗ +5.2%</p>
              </div>
              <span className="text-4xl">🏨</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Bookings Today</p>
                <p className="mt-3 text-3xl font-semibold">{stats?.pendingBookings || 0}</p>
                <p className="mt-2 text-sm font-medium text-red-600">↘ -2.4%</p>
              </div>
              <span className="text-4xl">📅</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Revenue (MTD)</p>
                <p className="mt-3 text-3xl font-semibold">${(stats?.totalRevenue || 0).toLocaleString()}</p>
                <p className="mt-2 text-sm font-medium text-green-600">↗ +18.7%</p>
              </div>
              <span className="text-4xl">💵</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Revenue Overview</h2>
            <div className="h-64 flex items-end gap-2 bg-slate-50 rounded-lg p-4">
              {weeklyData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${(item.value / 120) * 200}px` }}
                  />
                  <span className="text-xs text-slate-600">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-slate-600">Jan</span>
              <span className="font-medium text-slate-900">Year-over-year growth: +23.5%</span>
              <span className="text-slate-600">Dec</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Room Type Distribution</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Standard</span>
                  <span className="text-sm font-semibold text-slate-900">35%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Deluxe</span>
                  <span className="text-sm font-semibold text-slate-900">28%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Suite</span>
                  <span className="text-sm font-semibold text-slate-900">22%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '22%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Premium</span>
                  <span className="text-sm font-semibold text-slate-900">15%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Weekly Bookings</h2>
            <div className="h-40 bg-slate-50 rounded-lg flex items-end gap-2 p-4">
              {weeklyData.map((item, idx) => (
                <div key={idx} className="flex-1 bg-slate-300 rounded-t-lg" style={{ height: `${(item.value / 120) * 100}%` }} />
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Bookings</span>
                <span className="font-semibold text-slate-900">{bookings.length}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Quick Stats</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Occupancy Rate</span>
                  <span className="font-semibold text-slate-900">{occupancyRate}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${occupancyRate}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Staff Count</span>
                  <span className="font-semibold text-slate-900">{stats?.staffCount || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Available Rooms</span>
                  <span className="font-semibold text-slate-900">{stats?.availableRooms || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Active Bookings</span>
                  <span className="font-semibold text-slate-900">{stats?.activeBookings || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
}

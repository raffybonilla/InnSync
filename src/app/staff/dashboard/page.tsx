"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

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

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/auth/staff');
      return;
    }

    const storedUser = JSON.parse(userJson) as UserSession;
    if (!storedUser || storedUser.role !== 'staff') {
      router.push('/auth/staff');
      return;
    }

    setUser(storedUser);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/staff');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <StaffLayout activePage="dashboard" user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Welcome, {user?.fullName || user?.email}</h1>
        <p className="text-slate-500 mt-2">Staff Dashboard</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Today's Tasks</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Active Bookings</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.activeBookings || 0}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Available Rooms</p>
          <p className="mt-2 text-3xl font-semibold">{stats?.availableRooms || 0}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold">${(stats?.totalRevenue || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-900 px-6 py-2 text-white hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </StaffLayout>
  );
}

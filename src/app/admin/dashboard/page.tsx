'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserSession {
  id: string;
  email: string | null;
  role: string;
  fullName: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [router]);

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

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Staff</p>
            <p className="mt-4 text-4xl font-bold">18</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active Bookings</p>
            <p className="mt-4 text-4xl font-bold">124</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Revenue (MTD)</p>
            <p className="mt-4 text-4xl font-bold">$54.4K</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Hotels Online</p>
            <p className="mt-4 text-4xl font-bold">42</p>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick actions</h2>
            <ul className="space-y-3 text-slate-600">
              <li>• Review staff performance</li>
              <li>• Manage hotel inventory</li>
              <li>• View user reports</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your role</h2>
            <p className="text-slate-700 mb-2">{user?.role === 'manager' ? 'Manager' : 'Administrator'}</p>
            <p className="text-sm text-slate-500">Use this dashboard to manage staff, bookings, and hotel operations.</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Staff overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">On Duty</p>
                <p className="mt-2 text-2xl">12</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">Off Duty</p>
                <p className="mt-2 text-2xl">6</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

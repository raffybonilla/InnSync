'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserSession {
  id: string;
  email: string | null;
  role: string;
  fullName: string;
}

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/staff');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 py-5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Staff Dashboard</p>
            <h1 className="text-3xl font-semibold">Welcome, {user?.fullName || user?.email}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Today&apos;s Tasks</p>
            <p className="mt-4 text-4xl font-bold">14</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Completed</p>
            <p className="mt-4 text-4xl font-bold">9</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Rooms Cleaned</p>
            <p className="mt-4 text-4xl font-bold">22</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Current Shift</p>
            <p className="mt-4 text-4xl font-bold">Morning</p>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
            <p className="text-slate-600">Track your assignments, update room status, and stay aligned with the work plan.</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Focus areas</h2>
            <ul className="space-y-3 text-slate-600">
              <li>• Check guest arrival list</li>
              <li>• Confirm room readiness</li>
              <li>• Update housekeeping status</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-slate-700 font-medium">Role</p>
            <p className="mt-2 text-slate-500">Staff member</p>
          </div>
        </section>
      </main>
    </div>
  );
}

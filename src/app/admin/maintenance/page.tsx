'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function Maintenance() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/auth/admin');
      return;
    }
    const storedUser = JSON.parse(userJson);
    if (!['admin', 'manager'].includes(storedUser.role)) {
      router.push('/auth/admin');
      return;
    }
    setUser(storedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AdminLayout activePage="maintenance" user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Maintenance Tasks</h1>
          <p className="text-slate-500 mt-2">Automated system maintenance jobs</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div>
              <p className="font-semibold">Database Cleanup</p>
              <p className="text-sm text-slate-600">Schedule: Daily at 3:00 AM • Last run: 2026-02-12 03:00</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded">Active</span>
              <button className="w-10 h-6 bg-slate-300 rounded-full" />
            </div>
          </div>

          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div>
              <p className="font-semibold">Log Rotation</p>
              <p className="text-sm text-slate-600">Schedule: Weekly on Sunday • Last run: 2026-02-09 01:00</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded">Active</span>
              <button className="w-10 h-6 bg-slate-300 rounded-full" />
            </div>
          </div>

          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div>
              <p className="font-semibold">Cache Clear</p>
              <p className="text-sm text-slate-600">Schedule: Every 6 hours • Last run: 2026-02-12 12:00</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded">Active</span>
              <button className="w-10 h-6 bg-slate-300 rounded-full" />
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">Backup Archives</p>
              <p className="text-sm text-slate-600">Schedule: Monthly • Last run: 2026-02-01 02:00</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded">Active</span>
              <button className="w-10 h-6 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Maintenance Actions</h2>
          <p className="text-slate-600 mb-4">Perform system maintenance operations</p>
          <div className="grid gap-4 md:grid-cols-2">
            <button className="px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-sm">
              🔄 Clear Application Cache
            </button>
            <button className="px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-sm">
              📁 Clean Temporary Files
            </button>
            <button className="px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-sm">
              ⚙️ Optimize Database
            </button>
            <button className="px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-sm">
              🔍 Run System Diagnostics
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border-2 border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-900">Maintenance Mode</h3>
              <p className="text-sm text-amber-800 mt-1">Enable maintenance mode to temporarily disable public access while performing system updates.</p>
              <button className="mt-3 px-4 py-2 bg-white border border-amber-300 rounded-lg text-sm font-medium hover:bg-amber-50">
                Enable Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

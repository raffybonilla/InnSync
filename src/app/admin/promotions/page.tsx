'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function Promotions() {
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

  const promotions = [
    { id: 1, name: 'Summer Sale', code: 'SUMMER25', discount: '25% off', period: '2026-06-01 to 2026-08-31', usage: '456 / 1000', status: 'Active' },
    { id: 2, name: 'Weekend Getaway', code: 'WEEKEND50', discount: '$50 discount', period: '2026-02-01 to 2026-12-31', usage: '234 / 500', status: 'Active' },
    { id: 3, name: 'Early Bird Special', code: 'EARLYBIRD', discount: '15% off', period: '2026-01-01 to 2026-03-31', usage: '789 / 1000', status: 'Active' },
    { id: 4, name: 'Holiday Special', code: 'HOLIDAY2025', discount: '30% off', period: '2025-12-15 to 2026-01-05', usage: '1200 / 1200', status: 'Expired' },
  ];

  return (
    <AdminLayout activePage="promotions" user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Promotions Management</h1>
          <p className="text-slate-500 mt-2">Create and manage promotional campaigns</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active Promotions</p>
            <p className="mt-3 text-3xl font-semibold">12</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Redemptions</p>
            <p className="mt-3 text-3xl font-semibold">3,024</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Revenue Impact</p>
            <p className="mt-3 text-3xl font-semibold">$42.5K</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Avg. Discount</p>
            <p className="mt-3 text-3xl font-semibold">22%</p>
          </div>
          <div className="flex items-center justify-end">
            <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              + Create Promotion
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">All Promotions</h2>
            <div className="mt-4">
              <input type="text" placeholder="Search promotions..." className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Promotion</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Valid Period</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Usage</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{promo.name}</td>
                    <td className="px-6 py-4 font-mono text-sm">{promo.code}</td>
                    <td className="px-6 py-4">{promo.discount}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{promo.period}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm mb-1">{promo.usage}</div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: promo.id === 4 ? '100%' : `${(parseInt(promo.usage.split(' ')[0]) / parseInt(promo.usage.split(' ')[2])) * 100}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        promo.status === 'Active' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {promo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-slate-600 hover:text-slate-900">⋯</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

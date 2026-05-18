'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function HotelManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const hotels = [
    { id: 1, name: 'Grand Plaza Hotel', location: 'New York, NY', rating: 4.8, rooms: 250, available: 42, status: 'Active', revenue: '$125K' },
    { id: 2, name: 'Ocean View Resort', location: 'Miami, FL', rating: 4.6, rooms: 180, available: 28, status: 'Active', revenue: '$98K' },
    { id: 3, name: 'Mountain Lodge', location: 'Denver, CO', rating: 4.9, rooms: 120, available: 15, status: 'Active', revenue: '$76K' },
    { id: 4, name: 'City Center Inn', location: 'Chicago, IL', rating: 4.3, rooms: 95, available: 8, status: 'Maintenance', revenue: '$52K' },
  ];

  return (
    <AdminLayout activePage="hotels" user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hotel & Room Management</h1>
          <p className="text-slate-500 mt-2">Manage hotels and room inventory</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Hotels</p>
            <p className="mt-3 text-3xl font-semibold">156</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Rooms</p>
            <p className="mt-3 text-3xl font-semibold">8,542</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Available Rooms</p>
            <p className="mt-3 text-3xl font-semibold">1,234</p>
            <p className="mt-2 text-sm font-medium text-green-600">14.4%</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Avg. Rating</p>
            <p className="mt-3 text-3xl font-semibold">4.7 ⭐</p>
          </div>
          <div className="flex items-center justify-end">
            <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              + Add Hotel
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Hotel & Room Inventory</h2>
            <div className="mt-4 flex gap-3">
              <input
                type="text"
                placeholder="Search hotels or rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Hotels</button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Rooms</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Hotel Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Rating</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Rooms</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Available</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Revenue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{hotel.name}</td>
                    <td className="px-6 py-4 text-slate-600">📍 {hotel.location}</td>
                    <td className="px-6 py-4">⭐ {hotel.rating}</td>
                    <td className="px-6 py-4">{hotel.rooms}</td>
                    <td className="px-6 py-4">{hotel.available}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        hotel.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {hotel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{hotel.revenue}</td>
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

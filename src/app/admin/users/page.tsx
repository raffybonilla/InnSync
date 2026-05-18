'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'staff' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  bookings: number;
  joinedDate: string;
}

export default function UserManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'john.smith@email.com',
      fullName: 'John Smith',
      role: 'admin',
      status: 'active',
      bookings: 12,
      joinedDate: '2024-01-15'
    },
    {
      id: '2',
      email: 'sarah.j@email.com',
      fullName: 'Sarah Johnson',
      role: 'manager',
      status: 'active',
      bookings: 8,
      joinedDate: '2024-03-22'
    },
    {
      id: '3',
      email: 'michael.chen@email.com',
      fullName: 'Michael Chen',
      role: 'guest',
      status: 'active',
      bookings: 24,
      joinedDate: '2023-11-08'
    },
    {
      id: '4',
      email: 'emma.davis@email.com',
      fullName: 'Emma Davis',
      role: 'guest',
      status: 'inactive',
      bookings: 3,
      joinedDate: '2025-09-12'
    }
  ]);
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

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout activePage="users" user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-slate-500 mt-2">Manage and monitor all system users</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Users</p>
            <p className="mt-3 text-3xl font-semibold">2,847</p>
            <p className="mt-2 text-sm font-medium text-slate-400">👤</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active Users</p>
            <p className="mt-3 text-3xl font-semibold">2,654</p>
            <p className="mt-2 text-sm font-medium text-green-600">●</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admins</p>
            <p className="mt-3 text-3xl font-semibold">12</p>
            <p className="mt-2 text-sm font-medium text-slate-400">🛡️</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">New This Month</p>
            <p className="mt-3 text-3xl font-semibold">143</p>
            <p className="mt-2 text-sm font-medium text-green-600">↗ +12.3%</p>
          </div>
          <div className="flex items-center justify-end">
            <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              + Add User
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">All Users</h2>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Bookings</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-sm">
                          {u.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        <div>{u.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{u.bookings}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.joinedDate}</td>
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

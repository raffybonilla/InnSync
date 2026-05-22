'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'staff' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  username: string;
  department?: string;
  created_at: string;
  bookings?: number;
}

type TabType = 'all' | 'staff' | 'users' | 'admins';

export default function UserManagement() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

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
    setAdmin(storedUser);
    fetchProfiles();
  }, [router]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        // Ensure all profiles have required fields with defaults
        const normalizedProfiles = (data.profiles || []).map((p: any) => ({
          ...p,
          status: p.status || 'active',
          role: p.role || 'guest',
          department: p.department || 'general',
        }));
        setProfiles(normalizedProfiles);
      } else {
        console.error('Failed to fetch profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProfiles = () => {
    let filtered = profiles;

    // Filter by tab
    if (activeTab === 'staff') {
      filtered = filtered.filter((p) => p.role === 'staff');
    } else if (activeTab === 'users') {
      filtered = filtered.filter((p) => p.role === 'guest');
    } else if (activeTab === 'admins') {
      filtered = filtered.filter((p) => p.role === 'admin' || p.role === 'manager');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStats = () => {
    return {
      total: profiles.length,
      staff: profiles.filter((p) => p.role === 'staff').length,
      users: profiles.filter((p) => p.role === 'guest').length,
      admins: profiles.filter((p) => p.role === 'admin' || p.role === 'manager').length,
      active: profiles.filter((p) => p.status === 'active').length,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'guest':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout activePage="users" user={admin}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading user data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = getStats();
  const filteredProfiles = getFilteredProfiles();

  return (
    <AdminLayout activePage="users" user={admin}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">User & Staff Management</h1>
          <p className="text-slate-500 mt-2">Manage all users and staff members in the system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Users</p>
                <p className="mt-3 text-3xl font-semibold">{stats.total}</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Staff Members</p>
                <p className="mt-3 text-3xl font-semibold">{stats.staff}</p>
              </div>
              <span className="text-4xl">👔</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Guests</p>
                <p className="mt-3 text-3xl font-semibold">{stats.users}</p>
              </div>
              <span className="text-4xl">🚶</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admins/Managers</p>
                <p className="mt-3 text-3xl font-semibold">{stats.admins}</p>
              </div>
              <span className="text-4xl">🛡️</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active</p>
                <p className="mt-3 text-3xl font-semibold">{stats.active}</p>
              </div>
              <span className="text-4xl">🟢</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          {/* Search and Tabs */}
          <div className="mb-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Users & Staff Directory</h2>
              
              {/* Tabs */}
              <div className="flex gap-2 border-b border-slate-200 mb-4">
                {[
                  { id: 'all', label: 'All Users', count: stats.total },
                  { id: 'staff', label: 'Staff', count: stats.staff },
                  { id: 'users', label: 'Guests', count: stats.users },
                  { id: 'admins', label: 'Admins/Managers', count: stats.admins },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-4 py-3 font-medium border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label} <span className="ml-2 text-sm text-slate-500">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Results */}
          {filteredProfiles.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Username</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-slate-900">{profile.full_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{profile.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">@{profile.username}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(profile.role)}`}>
                          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{profile.department || '—'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(profile.status || 'active')}`}>
                          {(profile.status || 'active').charAt(0).toUpperCase() + (profile.status || 'active').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(profile.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

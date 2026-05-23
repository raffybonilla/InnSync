'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  special_requests?: string;
  profiles?: { full_name: string; email: string };
  rooms?: { room_number: string; room_type: string; price_per_night: number };
  created_at?: string;
}

export default function ReservationPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'DAILY' | 'MONTHLY'>('DAILY');

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/auth/staff');
      return;
    }
    const storedUser = JSON.parse(userJson);
    if (!storedUser || storedUser.role !== 'staff') {
      router.push('/auth/staff');
      return;
    }
    setUser(storedUser);
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'checked_in':
        return 'bg-green-100 text-green-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = 
      !searchTerm ||
      b.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.rooms?.room_number.includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    checked_in: bookings.filter((b) => b.status === 'checked_in').length,
    total: bookings.length,
  };

  if (loading) {
    return (
      <StaffLayout activePage="reservation" user={user}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading reservations...</p>
          </div>
        </div>
      </StaffLayout>
    );
  }
  return (
    <StaffLayout activePage="reservation" user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reservations & Bookings</h1>
            <p className="text-slate-500 mt-2">Manage all guest reservations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('DAILY')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                viewMode === 'DAILY'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('MONTHLY')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                viewMode === 'MONTHLY'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Monthly View
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Bookings</p>
            <p className="mt-3 text-3xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Pending</p>
            <p className="mt-3 text-3xl font-semibold">{stats.pending}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Confirmed</p>
            <p className="mt-3 text-3xl font-semibold">{stats.confirmed}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Checked In</p>
            <p className="mt-3 text-3xl font-semibold">{stats.checked_in}</p>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-4">
            <h2 className="text-lg font-semibold">All Reservations</h2>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All', count: stats.total },
                { id: 'pending', label: 'Pending', count: stats.pending },
                { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                { id: 'checked_in', label: 'Checked In', count: stats.checked_in },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    statusFilter === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label} <span className="ml-2 text-sm opacity-75">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by guest name, email, or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-lg">No reservations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Booking ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Guest</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Room</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Check-In</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Check-Out</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-mono text-slate-900">{booking.id.substring(0, 8)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium">{booking.profiles?.full_name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{booking.profiles?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div>{booking.rooms?.room_number}</div>
                        <div className="text-xs text-slate-500">{booking.rooms?.room_type}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(booking.check_in)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(booking.check_out)}</td>
                      <td className="px-6 py-4 text-sm font-semibold">${booking.total_price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked In</option>
                          <option value="checked_out">Checked Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
}

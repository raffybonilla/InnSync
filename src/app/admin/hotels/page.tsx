'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  rooms: number;
  available: number;
  status: 'active' | 'maintenance' | 'inactive';
  revenue: string;
  created_at?: string;
}

export default function HotelManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 0,
    rooms: 0,
    available: 0,
    revenue: '$0',
  });

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
    fetchHotels();
  }, [router]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hotels');
      if (response.ok) {
        const data = await response.json();
        setHotels(data.hotels || []);
      } else {
        console.error('Failed to fetch hotels');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: '',
          location: '',
          rating: 0,
          rooms: 0,
          available: 0,
          revenue: '$0',
        });
        setShowForm(false);
        fetchHotels();
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: hotels.length,
    active: hotels.filter((h) => h.status === 'active').length,
    maintenance: hotels.filter((h) => h.status === 'maintenance').length,
    totalRooms: hotels.reduce((sum, h) => sum + (h.rooms || 0), 0),
  };

  if (loading) {
    return (
      <AdminLayout activePage="hotels" user={user}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading hotel data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="hotels" user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hotel & Room Management</h1>
            <p className="text-slate-500 mt-2">Manage hotels and room inventory</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Hotel
          </button>
        </div>

        {/* Add Hotel Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Hotel</h2>
            <form onSubmit={handleAddHotel} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Hotel Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Rating (0-5)"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Total Rooms"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Available Rooms"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Revenue"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Add Hotel
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Hotels</p>
            <p className="mt-3 text-3xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Rooms</p>
            <p className="mt-3 text-3xl font-semibold">{stats.totalRooms}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active</p>
            <p className="mt-3 text-3xl font-semibold">{stats.active}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Maintenance</p>
            <p className="mt-3 text-3xl font-semibold">{stats.maintenance}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Avg. Rating</p>
            <p className="mt-3 text-3xl font-semibold">
              {hotels.length > 0 ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1) : '0'}
            </p>
          </div>
        </div>

        {/* Search and Table */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Hotel & Room Inventory</h2>
            <input
              type="text"
              placeholder="Search hotels or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filteredHotels.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-lg">No hotels found</p>
            </div>
          ) : (
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
                  {filteredHotels.map((hotel) => (
                    <tr key={hotel.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{hotel.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">📍 {hotel.location}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">⭐ {hotel.rating}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{hotel.rooms}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{hotel.available}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(hotel.status || 'active')}`}>
                          {(hotel.status || 'active').charAt(0).toUpperCase() + (hotel.status || 'active').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{hotel.revenue}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-slate-600 hover:text-slate-900">⋯</button>
                      </td>
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

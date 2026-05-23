'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

const AVAILABLE_AMENITIES = [
  { id: 'wifi', label: 'Free Wi-Fi', icon: '📶' },
  { id: 'pool', label: 'Pool Access', icon: '🏊' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'tv', label: 'Smart TV', icon: '📺' },
  { id: 'aircon', label: 'Air Conditioning', icon: '❄️' },
  { id: 'mini_fridge', label: 'Mini Bar/Fridge', icon: '🧊' },
  { id: 'hairdryer', label: 'Hair Dryer', icon: '💇' },
  { id: 'dining', label: 'Dining Area', icon: '🍽️' },
  { id: 'bathrobe', label: 'Bathrobe & Slippers', icon: '🧥' },
  { id: 'workspace', label: 'Work Desk', icon: '💼' },
  { id: 'safe', label: 'In-room Safe', icon: '🔐' },
  { id: 'view', label: 'City/Ocean View', icon: '🌆' },
];

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  amenities?: string[];
  description?: string;
  created_at?: string;
}

export default function RoomManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: '',
    capacity: 1,
    price_per_night: 0,
    description: '',
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
    fetchRooms();
  }, [router]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amenities: selectedAmenities,
          capacity: parseInt(String(formData.capacity)),
          price_per_night: parseFloat(String(formData.price_per_night)),
        }),
      });

      if (response.ok) {
        setFormData({
          room_number: '',
          room_type: '',
          capacity: 1,
          price_per_night: 0,
          description: '',
        });
        setSelectedAmenities([]);
        setShowForm(false);
        fetchRooms();
      } else {
        alert('Failed to add room');
      }
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Error adding room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const response = await fetch(`/api/rooms?id=${roomId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchRooms();
        } else {
          alert('Failed to delete room');
        }
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredRooms = rooms.filter((r) =>
    r.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.room_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === 'available').length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    maintenance: rooms.filter((r) => r.status === 'maintenance').length,
  };

  if (loading) {
    return (
      <AdminLayout activePage="hotels" user={user}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading rooms...</p>
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
            <h1 className="text-3xl font-bold">Room Management</h1>
            <p className="text-slate-500 mt-2">Create and manage hotel rooms with amenities</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Room
          </button>
        </div>

        {/* Add Room Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Room Number (e.g., 101)"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Room Type (e.g., Deluxe Suite)"
                  value={formData.room_type}
                  onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Capacity (guests)"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
                <input
                  type="number"
                  placeholder="Price per Night ($)"
                  value={formData.price_per_night || ''}
                  onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) || 0 })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <textarea
                placeholder="Room Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              ></textarea>

              {/* Amenities Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">Select Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AVAILABLE_AMENITIES.map((amenity) => (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`p-3 rounded-lg border-2 transition flex items-center gap-2 ${
                        selectedAmenities.includes(amenity.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-lg">{amenity.icon}</span>
                      <span className="text-sm font-medium">{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Amenities Display */}
              {selectedAmenities.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Selected Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAmenities.map((amenityId) => {
                      const amenity = AVAILABLE_AMENITIES.find((a) => a.id === amenityId);
                      return (
                        <span
                          key={amenityId}
                          className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity?.icon} {amenity?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedAmenities([]);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Rooms</p>
            <p className="mt-3 text-3xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Available</p>
            <p className="mt-3 text-3xl font-semibold">{stats.available}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Occupied</p>
            <p className="mt-3 text-3xl font-semibold">{stats.occupied}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Maintenance</p>
            <p className="mt-3 text-3xl font-semibold">{stats.maintenance}</p>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">All Rooms</h2>
            <input
              type="text"
              placeholder="Search by room number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filteredRooms.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-lg">No rooms found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Room</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Capacity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Amenities</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">#{room.room_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{room.room_type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</td>
                      <td className="px-6 py-4 text-sm font-medium">${room.price_per_night.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        {room.amenities && room.amenities.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {room.amenities.slice(0, 3).map((amenity) => {
                              const amenityObj = AVAILABLE_AMENITIES.find((a) => a.id === amenity);
                              return (
                                <span key={amenity} title={amenityObj?.label} className="text-lg">
                                  {amenityObj?.icon}
                                </span>
                              );
                            })}
                            {room.amenities.length > 3 && (
                              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                                +{room.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-slate-600 hover:text-slate-900 px-2">✎</button>
                        <button 
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-900 px-2">
                          ✕
                        </button>
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

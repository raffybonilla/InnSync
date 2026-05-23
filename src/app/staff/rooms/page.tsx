'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  created_at?: string;
}

export default function RoomsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'available' | 'occupied' | 'maintenance' | 'cleaning'>('All');

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
    fetchRooms();
  }, [router]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      } else {
        console.error('Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = statusFilter === 'All' ? rooms : rooms.filter(r => r.status === statusFilter);

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

  const updateRoomStatus = async (roomId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: roomId, status: newStatus }),
      });

      if (response.ok) {
        fetchRooms();
      } else {
        console.error('Failed to update room status');
      }
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  };

  const stats = [
    { label: 'Total Rooms', value: rooms.length, color: 'bg-slate-50' },
    { label: 'Available', value: rooms.filter(r => r.status === 'available').length, color: 'bg-green-50' },
    { label: 'Occupied', value: rooms.filter(r => r.status === 'occupied').length, color: 'bg-blue-50' },
    { label: 'In Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: 'bg-red-50' },
  ];

  if (loading) {
    return (
      <StaffLayout activePage="rooms" user={user}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading room data...</p>
          </div>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout activePage="rooms" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Room Management</h1>
          <input
            type="text"
            placeholder="Search room..."
            className="px-4 py-2 border border-slate-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${stat.color} rounded-[24px] p-6 border border-slate-200`}>
              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
              <p className="text-4xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            {(['All', 'available', 'occupied', 'maintenance', 'cleaning'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter === 'All' ? filter : (filter as any))}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  statusFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <div key={room.id} className="rounded-[24px] border border-slate-200 bg-white p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Room {room.room_number}</h3>
                    <p className="text-slate-600 text-sm">{room.room_type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.status)}`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Capacity:</span> {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</p>
                  <p><span className="font-medium">Price:</span> ${room.price_per_night}/night</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    View Details
                  </button>
                  <select
                    value={room.status}
                    onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

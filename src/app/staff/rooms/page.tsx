'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

interface Room {
  roomNo: string;
  type: string;
  capacity: number;
  price: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Cleaning';
}

export default function RoomsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([
    { roomNo: '101', type: 'Single Room', capacity: 1, price: 50, status: 'Available' },
    { roomNo: '102', type: 'Double Room', capacity: 2, price: 80, status: 'Occupied' },
    { roomNo: '103', type: 'Single Room', capacity: 1, price: 50, status: 'Available' },
    { roomNo: '104', type: 'Deluxe Suite', capacity: 4, price: 150, status: 'Maintenance' },
    { roomNo: '201', type: 'Double Room', capacity: 2, price: 80, status: 'Cleaning' },
    { roomNo: '202', type: 'Single Room', capacity: 1, price: 50, status: 'Available' },
    { roomNo: '203', type: 'Deluxe Suite', capacity: 4, price: 150, status: 'Occupied' },
    { roomNo: '204', type: 'Double Room', capacity: 2, price: 80, status: 'Available' },
    { roomNo: '301', type: 'Suite', capacity: 3, price: 120, status: 'Occupied' },
    { roomNo: '302', type: 'Single Room', capacity: 1, price: 50, status: 'Available' },
    { roomNo: '303', type: 'Double Room', capacity: 2, price: 80, status: 'Available' },
    { roomNo: '304', type: 'Deluxe Suite', capacity: 4, price: 150, status: 'Cleaning' },
  ]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Occupied' | 'Maintenance' | 'Cleaning'>('All');

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
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const filteredRooms = statusFilter === 'All' ? rooms : rooms.filter(r => r.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Occupied':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-red-100 text-red-800';
      case 'Cleaning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const stats = [
    { label: 'Total Rooms', value: rooms.length, color: 'bg-slate-50' },
    { label: 'Available', value: rooms.filter(r => r.status === 'Available').length, color: 'bg-green-50' },
    { label: 'Occupied', value: rooms.filter(r => r.status === 'Occupied').length, color: 'bg-blue-50' },
    { label: 'In Maintenance', value: rooms.filter(r => r.status === 'Maintenance').length, color: 'bg-red-50' },
  ];

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
            {(['All', 'Available', 'Occupied', 'Maintenance', 'Cleaning'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
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
            {filteredRooms.map((room, idx) => (
              <div key={idx} className="rounded-[24px] border border-slate-200 bg-white p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Room {room.roomNo}</h3>
                    <p className="text-slate-600 text-sm">{room.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Capacity:</span> {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</p>
                  <p><span className="font-medium">Price:</span> ${room.price}/night</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition">
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

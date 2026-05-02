'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserSession {
  id: string;
  email: string | null;
  role: string;
  fullName: string;
}

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  totalUsers: number;
  staffCount: number;
  totalRevenue: number;
  recentBookings: any[];
  roomStatuses: Record<string, number>;
}

interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  total_price: number;
  profiles: {
    full_name: string;
    email: string;
  };
  rooms: {
    room_number: string;
    room_type: string;
  };
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  status: string;
  description: string;
  amenities: string[];
}

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms'>('overview');

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      router.push('/auth/staff');
      return;
    }

    const storedUser = JSON.parse(userJson) as UserSession;
    if (!storedUser || storedUser.role !== 'staff') {
      router.push('/auth/staff');
      return;
    }

    setUser(storedUser);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, bookingsResponse, roomsResponse] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/bookings'),
        fetch('/api/rooms')
      ]);

      const statsData = await statsResponse.json();
      const bookingsData = await bookingsResponse.json();
      const roomsData = await roomsResponse.json();

      if (statsData.stats) {
        setStats(statsData.stats);
      }
      if (bookingsData.bookings) {
        setBookings(bookingsData.bookings);
      }
      if (roomsData.rooms) {
        setRooms(roomsData.rooms);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleRoomStatusUpdate = async (roomId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: roomId, status: newStatus }),
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/staff');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 py-5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Staff Dashboard</p>
            <h1 className="text-3xl font-semibold">Welcome, {user?.fullName || user?.email}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'bookings', label: 'Bookings' },
              { id: 'rooms', label: 'Rooms' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {activeTab === 'overview' && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-8">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Today's Tasks</p>
                <p className="mt-4 text-4xl font-bold">{stats?.pendingBookings || 0}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active Bookings</p>
                <p className="mt-4 text-4xl font-bold">{stats?.activeBookings || 0}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Available Rooms</p>
                <p className="mt-4 text-4xl font-bold">{stats?.availableRooms || 0}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Revenue</p>
                <p className="mt-4 text-4xl font-bold">${(stats?.totalRevenue || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Today's Check-ins</h2>
                <div className="space-y-3">
                  {bookings
                    .filter(booking => booking.status === 'confirmed' &&
                      new Date(booking.check_in_date).toDateString() === new Date().toDateString())
                    .slice(0, 5)
                    .map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                        <div>
                          <p className="font-medium">{booking.profiles?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-slate-500">Room {booking.rooms?.room_number}</p>
                        </div>
                        <button
                          onClick={() => handleBookingStatusUpdate(booking.id, 'checked_in')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Check In
                        </button>
                      </div>
                    ))}
                  {bookings.filter(booking => booking.status === 'confirmed' &&
                    new Date(booking.check_in_date).toDateString() === new Date().toDateString()).length === 0 && (
                    <p className="text-slate-500 text-center py-4">No check-ins today</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Room Status Overview</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Available</span>
                    <span className="font-semibold text-green-600">{stats?.availableRooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Occupied</span>
                    <span className="font-semibold text-red-600">{stats?.occupiedRooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Maintenance</span>
                    <span className="font-semibold text-yellow-600">{stats?.roomStatuses?.maintenance || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cleaning</span>
                    <span className="font-semibold text-blue-600">{stats?.roomStatuses?.cleaning || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">All Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{booking.profiles?.full_name || 'Unknown Guest'}</h3>
                      <p className="text-sm text-slate-600">Room {booking.rooms?.room_number} • {booking.rooms?.room_type}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${booking.total_price}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'checked_out' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleBookingStatusUpdate(booking.id, 'checked_in')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Check In
                      </button>
                    )}
                    {booking.status === 'checked_in' && (
                      <button
                        onClick={() => handleBookingStatusUpdate(booking.id, 'checked_out')}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                      >
                        Check Out
                      </button>
                    )}
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <button
                        onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-slate-500 text-center py-8">No bookings found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Room Management</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <div key={room.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">Room {room.room_number}</h3>
                      <p className="text-sm text-slate-600 capitalize">{room.room_type}</p>
                      <p className="text-sm text-slate-600">Capacity: {room.capacity}</p>
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      room.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      room.status === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-2">${room.price_per_night}/night</p>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {room.status === 'available' && (
                      <button
                        onClick={() => handleRoomStatusUpdate(room.id, 'cleaning')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Start Cleaning
                      </button>
                    )}
                    {room.status === 'cleaning' && (
                      <button
                        onClick={() => handleRoomStatusUpdate(room.id, 'available')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Mark Ready
                      </button>
                    )}
                    {room.status === 'occupied' && (
                      <button
                        onClick={() => handleRoomStatusUpdate(room.id, 'maintenance')}
                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      >
                        Maintenance
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {rooms.length === 0 && (
              <p className="text-slate-500 text-center py-8">No rooms found</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

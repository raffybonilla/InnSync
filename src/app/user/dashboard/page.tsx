'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import HotelCard from '@/components/HotelCard';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Hotel {
  id: number;
  name: string;
  hotel_name: string;
  price_per_night: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  max_guests: number;
  room_size: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/user');
      return;
    }
    setUser(JSON.parse(userStr));
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setHotelsLoading(true);
        const response = await fetch('/api/hotels');
        const data = await response.json();
        if (data.hotels) {
          setHotels(data.hotels);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setHotelsLoading(false);
      }
    };

    if (!loading) {
      fetchHotels();
    }
  }, [loading]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Inn Sync - User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Username: <span className="font-semibold">{user?.username}</span></p>
            </div>
            <div>
              <p className="text-gray-600">Email: <span className="font-semibold">{user?.email}</span></p>
            </div>
          </div>
        </div>

        {/* Featured Hotel Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Hotel For You</h2>
          {hotelsLoading ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500">Loading hotels...</p>
            </div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <HotelCard hotel={hotels[0]} />
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500">No hotels available at the moment</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-3xl mb-2">🏨</div>
            <h3 className="text-lg font-semibold mb-2">Book Hotels</h3>
            <p className="text-gray-600">Find and book your perfect hotel stay</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
            <p className="text-gray-600">View your current and past reservations</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
        </div>
      </main>
    </div>
  );
}

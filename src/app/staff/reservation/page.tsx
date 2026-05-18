'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

interface Reservation {
  bookId: string;
  guestName: string;
  roomType: string;
  roomNo: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'RESERVED' | 'CANCELLED' | 'IN-HOUSE' | 'DEPARTED';
}

export default function ReservationPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'DAILY' | 'MONTHLY'>('DAILY');
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      bookId: '550091',
      guestName: 'Raymond Padilla',
      roomType: 'Deluxe',
      roomNo: '100',
      checkIn: 'Sat, 06 Mar 2025',
      checkOut: 'Mon, 08 Mar 2025',
      guests: 2,
      status: 'RESERVED'
    },
    {
      bookId: '550092',
      guestName: 'Rey Asia',
      roomType: 'King',
      roomNo: '201',
      checkIn: 'Fri, 05 Mar 2025',
      checkOut: 'Mon, 08 Mar 2025',
      guests: 1,
      status: 'RESERVED'
    },
    {
      bookId: '550093',
      guestName: 'Cali Isuu',
      roomType: 'Supreme',
      roomNo: '301',
      checkIn: 'Thu, 04 Mar 2025',
      checkOut: 'Tue, 09 Mar 2025',
      guests: 1,
      status: 'RESERVED'
    },
    {
      bookId: '550094',
      guestName: 'Summer Ci',
      roomType: 'King',
      roomNo: '202',
      checkIn: 'Wed, 03 Mar 2025',
      checkOut: 'Tue, 09 Mar 2025',
      guests: 3,
      status: 'CANCELLED'
    },
    {
      bookId: '550095',
      guestName: 'Cassie Ari',
      roomType: 'Deluxe',
      roomNo: '101',
      checkIn: 'Wed, 03 Mar 2025',
      checkOut: 'Tue, 09 Mar 2025',
      guests: 1,
      status: 'IN-HOUSE'
    },
    {
      bookId: '550096',
      guestName: 'Boreth Cage',
      roomType: 'Supreme',
      roomNo: '302',
      checkIn: 'Sun, 07 Mar 2025',
      checkOut: 'Tue, 09 Mar 2025',
      guests: 5,
      status: 'DEPARTED'
    }
  ]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESERVED':
        return 'text-blue-600';
      case 'CANCELLED':
        return 'text-red-600';
      case 'IN-HOUSE':
        return 'text-green-600';
      case 'DEPARTED':
        return 'text-purple-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'RESERVED':
        return '🔵';
      case 'CANCELLED':
        return '🔴';
      case 'IN-HOUSE':
        return '🟢';
      case 'DEPARTED':
        return '🟣';
      default:
        return '⚫';
    }
  };

  return (
    <StaffLayout activePage="reservation" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">RESERVATION</h1>
            <p className="text-slate-500 mt-1">Guest: 03 March, 2025</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('DAILY')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                viewMode === 'DAILY'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              DAILY
            </button>
            <button
              onClick={() => setViewMode('MONTHLY')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                viewMode === 'MONTHLY'
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              MONTHLY
            </button>
            <button className="px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
              + ADD RESERVATION
            </button>
          </div>
        </div>

        <div className="rounded-lg border-2 border-blue-500 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">BOOK ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">NAME</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ROOM</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">NO.</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">CHECK IN</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">CHECK OUT</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">GUEST</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">RES. STATUS</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.bookId} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium">{res.bookId}</td>
                    <td className="px-6 py-4 text-sm">{res.guestName}</td>
                    <td className="px-6 py-4 text-sm">{res.roomType}</td>
                    <td className="px-6 py-4 text-sm">{res.roomNo}</td>
                    <td className="px-6 py-4 text-sm">{res.checkIn}</td>
                    <td className="px-6 py-4 text-sm">{res.checkOut}</td>
                    <td className="px-6 py-4 text-sm">{res.guests} Persons</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${getStatusColor(res.status)}`}>
                      {getStatusDot(res.status)} {res.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

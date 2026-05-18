'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

interface CleaningTask {
  roomNo: string;
  chores: string;
  staffName: string;
  startDate: string;
  endDate: string;
  time: string;
  status: 'Completed' | 'Ongoing' | 'Pending';
}

export default function HouseKeepingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<CleaningTask[]>([
    {
      roomNo: '101',
      chores: 'Change bed linens, Vacuum, Clean floor, Restock toiletries',
      staffName: 'Maria Santos',
      startDate: 'January 5, 2026',
      endDate: 'January 5, 2026',
      time: '8:00 AM – 9:00 AM',
      status: 'Completed'
    },
    {
      roomNo: '203',
      chores: 'Deep cleaning, bathroom, Disinfect surfaces',
      staffName: 'John Reyes',
      startDate: 'February 6, 2026',
      endDate: 'February 6, 2026',
      time: '9:30 AM – 10:30 AM',
      status: 'Ongoing'
    },
    {
      roomNo: '305',
      chores: 'Balcony cleaning, Replace towels, Check all fixtures',
      staffName: 'Angela Cruz',
      startDate: 'February 7, 2026',
      endDate: 'February 7, 2026',
      time: '11:00 AM – 12:00 PM',
      status: 'Pending'
    },
    {
      roomNo: '402',
      chores: 'Full room sanitization, Bed making',
      staffName: 'Kevin Lim',
      startDate: 'March 3, 2026',
      endDate: 'March 3, 2026',
      time: '1:00 PM – 2:00 PM',
      status: 'Completed'
    },
    {
      roomNo: '510',
      chores: 'Post-checkout cleaning, Inventory check, Air freshening',
      staffName: 'Sofia Garcia',
      startDate: 'March 6, 2026',
      endDate: 'March 6, 2026',
      time: '2:30 PM – 3:30 PM',
      status: 'Ongoing'
    },
    {
      roomNo: '615',
      chores: 'Window cleaning, Dust furniture, Restock coffee station',
      staffName: 'Daniel Torres',
      startDate: 'March 8, 2026',
      endDate: 'March 8, 2026',
      time: '4:00 PM – 5:00 PM',
      status: 'Pending'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return '✅';
      case 'Ongoing':
        return '⏳';
      case 'Pending':
        return '⏱️';
      default:
        return '⚪';
    }
  };

  return (
    <StaffLayout activePage="housekeeping" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">House Keeping Management</h1>
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-slate-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Cleaning schedule</h2>

          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Room No.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Chores</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Staff Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium">{task.roomNo}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{task.chores}</td>
                      <td className="px-6 py-4 text-sm">{task.staffName}</td>
                      <td className="px-6 py-4 text-sm">{task.startDate}</td>
                      <td className="px-6 py-4 text-sm">{task.endDate}</td>
                      <td className="px-6 py-4 text-sm">{task.time}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className={
                            task.status === 'Completed' ? 'text-green-600' :
                            task.status === 'Ongoing' ? 'text-blue-600' :
                            'text-yellow-600'
                          }>{task.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

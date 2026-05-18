'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffLayout from '@/components/StaffLayout';

interface MonthlyData {
  month: string;
  bookings: number;
  occupancy: number;
  revenue: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    { month: 'Jan', bookings: 45, occupancy: 72, revenue: 5400 },
    { month: 'Feb', bookings: 52, occupancy: 78, revenue: 6200 },
    { month: 'Mar', bookings: 48, occupancy: 75, revenue: 5800 },
    { month: 'Apr', bookings: 61, occupancy: 85, revenue: 7300 },
    { month: 'May', bookings: 58, occupancy: 82, revenue: 7000 },
    { month: 'Jun', bookings: 65, occupancy: 90, revenue: 7800 },
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

  const maxBookings = Math.max(...monthlyData.map(d => d.bookings));
  const maxOccupancy = 100;
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const performanceMetrics = [
    { label: 'Avg Occupancy Rate', value: '81.5%', change: '+4.2%', trend: 'up' },
    { label: 'Total Bookings (YTD)', value: '329', change: '+12.5%', trend: 'up' },
    { label: 'Avg Revenue/Night', value: '$6,450', change: '+8.3%', trend: 'up' },
    { label: 'Guest Satisfaction', value: '4.8/5', change: '+0.3', trend: 'up' },
  ];

  const topPerformers = [
    { name: 'Double Deluxe Room', revenue: 18500, bookings: 125 },
    { name: 'Single Standard Room', revenue: 14200, bookings: 142 },
    { name: 'Suite Premium', revenue: 16800, bookings: 84 },
    { name: 'Deluxe Suite', revenue: 15600, bookings: 78 },
  ];

  return (
    <StaffLayout activePage="reports" user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Year to Date</option>
            <option>Custom Range</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {performanceMetrics.map((metric, idx) => (
            <div key={idx} className="rounded-[24px] bg-white border border-slate-200 p-6">
              <p className="text-slate-600 text-sm font-medium">{metric.label}</p>
              <p className="text-3xl font-bold mt-2">{metric.value}</p>
              <p className={`text-sm mt-2 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4">Monthly Bookings Trend</h2>
            <div className="space-y-4">
              {monthlyData.map((data, idx) => {
                const percentage = (data.bookings / maxBookings) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{data.month}</span>
                      <span className="text-sm text-slate-600">{data.bookings} bookings</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4">Occupancy Rate Trend</h2>
            <div className="space-y-4">
              {monthlyData.map((data, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{data.month}</span>
                    <span className="text-sm text-slate-600">{data.occupancy}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${data.occupancy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-[24px] bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
            <div className="flex items-end justify-end gap-2 h-48">
              {monthlyData.map((data, idx) => {
                const percentage = (data.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs text-slate-600 mb-2">${data.revenue / 1000}K</span>
                    <div className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t" style={{ height: `${percentage * 1.5}px` }} />
                    <span className="text-xs font-medium mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] bg-white border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4">Top Performing Rooms</h2>
            <div className="space-y-4">
              {topPerformers.map((performer, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{performer.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{performer.bookings} bookings</p>
                    </div>
                    <p className="font-bold text-lg text-green-600">${performer.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}

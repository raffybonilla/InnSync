'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface StaffLayoutProps {
  children: ReactNode;
  activePage: 'dashboard' | 'reservation' | 'housekeeping' | 'rooms' | 'reports';
  user: any;
}

export default function StaffLayout({ children, activePage, user }: StaffLayoutProps) {
  const router = useRouter();

  const navigationItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/staff/dashboard' },
    { id: 'reservation', icon: '📅', label: 'Reservation', path: '/staff/reservation' },
    { id: 'housekeeping', icon: '🧹', label: 'House Keeping', path: '/staff/housekeeping' },
    { id: 'rooms', icon: '🛏️', label: 'Rooms', path: '/staff/rooms' },
    { id: 'reports', icon: '📈', label: 'Reports and Analytics', path: '/staff/reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/staff');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-56 bg-slate-800 text-white flex flex-col border-r border-slate-700 shadow-lg">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">Hotel System</h2>
          <p className="text-sm text-slate-400 mt-1">Staff Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${
                activePage === item.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <div className="px-4 py-3 rounded-lg bg-slate-700">
            <p className="text-sm font-medium truncate">{user?.fullName || 'Staff Member'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-slate-200 bg-white py-4 shadow-sm">
          <div className="px-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Staff Portal</p>
          </div>
        </header>

        <main className="flex-1 px-8 py-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

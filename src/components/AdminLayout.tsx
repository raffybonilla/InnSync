'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  activePage: 'dashboard' | 'users' | 'hotels' | 'promotions' | 'settings' | 'api' | 'maintenance';
  user: any;
}

export default function AdminLayout({ children, activePage, user }: AdminLayoutProps) {
  const router = useRouter();

  const navigationItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'users', icon: '👥', label: 'User Management', path: '/admin/users' },
    { id: 'hotels', icon: '🏨', label: 'Hotel & Room Management', path: '/admin/hotels' },
    { id: 'promotions', icon: '🎁', label: 'Promotions', path: '/admin/promotions' },
    { id: 'settings', icon: '⚙️', label: 'System Settings', path: '/admin/settings' },
    { id: 'api', icon: '🔌', label: 'API & Integration', path: '/admin/api' },
    { id: 'maintenance', icon: '🔧', label: 'Maintenance', path: '/admin/maintenance' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-lg fixed h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-slate-400 mt-1">Hotel Management System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition ${
                activePage === item.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-4 py-3 rounded-lg bg-slate-800">
            <p className="text-sm font-medium truncate">{user?.fullName || 'Admin User'}</p>
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

      <div className="flex-1 ml-64 flex flex-col">
        <header className="border-b border-slate-200 bg-white py-6 shadow-sm">
          <div className="px-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Management</p>
          </div>
        </header>

        <main className="flex-1 px-8 py-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

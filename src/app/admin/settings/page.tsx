'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function SystemSettings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AdminLayout activePage="settings" user={user}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-slate-500 mt-2">Configure system-wide settings and preferences</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Application Name</label>
                <input type="text" defaultValue="InnSync" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Support Email</label>
                <input type="email" defaultValue="support@innsync.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Support Phone</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
                </div>
                <input type="checkbox" className="h-5 w-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-slate-600">Auto-logout after inactivity</p>
                </div>
                <select className="px-3 py-2 border border-slate-200 rounded-lg">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">SMTP Server</label>
                <input type="text" defaultValue="smtp.gmail.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SMTP Port</label>
                <input type="number" defaultValue="587" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              Save Changes
            </button>
            <button className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

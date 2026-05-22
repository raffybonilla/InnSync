'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function APIIntegration() {
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
    <AdminLayout activePage="api" user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API & Integration</h1>
          <p className="text-slate-500 mt-2">Manage API keys and third-party integrations</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">API Keys</h2>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Production API Key</p>
                <p className="text-sm text-slate-600">sk_live_••••••••••••••••••••</p>
              </div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Copy</button>
            </div>
            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Sandbox API Key</p>
                <p className="text-sm text-slate-600">sk_test_••••••••••••••••••••</p>
              </div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Copy</button>
            </div>
          </div>
          <button className="mt-4 px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
            Generate New Key
          </button>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Integrations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Stripe Payment</p>
                  <p className="text-sm text-slate-600">Process payments securely</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Connected</span>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Slack Notifications</p>
                  <p className="text-sm text-slate-600">Get alerts on Slack</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Connected</span>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">SendGrid Email</p>
                  <p className="text-sm text-slate-600">Email delivery service</p>
                </div>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">Not Connected</span>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Google Analytics</p>
                  <p className="text-sm text-slate-600">Track user analytics</p>
                </div>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">Not Connected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">API Documentation</h2>
          <p className="text-slate-600 mb-4">Access comprehensive API documentation for developers.</p>
          <button className="px-6 py-2 rounded-full border border-slate-200 text-slate-900 text-sm font-semibold hover:bg-slate-50">
            View Documentation
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

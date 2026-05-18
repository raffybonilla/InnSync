'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabaseClient';

const allowedRoles = ['admin', 'manager'];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email || !password) {
        setError('Email and password are required.');
        return;
      }

      const supabase = createSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message || 'Login failed');
        return;
      }

      const role = data.user?.user_metadata?.role;
      if (!role || !allowedRoles.includes(role)) {
        setError('This account is not authorized for admin or manager access.');
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role,
        fullName: data.user.user_metadata?.full_name || '',
      }));

      router.push('/admin/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center bg-slate-900 text-white">
          <div className="mx-auto mb-4 h-16 w-16 rounded-3xl bg-slate-800 flex items-center justify-center">
            <span className="text-2xl">🏢</span>
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">INNSYNC</p>
          <h1 className="mt-3 text-3xl font-semibold">Admin / Manager Panel</h1>
          <p className="mt-2 text-slate-300">Enter your credentials to access the admin or manager dashboard.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="admin@hotel.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>
              Need staff login?{' '}
              <Link href="/auth/staff" className="font-semibold text-slate-900 hover:underline">
                Staff login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

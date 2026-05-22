'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'scheduled';
  created_at?: string;
}

export default function PromotionsManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percent: 10,
    start_date: '',
    end_date: '',
  });

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
    fetchPromotions();
  }, [router]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/promotions');
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.promotions || []);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          discount_percent: 10,
          start_date: '',
          end_date: '',
        });
        setShowForm(false);
        fetchPromotions();
      }
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPromotions = promotions.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.status === 'active').length,
    scheduled: promotions.filter((p) => p.status === 'scheduled').length,
  };

  if (loading) {
    return (
      <AdminLayout activePage="promotions" user={user}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading promotions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="promotions" user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions & Deals</h1>
            <p className="text-slate-500 mt-2">Manage special offers and promotions</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            + Add Promotion
          </button>
        </div>

        {/* Add Promotion Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Promotion</h2>
            <form onSubmit={handleAddPromotion} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Promotion Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
              ></textarea>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  max="100"
                  min="1"
                />
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Add Promotion
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Promotions</p>
            <p className="mt-3 text-3xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active</p>
            <p className="mt-3 text-3xl font-semibold">{stats.active}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Scheduled</p>
            <p className="mt-3 text-3xl font-semibold">{stats.scheduled}</p>
          </div>
        </div>

        {/* Search and Table */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">All Promotions</h2>
            <input
              type="text"
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {filteredPromotions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-lg">No promotions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Discount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Start Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">End Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{promo.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{promo.description?.substring(0, 50) || '—'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{promo.discount_percent}%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(promo.start_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(promo.end_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(promo.status || 'inactive')}`}>
                          {(promo.status || 'inactive').charAt(0).toUpperCase() + (promo.status || 'inactive').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-slate-600 hover:text-slate-900">⋯</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

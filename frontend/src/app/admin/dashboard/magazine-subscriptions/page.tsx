'use client';

import { useState, useEffect } from 'react';

export default function MagazineSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchSubscriptions = () => {
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/magazine-subscriptions/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSubscriptions(Array.isArray(data) ? data : (data?.results || []));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch subscriptions:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const toggleStatus = (item: any) => {
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/magazine-subscriptions/${item.id}/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ ...item, is_active: !item.is_active })
    }).then(res => {
      if (res.ok) fetchSubscriptions();
    });
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const executeDelete = () => {
    if (!deleteId) return;
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/magazine-subscriptions/${deleteId}/`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => {
        if (res.ok) fetchSubscriptions();
        setDeleteId(null);
      });
  };

  if (loading) return <div className="animate-pulse">Loading subscriptions...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Magazine Subscriptions</h2>
        <p className="text-gray-500 text-sm mt-1">Manage physical magazine subscriptions and addresses.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4">Subscriber Info</th>
              <th className="p-4">Address</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptions.map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="text-gray-800">{sub.name}</div>
                  <div className="text-sm text-gray-500">{sub.email}</div>
                  <div className="text-sm text-gray-500">{sub.phone}</div>
                </td>
                <td className="p-4 text-gray-600 text-sm whitespace-pre-wrap max-w-xs">{sub.address}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs  ${sub.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sub.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => toggleStatus(sub)} className="text-blue-600 hover:text-blue-800 text-sm">
                    Toggle Status
                  </button>
                  <button onClick={() => confirmDelete(sub.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No subscriptions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Subscription</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to permanently delete this subscription? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

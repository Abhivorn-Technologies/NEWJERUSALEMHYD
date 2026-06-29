'use client';

import { useState, useEffect } from 'react';

export default function MagazineSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = () => {
    fetch('http://127.0.0.1:8000/api/magazine-subscriptions/')
      .then(res => res.json())
      .then(data => {
        setSubscriptions(data);
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
    fetch(`http://127.0.0.1:8000/api/magazine-subscriptions/${item.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, is_active: !item.is_active })
    }).then(res => {
      if (res.ok) fetchSubscriptions();
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      fetch(`http://127.0.0.1:8000/api/magazine-subscriptions/${id}/`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) fetchSubscriptions();
        });
    }
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
              <th className="p-4 font-semibold">Subscriber Info</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscriptions.map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-medium text-gray-800">{sub.name}</div>
                  <div className="text-sm text-gray-500">{sub.email}</div>
                  <div className="text-sm text-gray-500">{sub.phone}</div>
                </td>
                <td className="p-4 text-gray-600 text-sm whitespace-pre-wrap max-w-xs">{sub.address}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sub.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => toggleStatus(sub)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Toggle Status
                  </button>
                  <button onClick={() => handleDelete(sub.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
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
    </div>
  );
}

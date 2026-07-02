'use client';

import { useState, useEffect } from 'react';

export default function PrayerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchRequests = () => {
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayer-requests/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRequests(Array.isArray(data) ? data : (data?.results || []));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch prayer requests:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const toggleReadStatus = (item: any) => {
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayer-requests/${item.id}/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ ...item, is_read: !item.is_read })
    }).then(res => {
      if (res.ok) fetchRequests();
    });
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const executeDelete = () => {
    if (!deleteId) return;
    const token = localStorage.getItem('admin_token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayer-requests/${deleteId}/`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => {
        if (res.ok) fetchRequests();
        setDeleteId(null);
      });
  };

  if (loading) return <div className="animate-pulse">Loading prayer requests...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Prayer Requests</h2>
        <p className="text-gray-500 text-sm mt-1">Manage incoming prayer requests from users.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Request</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map(req => (
              <tr key={req.id} className={`hover:bg-gray-50 transition ${!req.is_read ? 'bg-blue-50/30' : ''}`}>
                <td className="p-4 font-medium text-gray-800">
                  {req.name}
                  {!req.is_read && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                </td>
                <td className="p-4 text-gray-600">{req.phone || '-'}</td>
                <td className="p-4 text-gray-600 max-w-xs truncate" title={req.request_text}>{req.request_text}</td>
                <td className="p-4 text-gray-500 text-sm">{new Date(req.submitted_at).toLocaleDateString()}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => toggleReadStatus(req)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Mark {req.is_read ? 'Unread' : 'Read'}
                  </button>
                  <button onClick={() => confirmDelete(req.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No prayer requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Prayer Request</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to permanently delete this prayer request? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
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

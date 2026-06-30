'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function BeliefsManagement() {
  const [beliefs, setBeliefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    content: '',
    order: 0
  });

  const fetchItems = () => {
    const token = localStorage.getItem('admin_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Token ${token}`;
    
    fetch(`${BASE_URL}/beliefs/`, { headers })
      .then(res => res.json())
      .then(data => {
        setBeliefs(Array.isArray(data) ? data : (data?.results || []));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        icon: item.icon,
        title: item.title,
        content: item.content || '',
        order: item.order
      });
    } else {
      setEditingItem(null);
      setFormData({
        icon: '📖', title: '', content: '', order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return alert('Not logged in');

    const url = editingItem ? `${BASE_URL}/beliefs/${editingItem.id}/` : `${BASE_URL}/beliefs/`;
    const method = editingItem ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchItems();
    } else {
      alert('Failed to save belief. Check console for details.');
      console.error(await res.text());
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this belief?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${BASE_URL}/beliefs/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    if (res.ok) {
      fetchItems();
    } else {
      alert('Failed to delete belief.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">What We Believe</h1>
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Add New Belief
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : beliefs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No beliefs found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase">
                <th className="py-3 px-6 font-semibold">Icon</th>
                <th className="py-3 px-6 font-semibold">Title</th>
                <th className="py-3 px-6 font-semibold">Order</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {beliefs.map(item => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-2xl">{item.icon}</td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{item.title}</td>
                  <td className="py-4 px-6 text-gray-500">{item.order}</td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:underline text-sm font-medium mr-4">Edit</button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Belief' : 'Add New Belief'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">&times; Close</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <input required type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none text-2xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input required type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Text (No HTML needed)</label>
                <textarea required rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none"></textarea>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Belief</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

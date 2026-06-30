'use client';
import { useState, useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function NavMenuManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    order: 0,
    is_active: true,
    parent: '' as number | ''
  });

  const fetchItems = () => {
    const token = localStorage.getItem('admin_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Token ${token}`;
    
    fetch(`${BASE_URL}/nav-menu/`, { headers })
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item: any = null, parentId: number | '' = '') => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        url: item.url,
        order: item.order,
        is_active: item.is_active,
        parent: item.parent || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '', url: '', order: 0, is_active: true, parent: parentId
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return alert('Not logged in');

    const url = editingItem ? `${BASE_URL}/nav-menu/${editingItem.id}/` : `${BASE_URL}/nav-menu/`;
    const method = editingItem ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      parent: formData.parent === '' ? null : formData.parent
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchItems();
    } else {
      alert('Failed to save menu item. Check console for details.');
      console.error(await res.text());
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${BASE_URL}/nav-menu/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    if (res.ok) {
      fetchItems();
    } else {
      alert('Failed to delete item.');
    }
  };

  // Flatten tree for table rendering
  const renderRows = () => {
    const rows: JSX.Element[] = [];
    
    items.forEach(topItem => {
      // Top level row
      rows.push(
        <tr key={topItem.id} className="border-b border-gray-100 hover:bg-gray-50 transition bg-white">
          <td className="py-4 px-6 text-gray-900 font-bold">{topItem.label}</td>
          <td className="py-4 px-6 text-gray-500 font-mono text-sm">{topItem.url}</td>
          <td className="py-4 px-6 text-gray-500">{topItem.order}</td>
          <td className="py-4 px-6">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${topItem.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {topItem.is_active ? 'Active' : 'Hidden'}
            </span>
          </td>
          <td className="py-4 px-6 text-right">
            <button onClick={() => openModal(null, topItem.id)} className="text-green-600 hover:underline text-sm font-medium mr-4">+ Add Sub-link</button>
            <button onClick={() => openModal(topItem)} className="text-blue-600 hover:underline text-sm font-medium mr-4">Edit</button>
            <button onClick={() => handleDelete(topItem.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
          </td>
        </tr>
      );

      // Child rows
      if (topItem.children && topItem.children.length > 0) {
        topItem.children.forEach((child: any) => {
          rows.push(
            <tr key={`child-${child.id}`} className="border-b border-gray-100 hover:bg-gray-50 transition bg-gray-50/50">
              <td className="py-3 px-6 text-gray-700 flex items-center gap-2">
                <span className="text-gray-300 ml-4">└─</span> {child.label}
              </td>
              <td className="py-3 px-6 text-gray-500 font-mono text-sm">{child.url}</td>
              <td className="py-3 px-6 text-gray-500">{child.order}</td>
              <td className="py-3 px-6">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${child.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                  {child.is_active ? 'Active' : 'Hidden'}
                </span>
              </td>
              <td className="py-3 px-6 text-right">
                <button onClick={() => openModal(child)} className="text-blue-600 hover:underline text-sm font-medium mr-4">Edit</button>
                <button onClick={() => handleDelete(child.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
              </td>
            </tr>
          );
        });
      }
    });

    return rows;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Navigation Menu</h1>
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Add Top-Level Link
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No menu items found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase">
                <th className="py-3 px-6 font-semibold">Label</th>
                <th className="py-3 px-6 font-semibold">URL / Path</th>
                <th className="py-3 px-6 font-semibold w-24">Order</th>
                <th className="py-3 px-6 font-semibold w-24">Status</th>
                <th className="py-3 px-6 font-semibold text-right w-[280px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderRows()}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {formData.parent !== '' && (
                 <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4 border border-blue-100">
                   You are adding/editing a sub-link under a parent menu item.
                 </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" placeholder="e.g. About Us" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input required type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Path</label>
                <input required type="text" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none font-mono text-sm" placeholder="e.g. /about or https://google.com" />
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Show on website</label>
              </div>
              
              <div className="pt-4 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

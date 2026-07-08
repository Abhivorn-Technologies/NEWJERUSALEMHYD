'use client';
import { useState, useEffect } from 'react';
import ConfirmModal from '../../../../../components/admin/ConfirmModal';
import AlertModal from '../../../../../components/admin/AlertModal';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', is_active: true });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });

  const fetchCategories = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`)
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : (data?.results || []));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: any) => {
    setIsEditing(true);
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug, is_active: category.is_active });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', slug: '', is_active: true });
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const executeDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${deleteId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    
    if (res.ok) {
      setCategories(categories.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } else {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to delete category.', type: 'error' });
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return setAlertConfig({ isOpen: true, title: 'Error', message: 'Not logged in', type: 'error' });

    const url = isEditing ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingId}/` : `${process.env.NEXT_PUBLIC_API_URL}/categories/`;
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      handleCancel();
      fetchCategories();
      setAlertConfig({ isOpen: true, title: 'Success', message: 'Category saved successfully!', type: 'success' });
    } else {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to save category. Check console for details.', type: 'error' });
      console.error(await res.text());
    }
  };

  return (
    <div>
      <div className="bg-white rounded-[24px] px-8 py-5 flex items-center justify-between mb-6 shadow-sm border border-gray-100">
        <h1 className="text-[24px] font-bold text-[#1a3845]">Manage Categories</h1>
      </div>

      <div className="space-y-6">
        
        {/* Top Col: Form */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] font-extrabold text-[#1a3845]">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </h2>
            <button 
              type="button" 
              onClick={() => setAlertConfig({ isOpen: true, title: 'Info', message: 'Auto assignment logic is not yet implemented on the backend.', type: 'info' })}
              className="px-5 py-2 bg-[#e8f3f4] text-[#128a95] rounded-full text-[14px] hover:bg-[#d1eaeb] transition"
            >
              Auto Assign Songs
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[15px] text-gray-600 mb-2">Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-[12px] focus:border-[#128a95] focus:ring-1 focus:ring-[#128a95] outline-none transition text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-[15px] text-gray-600 mb-2">Slug</label>
                <input 
                  required 
                  type="text" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-[12px] focus:border-[#128a95] focus:ring-1 focus:ring-[#128a95] outline-none transition text-gray-900" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[15px] text-gray-600 mb-4">Active</label>
              <div className="ml-[5px]">
                <input 
                  type="checkbox" 
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                  className="w-4 h-4 accent-[#007bff] cursor-pointer rounded-sm" 
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button type="submit" className="px-8 py-3 bg-[#007b83] text-white rounded-full shadow-[0_4px_10px_rgba(0,123,131,0.2)] hover:bg-[#00656c] transition">
                {isEditing ? 'Save Changes' : 'Save Category'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel} className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bottom Col: Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading categories...</div>
          ) : (
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[12px] uppercase tracking-wider bg-white">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Songs</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition bg-white">
                    <td className="py-4 px-6 text-[#1a3845]">{cat.name}</td>
                    <td className="py-4 px-6 text-gray-500">{cat.slug}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[12px]  ${cat.is_active ? 'bg-[#e8f3f4] text-[#128a95]' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-center">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{cat.song_count || 0}</span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button onClick={() => handleEdit(cat)} className="px-4 py-2 bg-[#e8f3f4] text-[#128a95] rounded-full text-[13px] hover:bg-[#d1eaeb] transition">Edit</button>
                      <button onClick={() => confirmDelete(cat.id)} className="px-4 py-2 bg-[#fef2f2] text-[#ef4444] rounded-full text-[13px] hover:bg-[#fee2e2] transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && categories.length === 0 && (
            <div className="p-8 text-center text-gray-500">No categories found. Add one above.</div>
          )}
        </div>

      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to permanently delete this category? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />

      <AlertModal 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

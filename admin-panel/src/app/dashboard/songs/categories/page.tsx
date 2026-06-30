'use client';
import { useState, useEffect } from 'react';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', is_active: true });

  const fetchCategories = () => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    
    if (res.ok) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert('Failed to delete category.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return alert('Not logged in');

    const url = isEditing ? `http://127.0.0.1:8000/api/categories/${editingId}/` : 'http://127.0.0.1:8000/api/categories/';
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
    } else {
      alert('Failed to save category. Check console for details.');
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
            <button type="button" className="px-5 py-2 bg-[#e8f3f4] text-[#128a95] rounded-full text-[14px] font-bold hover:bg-[#d1eaeb] transition">
              Auto Assign Songs
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[15px] font-medium text-gray-600 mb-2">Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-[12px] focus:border-[#128a95] focus:ring-1 focus:ring-[#128a95] outline-none transition text-gray-900" 
                />
              </div>
              <div>
                <label className="block text-[15px] font-medium text-gray-600 mb-2">Slug</label>
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
              <label className="block text-[15px] font-medium text-gray-600 mb-4">Active</label>
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
              <button type="submit" className="px-8 py-3 bg-[#007b83] text-white rounded-full font-semibold shadow-[0_4px_10px_rgba(0,123,131,0.2)] hover:bg-[#00656c] transition">
                {isEditing ? 'Save Changes' : 'Save Category'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancel} className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bottom Col: Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Loading categories...</div>
          ) : (
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[12px] font-bold uppercase tracking-wider bg-white">
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
                    <td className="py-4 px-6 font-bold text-[#1a3845]">{cat.name}</td>
                    <td className="py-4 px-6 text-gray-500">{cat.slug}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${cat.is_active ? 'bg-[#e8f3f4] text-[#128a95]' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-700 text-center">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{cat.song_count || 0}</span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button onClick={() => handleEdit(cat)} className="px-4 py-2 bg-[#e8f3f4] text-[#128a95] rounded-full text-[13px] font-bold hover:bg-[#d1eaeb] transition">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} className="px-4 py-2 bg-[#fef2f2] text-[#ef4444] rounded-full text-[13px] font-bold hover:bg-[#fee2e2] transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && categories.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-medium">No categories found. Add one above.</div>
          )}
        </div>

      </div>
    </div>
  );
}

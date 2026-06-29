'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContentItemsPageInner() {
  const searchParams = useSearchParams();
  const sectionQuery = searchParams.get('section') || 'all';

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const initialFormState = {
    id: null,
    title: '',
    section: sectionQuery !== 'all' ? sectionQuery : 'Old Testament',
    link: '',
    second_link: '',
    is_active: true
  };
  
  const [formData, setFormData] = useState<any>(initialFormState);

  const fetchItems = () => {
    setLoading(true);
    let url = 'http://127.0.0.1:8000/api/content-items/';
    if (sectionQuery !== 'all') {
      url += `?section=${encodeURIComponent(sectionQuery)}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch items:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [sectionQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id 
      ? `http://127.0.0.1:8000/api/content-items/${formData.id}/`
      : 'http://127.0.0.1:8000/api/content-items/';
    
    const method = formData.id ? 'PUT' : 'POST';
    
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (res.ok) {
        setIsModalOpen(false);
        fetchItems();
      } else {
        alert('Failed to save item');
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      fetch(`http://127.0.0.1:8000/api/content-items/${id}/`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) fetchItems();
        });
    }
  };

  const openAddModal = () => {
    setFormData({ ...initialFormState, section: sectionQuery !== 'all' ? sectionQuery : 'Old Testament' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const SECTION_CHOICES = [
    'Infographics', 'Maps', 'Resource Stories', 'Downloads', 'Genealogies',
    'Missionary Stories', 'Old Testament', 'New Testament', 'Topical', 
    'Biographical', 'Pre School', 'Coloring', 'Puzzles', 'Quizzes'
  ];

  if (loading) return <div className="animate-pulse">Loading items...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {sectionQuery !== 'all' ? `${sectionQuery}` : 'All Content Items'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage content links and sections.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Section</th>
              <th className="p-4 font-semibold">Links</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{item.title}</td>
                <td className="p-4 text-gray-600">{item.section}</td>
                <td className="p-4 text-blue-600 space-y-1">
                  {item.link && <a href={item.link} target="_blank" className="block hover:underline truncate max-w-[200px] text-sm">Link 1</a>}
                  {item.second_link && <a href={item.second_link} target="_blank" className="block hover:underline truncate max-w-[200px] text-sm">Link 2</a>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No items found for this section.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Item' : 'Add Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="itemForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select required value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                    {SECTION_CHOICES.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Link (URL or Path)</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Link (Optional)</label>
                  <input type="text" value={formData.second_link} onChange={e => setFormData({...formData, second_link: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="https://..." />
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (Visible on site)</label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition">Cancel</button>
              <button type="submit" form="itemForm" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm">Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentItemsPage() {
  return (
    <Suspense fallback={<div>Loading content...</div>}>
      <ContentItemsPageInner />
    </Suspense>
  )
}

'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Plus, Trash2, Eye } from 'lucide-react';

export default function MissionaryStoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '', // Stored in section
    image_url: '',
    cover_image: null as File | null,
    file_url: '',
    file_upload: null as File | null,
    is_active: true
  });

  const fetchItems = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/content-items/?page_category=Missionary+Stories')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ 
      title: '', 
      subtitle: '',
      image_url: '',
      cover_image: null,
      file_url: '', 
      file_upload: null,
      is_active: true 
    });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(true);
    setEditId(item.id);
    let fileUrl = '';
    if (item.links && Array.isArray(item.links) && item.links.length > 0) {
      fileUrl = item.links[0].url;
    }
    setFormData({
      title: item.title,
      subtitle: item.section === 'Stories' ? '' : item.section, // Use section as subtitle
      image_url: item.image_url || '',
      cover_image: null,
      file_url: fileUrl,
      file_upload: null,
      is_active: item.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this story?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/content-items/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    if (res.ok) {
      fetchItems();
    }
  };

  const handleToggleStatus = async (item: any) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/content-items/${item.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ is_active: !item.is_active })
    });
    if (res.ok) {
      fetchItems();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const url = isEditing ? `http://127.0.0.1:8000/api/content-items/${editId}/` : 'http://127.0.0.1:8000/api/content-items/';
    const method = isEditing ? 'PUT' : 'POST';

    const links = formData.file_url ? [{ text: 'PDF', url: formData.file_url }] : [];

    let bodyData: any;
    let headers: any = {
      'Authorization': `Token ${token}`
    };

    if (formData.cover_image) {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('page_category', 'Missionary Stories');
      data.append('section', formData.subtitle || 'Stories');
      data.append('image_url', formData.image_url);
      data.append('is_active', String(formData.is_active));
      data.append('cover_image', formData.cover_image);
      data.append('links', JSON.stringify(links));
      bodyData = data;
    } else {
      headers['Content-Type'] = 'application/json';
      bodyData = JSON.stringify({
        title: formData.title,
        page_category: 'Missionary Stories',
        section: formData.subtitle || 'Stories',
        image_url: formData.image_url,
        is_active: formData.is_active,
        links: links
      });
    }

    const res = await fetch(url, {
      method,
      headers,
      body: bodyData
    });

    if (res.ok) {
      setShowModal(false);
      fetchItems();
    } else {
      const errorData = await res.json();
      console.error('Submit failed:', errorData);
      alert('Error submitting form: ' + JSON.stringify(errorData));
    }
  };

  const filteredItems = items.filter(item => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[24px] shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[26px] font-bold text-[#1a3845]">Manage Missionary Stories</h2>
          <button onClick={openAddModal} className="px-6 py-2.5 bg-[#007B83] text-white rounded-full font-semibold shadow-md hover:bg-[#00636a] transition">
            Add Story
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Search stories" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-2.5 pl-4 bg-white border border-gray-200 rounded-full focus:border-[#007B83] outline-none text-[15px] text-gray-900 placeholder:text-gray-400" 
            />
          </div>
          <button className="px-6 py-2.5 bg-[#f0f7f7] text-[#007B83] rounded-full font-semibold hover:bg-[#e0f0f0] transition">
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Story</th>
                <th className="py-4 px-4 text-center">Image</th>
                <th className="py-4 px-4 text-center">File</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No stories found.</td></tr>
              ) : (
                filteredItems.map(item => {
                  const hasImage = !!item.image_url || !!item.cover_image;
                  const hasFile = item.links && item.links.length > 0 && !!item.links[0].url;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1a3845] text-[15px]">{item.title}</div>
                        {item.section && item.section !== 'Stories' && (
                          <div className="text-gray-500 text-[12px]">{item.section}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[12px] px-3 py-1 rounded-full font-bold ${hasImage ? 'bg-[#e6f4f1] text-[#007B83]' : 'bg-red-50 text-red-500'}`}>
                          {hasImage ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[12px] px-3 py-1 rounded-full font-bold ${hasFile ? 'bg-[#e6f4f1] text-[#007B83]' : 'bg-red-50 text-red-500'}`}>
                          {hasFile ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-[12px] font-bold ${item.is_active ? 'text-[#007B83]' : 'text-red-500'}`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button className="px-4 py-1.5 bg-[#e6f4f1] text-[#007B83] rounded-full text-[13px] font-bold hover:bg-[#cde9e3] transition">
                          View
                        </button>
                        <button onClick={() => openEditModal(item)} className="px-4 py-1.5 bg-[#007B83] text-white rounded-full text-[13px] font-bold hover:bg-[#00636a] transition">
                          Edit
                        </button>
                        <button onClick={() => handleToggleStatus(item)} className="px-4 py-1.5 bg-[#f0f7f7] text-[#007B83] rounded-full text-[13px] font-bold hover:bg-[#e0f0f0] transition">
                          {item.is_active ? 'Inactive' : 'Active'}
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="px-4 py-1.5 bg-[#b22222] text-white rounded-full text-[13px] font-bold hover:bg-[#8e1b1b] transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-[#1a3845]">{isEditing ? 'Edit Story' : 'Add Story'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Story Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#007B83] outline-none transition text-gray-900 font-medium" />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Subtitle (Optional)</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#007B83] outline-none transition text-gray-900 font-medium" />
              </div>
              
              <div>
                <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Image URL</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#007B83] outline-none transition text-gray-900 font-medium mb-2" />
                <label className="px-4 py-2 bg-white border border-[#007B83] text-[#007B83] rounded-full font-bold cursor-pointer hover:bg-[#f0f7f7] transition text-[12px] inline-block">
                  Upload Cover Image
                  <input type="file" className="hidden" accept="image/*" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({...formData, cover_image: e.target.files[0]});
                    }
                  }}/>
                </label>
                {formData.cover_image && <span className="ml-3 text-xs text-gray-600">{formData.cover_image.name}</span>}
              </div>

              <div>
                <label className="block text-[14px] font-bold text-gray-700 mb-1.5">File/Document URL</label>
                <input type="text" value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#007B83] outline-none transition text-gray-900 font-medium mb-2" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[16px] border border-gray-100">
                <span className="text-[14px] font-bold text-gray-800">Set as Active</span>
                <button type="button" onClick={() => setFormData({...formData, is_active: !formData.is_active})} className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_active ? 'bg-[#007B83]' : 'bg-gray-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white pb-2 border-t border-gray-100 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-[#007B83] text-white rounded-full font-bold shadow-md hover:bg-[#00636a] transition">{isEditing ? 'Save Changes' : 'Add Story'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

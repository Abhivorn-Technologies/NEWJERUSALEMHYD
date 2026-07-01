'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Plus, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import ConfirmModal from '../../../components/ConfirmModal';
import AlertModal from '../../../components/AlertModal';

const PAGE_SECTIONS_MAP: Record<string, string[]> = {
  'Bible Infographics': [
    'General Overview & Sites',
    'The Tabernacle & Temples',
    'Ancient Houses & Structures',
    'Ancient Altars & Furnishings',
    'Biblical Ships & Chariots',
    'Archaeological Inscriptions',
    'Ancient Seals & Bowls',
    'Coins & Weights',
    'Biblical Timelines'
  ],
  'Bible Maps': [
    'Old Testament Maps',
    'New Testament Maps',
    'Maps Corresponding to Books of the Bible'
  ],
  'Bible Genealogies': [
    'General Overview & Diagrams',
    'Patriarchal Family Trees',
    'Tribal & Census Records',
    "Israel's United Kingdom & Kings",
    'Divided Kingdom & Later Prophets',
    'New Testament & Apostolic Era'
  ],
  'Missionary Stories': [
    'Stories'
  ],
  'Bible Downloads': [
    'Software',
    'Presentations',
    'Other'
  ]
};

const PAGE_OPTIONS = Object.keys(PAGE_SECTIONS_MAP);

export default function BibleResourcesPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeChip, setActiveChip] = useState(categoryParam || 'All Pages');
  const [search, setSearch] = useState('');
  const [filterPage, setFilterPage] = useState(categoryParam || 'All Pages');
  const [filterStatus, setFilterStatus] = useState('All Status');

  useEffect(() => {
    if (categoryParam) {
      setActiveChip(categoryParam);
      setFilterPage(categoryParam);
    }
  }, [categoryParam]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });
  const [formData, setFormData] = useState({
    title: '',
    page_category: 'Bible Maps',
    section: 'Old Testament Maps',
    image_url: '',
    cover_image: null as File | null,
    links: [{ text: '', url: '' }],
    is_active: true
  });

  const fetchItems = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/content-items/')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : (data?.results || []));
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

  const handlePageChange = (newPage: string) => {
    const firstSection = PAGE_SECTIONS_MAP[newPage]?.[0] || '';
    setFormData({ ...formData, page_category: newPage, section: firstSection });
  };

  const addLinkField = () => {
    setFormData({ ...formData, links: [...formData.links, { text: '', url: '' }] });
  };

  const removeLinkField = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ 
      title: '', 
      page_category: 'Bible Maps', 
      section: 'Old Testament Maps', 
      image_url: '',
      cover_image: null,
      links: [{ text: '', url: '' }], 
      is_active: true 
    });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(true);
    setEditId(item.id);
    let parsedLinks = [{ text: '', url: '' }];
    if (item.links && Array.isArray(item.links) && item.links.length > 0) {
      parsedLinks = item.links;
    }
    setFormData({
      title: item.title,
      page_category: item.page_category || 'Bible Maps',
      section: item.section || '',
      image_url: item.image_url || '',
      cover_image: null,
      links: parsedLinks,
      is_active: item.is_active
    });
    setShowModal(true);
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const executeDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/content-items/${deleteId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    if (res.ok) {
      fetchItems();
      setDeleteId(null);
    } else {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to delete resource.', type: 'error' });
      setDeleteId(null);
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

    const validLinks = formData.links.filter(l => l.text.trim() || l.url.trim());

    let bodyData: any;
    let headers: any = {
      'Authorization': `Token ${token}`
    };

    if (formData.cover_image) {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('page_category', formData.page_category);
      data.append('section', formData.section);
      data.append('image_url', formData.image_url);
      data.append('is_active', String(formData.is_active));
      data.append('cover_image', formData.cover_image);
      // Send links as JSON string so DRF can parse it
      data.append('links', JSON.stringify(validLinks));
      
      bodyData = data;
    } else {
      headers['Content-Type'] = 'application/json';
      bodyData = JSON.stringify({
        title: formData.title,
        page_category: formData.page_category,
        section: formData.section,
        image_url: formData.image_url,
        is_active: formData.is_active,
        links: validLinks
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
      setAlertConfig({ isOpen: true, title: 'Success', message: 'Resource saved successfully!', type: 'success' });
    } else {
      const errorData = await res.json();
      console.error('Submit failed:', errorData);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Error submitting form', type: 'error' });
    }
  };

  // Filtering Logic
  const filteredItems = items.filter(item => {
    if (activeChip !== 'All Pages' && item.page_category !== activeChip) return false;
    if (filterPage !== 'All Pages' && item.page_category !== filterPage) return false;
    if (filterStatus === 'Active' && !item.is_active) return false;
    if (filterStatus === 'Inactive' && item.is_active) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-[24px] px-8 py-5 flex items-center justify-between shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <h1 className="text-[28px] font-extrabold text-[#1a3845]">Bible Resources</h1>
        </div>
        <div className="text-[#D04A73] font-semibold text-sm cursor-pointer hover:underline">
          admin
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[22px] font-extrabold text-[#1a3845]">Manage Resource Cards</h2>
          <button onClick={openAddModal} className="px-6 py-2.5 bg-[#4D1C2C] text-white rounded-full font-semibold shadow-md hover:bg-[#3a1521] transition">
            Add Resource
          </button>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['All Pages', ...PAGE_OPTIONS].map(chip => (
            <button
              key={chip}
              onClick={() => { setActiveChip(chip); setFilterPage('All Pages'); }}
              className={`px-5 py-2 rounded-full text-[14px] font-bold transition ${
                activeChip === chip 
                  ? 'bg-[#D04A73] text-white' 
                  : 'bg-[#FADADD]/30 text-[#4D1C2C] hover:bg-[#FADADD]/60'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder="Search resources" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-2.5 pl-4 bg-white border border-gray-200 rounded-full focus:border-[#D04A73] outline-none text-[15px] text-gray-900 placeholder:text-gray-400" 
            />
          </div>
          <div className="w-[200px]">
            <select 
              value={filterPage} 
              onChange={e => { setFilterPage(e.target.value); setActiveChip('All Pages'); }}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-full outline-none text-[15px] text-gray-900"
            >
              <option value="All Pages">All Pages</option>
              {PAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="w-[180px]">
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-full outline-none text-[15px] text-gray-900"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-[12px] font-bold uppercase tracking-wider">
                <th className="py-4 px-2">Resource</th>
                <th className="py-4 px-2">Page</th>
                <th className="py-4 px-2">Section</th>
                <th className="py-4 px-2">Links/Image</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No resources found.</td></tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-2 font-bold text-[#1a3845]">{item.title}</td>
                    <td className="py-4 px-2 text-gray-600">{item.page_category || '-'}</td>
                    <td className="py-4 px-2 text-gray-600">{item.section}</td>
                    <td className="py-4 px-2 text-gray-600">
                      {item.links && Array.isArray(item.links) && item.links.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.links.map((l: any, i: number) => (
                            <span key={i} className="text-[11px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold border border-gray-200">
                              {l.text}
                            </span>
                          ))}
                        </div>
                      )}
                      {(item.image_url || item.cover_image) && <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold border border-blue-100 inline-block mt-1">Image</span>}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`text-[13px] font-bold ${item.is_active ? 'text-[#D04A73]' : 'text-gray-400'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-2 flex flex-wrap gap-2">
                      <button onClick={() => openEditModal(item)} className="px-4 py-1.5 bg-[#4D1C2C] text-white rounded-full text-[13px] font-bold hover:bg-[#3a1521] transition">Edit</button>
                      <button onClick={() => handleToggleStatus(item)} className="px-4 py-1.5 bg-[#FADADD]/30 text-[#4D1C2C] rounded-full text-[13px] font-bold hover:bg-[#FADADD]/60 transition">
                        {item.is_active ? 'Inactive' : 'Active'}
                      </button>
                      <button onClick={() => confirmDelete(item.id)} className="px-4 py-1.5 bg-[#b22222] text-white rounded-full text-[13px] font-bold hover:bg-[#8e1b1b] transition">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-[#1a3845]">{isEditing ? 'Edit Resource' : 'Add Resource'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Resource Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#D04A73] outline-none transition text-gray-900 font-medium" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Page Category</label>
                  <select value={formData.page_category} onChange={e => handlePageChange(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#D04A73] outline-none transition text-gray-900 font-medium">
                    {PAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Section</label>
                  <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#D04A73] outline-none transition text-gray-900 font-medium">
                    {(PAGE_SECTIONS_MAP[formData.page_category] || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Cover Image URL (Optional)</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="/wp-content/uploads/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#D04A73] outline-none transition text-gray-900 font-medium mb-3" />
                
                <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Or Upload Direct Cover Image</label>
                <div className="flex items-center gap-4">
                  <label className="px-5 py-2.5 bg-white border border-[#D04A73] text-[#D04A73] rounded-full font-bold cursor-pointer hover:bg-[#FADADD]/30 transition text-[13px]">
                    Choose File
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({...formData, cover_image: e.target.files[0]});
                        }
                      }}
                    />
                  </label>
                  {formData.cover_image && <span className="text-[13px] font-bold text-gray-600">{formData.cover_image.name}</span>}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-[16px] border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-[14px] font-bold text-gray-800">Resource Links</label>
                  <button type="button" onClick={addLinkField} className="flex items-center gap-1 text-[13px] font-bold text-[#D04A73] bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:bg-[#FADADD]/20 transition">
                    <Plus size={14} /> Add Link
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input 
                        type="text" 
                        placeholder="Label (e.g. PDF)" 
                        value={link.text} 
                        onChange={e => updateLink(index, 'text', e.target.value)} 
                        className="w-1/3 p-2.5 bg-white border border-gray-200 rounded-[8px] focus:border-[#D04A73] outline-none text-sm font-bold text-gray-900" 
                      />
                      <input 
                        type="text" 
                        placeholder="File URL" 
                        value={link.url} 
                        onChange={e => updateLink(index, 'url', e.target.value)} 
                        className="flex-1 p-2.5 bg-white border border-gray-200 rounded-[8px] focus:border-[#D04A73] outline-none text-sm text-gray-900" 
                      />
                      {formData.links.length > 1 && (
                        <button type="button" onClick={() => removeLinkField(index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[8px] transition">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[12px] text-gray-500 font-medium mt-3">Add multiple links like PDF, JPEG, Color, or Black & White.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[16px] border border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_active ? 'bg-[#D04A73]' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                  <span className="text-[15px] font-bold text-gray-800">Set as Active</span>
                </div>
                <span className="text-[12px] text-gray-500 font-medium">Inactive resources will be hidden from the website.</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6 sticky bottom-0 bg-white pb-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-2.5 bg-[#4D1C2C] text-white rounded-full font-bold shadow-md hover:bg-[#3a1521] transition">
                  {isEditing ? 'Save Changes' : 'Add Resource'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Resource"
        message="Are you sure you want to permanently delete this resource? This action cannot be undone."
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

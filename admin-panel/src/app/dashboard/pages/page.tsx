'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function PagesManagement() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: true
  });

  const fetchPages = () => {
    const token = localStorage.getItem('admin_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Token ${token}`;
    
    fetch('http://127.0.0.1:8000/api/pages/', { headers })
      .then(res => res.json())
      .then(data => {
        setPages(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openModal = (page: any = null) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content || '',
        meta_description: page.meta_description || '',
        is_published: page.is_published
      });
    } else {
      setEditingPage(null);
      setFormData({
        title: '', slug: '', content: '', meta_description: '', is_published: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return alert('Not logged in');

    const url = editingPage ? `http://127.0.0.1:8000/api/pages/${editingPage.slug}/` : 'http://127.0.0.1:8000/api/pages/';
    const method = editingPage ? 'PUT' : 'POST';

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
      fetchPages();
    } else {
      alert('Failed to save page. Check console for details.');
      console.error(await res.text());
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/pages/${slug}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    if (res.ok) {
      fetchPages();
    } else {
      alert('Failed to delete page.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Static Pages</h1>
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Add New Page
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8 shadow-sm">
        <h3 className="font-semibold text-blue-800 text-sm mb-1">💡 How do pages work?</h3>
        <p className="text-sm text-blue-700">
          The <strong>Slug</strong> determines where this content appears on your website. 
          For example, a page with the slug <code className="bg-white px-1 py-0.5 rounded text-blue-900">about</code> will automatically replace the introductory text at the top of the <strong>About Us</strong> page!
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pages found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase">
                <th className="py-3 px-6 font-semibold">Title</th>
                <th className="py-3 px-6 font-semibold">Slug (URL)</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-900 font-medium">{page.title}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm font-mono">/{page.slug}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${page.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {page.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => openModal(page)} className="text-blue-600 hover:underline text-sm font-medium mr-4">Edit</button>
                    <button 
                      onClick={() => handleDelete(page.slug)}
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
          <div className="w-full max-w-3xl bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{editingPage ? 'Edit Page' : 'Add New Page'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">&times; Close</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL Path)</label>
                  <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
                <textarea rows={2} value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Content (HTML/Text)</label>
                <div className="bg-white">
                  <ReactQuill theme="snow" value={formData.content} onChange={val => setFormData({...formData, content: val})} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published_page" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
                <label htmlFor="published_page" className="text-sm font-medium text-gray-700">Published</label>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Page</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

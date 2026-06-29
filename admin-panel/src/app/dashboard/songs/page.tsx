'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ManageSongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    language: 'telugu',
    first_letter: '',
    telugu_lyrics: '',
    hindi_lyrics: '',
    english_lyrics: '',
    is_published: true
  });

  const fetchSongs = () => {
    const token = localStorage.getItem('admin_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Token ${token}`;
    
    fetch('http://127.0.0.1:8000/api/songs/', { headers })
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const openModal = (song: any = null) => {
    if (song) {
      setEditingSong(song);
      setFormData({
        title: song.title,
        slug: song.slug,
        language: song.language,
        first_letter: song.first_letter,
        telugu_lyrics: song.telugu_lyrics || '',
        hindi_lyrics: song.hindi_lyrics || '',
        english_lyrics: song.english_lyrics || '',
        is_published: song.is_published
      });
    } else {
      setEditingSong(null);
      setFormData({
        title: '', slug: '', language: 'telugu', first_letter: '',
        telugu_lyrics: '', hindi_lyrics: '', english_lyrics: '', is_published: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return alert('Not logged in');

    const url = editingSong ? `http://127.0.0.1:8000/api/songs/${editingSong.id}/` : 'http://127.0.0.1:8000/api/songs/';
    const method = editingSong ? 'PUT' : 'POST';

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
      fetchSongs();
    } else {
      alert('Failed to save song. Check console for details.');
      console.error(await res.text());
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/songs/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    });
    if (res.ok) {
      setSongs(songs.filter(s => s.id !== id));
    } else {
      alert('Failed to delete song.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Songs</h1>
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          + Add New Song
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
          <input type="text" placeholder="Search songs..." className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500" />
          <select className="p-2 border border-gray-300 rounded-lg outline-none bg-white">
            <option value="">All Languages</option>
            <option value="telugu">Telugu</option>
            <option value="sunday_telugu">Sunday School Telugu</option>
            <option value="sunday_hindi">Sunday School Hindi</option>
            <option value="sunday_english">Sunday School English</option>
          </select>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading songs...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase">
                <th className="py-3 px-6 font-semibold">Title</th>
                <th className="py-3 px-6 font-semibold">Language</th>
                <th className="py-3 px-6 font-semibold">Letter</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.slice(0, 100).map(song => (
                <tr key={song.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-900 font-medium">{song.title}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{song.language}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-bold">{song.first_letter}</td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => openModal(song)} className="text-blue-600 hover:underline text-sm font-medium mr-4">Edit</button>
                    <button 
                      onClick={() => handleDelete(song.id)}
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
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{editingSong ? 'Edit Song' : 'Add New Song'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">&times; Close</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                  <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none bg-white">
                    <option value="telugu">Telugu</option>
                    <option value="sunday_telugu">Sunday School Telugu</option>
                    <option value="sunday_hindi">Sunday School Hindi</option>
                    <option value="sunday_english">Sunday School English</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Letter (Index)</label>
                <input required type="text" value={formData.first_letter} onChange={e => setFormData({...formData, first_letter: e.target.value})} className="w-full p-2 border rounded-lg focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telugu Lyrics</label>
                <div className="bg-white">
                  <ReactQuill theme="snow" value={formData.telugu_lyrics} onChange={val => setFormData({...formData, telugu_lyrics: val})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Lyrics</label>
                <div className="bg-white">
                  <ReactQuill theme="snow" value={formData.english_lyrics} onChange={val => setFormData({...formData, english_lyrics: val})} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Song</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

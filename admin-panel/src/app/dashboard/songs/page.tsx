'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManageSongsPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [filterSongList, setFilterSongList] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchSongs = () => {
    const token = localStorage.getItem('admin_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Token ${token}`;
    
    fetch('http://127.0.0.1:8000/api/songs/', { headers })
      .then(res => res.json())
      .then(data => {
        setSongs(Array.isArray(data) ? data : (data?.results || []));
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategoriesList(Array.isArray(data) ? data : (data?.results || [])))
      .catch(() => setCategoriesList([]));
  };

  useEffect(() => {
    fetchSongs();
    fetchCategories();
  }, []);

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

  const toggleStatus = async (song: any) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    const res = await fetch(`http://127.0.0.1:8000/api/songs/${song.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ is_published: !song.is_published })
    });
    
    if (res.ok) {
      setSongs(songs.map(s => s.id === song.id ? { ...s, is_published: !s.is_published } : s));
    } else {
      alert('Failed to change status.');
    }
  };

  const filteredSongs = songs.filter(s => {
    // Text search
    const textMatch = search === '' || 
      s.title.toLowerCase().includes(search.toLowerCase()) || 
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      (s.english_lyrics && s.english_lyrics.toLowerCase().includes(search.toLowerCase()));

    // Language Match
    const langMatch = filterLang === 'all' || s.language === filterLang;
    
    // Song List Match
    const isSunday = s.language.includes('sunday');
    const listMatch = filterSongList === 'all' || (filterSongList === 'sunday_school' && isSunday) || (filterSongList === 'all_songs' && !isSunday);

    // Category Match
    const catMatch = filterCategory === 'all' || s.categories?.some((c:any) => c.slug === filterCategory);

    // Status Match
    const statMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && s.is_published) || 
      (filterStatus === 'inactive' && !s.is_published);

    return textMatch && langMatch && listMatch && catMatch && statMatch;
  });

  const teluguLetters = ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ౠ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ", "అం", "అః", "క", "ఖ", "గ", "ఘ", "చ", "ఛ", "జ", "ఝ", "ట", "ఠ", "డ", "ఢ", "ణ", "త", "థ", "ద", "ధ", "న", "ప", "ఫ", "బ", "భ", "మ", "య", "ర", "ల", "వ", "శ", "ష", "స", "హ", "ళ", "క్ష", "ఱ"];
  const englishLetters = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));

  return (
    <div>
      <div className="bg-white rounded-[24px] px-8 py-5 flex items-center justify-between mb-6 shadow-sm border border-gray-100">
        <h1 className="text-[24px] font-bold text-[#1a3845]">Manage Songs</h1>
        <button onClick={() => router.push('/dashboard/songs/add')} className="px-6 py-2.5 bg-[#128a95] text-white rounded-full hover:bg-[#0f717a] transition font-semibold shadow-md">
          Add Song
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search title, slug, lyrics" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-[12px] outline-none focus:border-[#128a95] flex-1 min-w-[200px] text-gray-900 font-medium placeholder-gray-400" 
        />
        
        <select value={filterLang} onChange={e => setFilterLang(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-[12px] outline-none focus:border-[#128a95] min-w-[150px] text-gray-900 font-medium">
          <option value="all">All Languages</option>
          <option value="telugu">Telugu</option>
          <option value="sunday_telugu">Sunday School Telugu</option>
          <option value="sunday_hindi">Sunday School Hindi</option>
          <option value="sunday_english">Sunday School English</option>
        </select>

        <select value={filterSongList} onChange={e => setFilterSongList(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-[12px] outline-none focus:border-[#128a95] min-w-[150px] text-gray-900 font-medium">
          <option value="all">All Song Lists</option>
          <option value="all_songs">All Songs</option>
          <option value="sunday_school">Sunday School</option>
        </select>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-[12px] outline-none focus:border-[#128a95] min-w-[150px] text-gray-900 font-medium">
          <option value="all">All Categories</option>
          {categoriesList.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-[12px] outline-none focus:border-[#128a95] min-w-[150px] text-gray-900 font-medium">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="px-6 py-2.5 bg-[#e8f3f4] text-[#128a95] rounded-[12px] hover:bg-[#d8eff0] transition font-semibold">
          Filter
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Loading songs...</div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[12px] font-bold uppercase tracking-wider bg-white">
                  <th className="py-4 px-6 pt-6">Song</th>
                  <th className="py-4 px-6 pt-6">Language</th>
                  <th className="py-4 px-6 pt-6">Song List</th>
                  <th className="py-4 px-6 pt-6">Category</th>
                  <th className="py-4 px-6 pt-6">Audio</th>
                  <th className="py-4 px-6 pt-6">Status</th>
                  <th className="py-4 px-6 pt-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSongs.slice(0, 100).map(song => (
                  <tr key={song.id} className="hover:bg-gray-50/50 transition bg-white">
                    <td className="py-5 px-6">
                      <p className="text-[17px] font-bold text-[#1a3845] mb-1.5 leading-tight">{song.title}</p>
                      <p className="text-[13px] text-gray-500 font-medium">{song.slug}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{song.language.replace('sunday_', '').charAt(0).toUpperCase() + song.language.replace('sunday_', '').slice(1)}</td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{song.language.includes('sunday') ? 'Sunday School' : 'All Songs'}</td>
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {song.categories?.length > 0 ? song.categories.map((c:any) => c.name).join(', ') : '-'}
                    </td>
                    <td className="py-4 px-6">
                      {song.audio_video ? (
                         <span className="text-[#10b981] font-semibold">Yes</span>
                      ) : (
                         <span className="text-[#ef4444] font-semibold bg-[#fef2f2] px-2 py-1 rounded">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {song.is_published ? (
                        <span className="text-[#16a34a] font-semibold">Active</span>
                      ) : (
                        <span className="text-gray-500 font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <a href={`http://localhost:3000/songs/${song.slug}`} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-[#e8f3f4] text-[#128a95] rounded-full text-[13px] font-bold hover:bg-[#d1eaeb] transition">View</a>
                      <button onClick={() => router.push(`/dashboard/songs/add?id=${song.id}`)} className="px-4 py-2 bg-[#128a95] text-white rounded-full text-[13px] font-bold hover:bg-[#0f717a] transition">Edit</button>
                      <button onClick={() => toggleStatus(song)} className="px-4 py-2 bg-[#e5e7eb] text-[#128a95] rounded-full text-[13px] font-bold hover:bg-gray-300 transition">
                        Inactive
                      </button>
                      <button onClick={() => handleDelete(song.id)} className="px-4 py-2 bg-[#a31a1a] text-white rounded-full text-[13px] font-bold hover:bg-[#861414] transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSongs.length === 0 && (
              <div className="p-8 text-center text-gray-500 font-medium">No songs match your filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

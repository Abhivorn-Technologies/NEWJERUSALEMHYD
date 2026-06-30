'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AddOrEditSongPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(editId ? true : false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    uiLanguage: 'telugu',
    uiSongList: 'all_songs',
    first_letter: '',
    telugu_lyrics: '',
    hindi_lyrics: '',
    english_lyrics: '',
    is_published: true,
    audio_file: null as File | string | null,
    category_ids: [] as number[]
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategoriesList(data))
      .catch(() => setCategoriesList([]));
      
    if (editId) {
      const token = localStorage.getItem('admin_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Token ${token}`;

      fetch(`http://127.0.0.1:8000/api/songs/${editId}/`, { headers })
        .then(res => res.json())
        .then(song => {
          let uiLang = song.language.replace('sunday_', '');
          let uiList = song.language.includes('sunday') ? 'sunday_school' : 'all_songs';
          
          setFormData({
            title: song.title,
            slug: song.slug,
            uiLanguage: uiLang,
            uiSongList: uiList,
            first_letter: song.first_letter,
            telugu_lyrics: song.telugu_lyrics || '',
            hindi_lyrics: song.hindi_lyrics || '',
            english_lyrics: song.english_lyrics || '',
            is_published: song.is_published,
            audio_file: song.audio_file || null,
            category_ids: song.categories?.map((c:any) => c.id) || []
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return alert('Not logged in');

    let languageField = formData.uiLanguage;
    if (formData.uiSongList === 'sunday_school' && languageField !== 'others') {
      languageField = `sunday_${languageField}`;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('slug', formData.slug);
    payload.append('language', languageField);
    payload.append('first_letter', formData.first_letter);
    payload.append('telugu_lyrics', formData.telugu_lyrics);
    payload.append('hindi_lyrics', formData.hindi_lyrics);
    payload.append('english_lyrics', formData.english_lyrics);
    payload.append('is_published', String(formData.is_published));
    
    formData.category_ids.forEach(id => {
      payload.append('category_ids', id.toString());
    });

    if (formData.audio_file instanceof File) {
      payload.append('audio_file', formData.audio_file);
    }

    const url = editId ? `http://127.0.0.1:8000/api/songs/${editId}/` : 'http://127.0.0.1:8000/api/songs/';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Token ${token}`
      },
      body: payload
    });

    if (res.ok) {
      router.push('/dashboard/songs');
    } else {
      alert('Failed to save song. Check console for details.');
      console.error(await res.text());
    }
  };

  const teluguLetters = ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ౠ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ", "అం", "అః", "క", "ఖ", "గ", "ఘ", "చ", "ఛ", "జ", "ఝ", "ట", "ఠ", "డ", "ఢ", "ణ", "త", "థ", "ద", "ధ", "న", "ప", "ఫ", "బ", "భ", "మ", "య", "ర", "ల", "వ", "శ", "ష", "స", "హ", "ళ", "క్ష", "ఱ"];
  const englishLetters = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Loading song data...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => router.push('/dashboard/songs')} className="flex items-center text-[#128a95] hover:text-[#0f717a] font-bold transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Songs
        </button>
      </div>

      <div className="bg-white rounded-[24px] px-8 py-5 flex items-center justify-between mb-6 shadow-sm border border-gray-100">
        <h1 className="text-[24px] font-bold text-[#1a3845]">{editId ? 'Edit Song' : 'Add New Song'}</h1>
        <button type="button" onClick={() => router.push('/dashboard/songs')} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition font-semibold">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-[18px] font-bold text-[#1a3845] border-b border-gray-100 pb-3">Basic Information</h3>
          
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Song Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#128a95] outline-none transition text-gray-900 font-medium" />
          </div>
          
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Slug (URL)</label>
            <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#128a95] outline-none transition text-gray-900 font-medium" />
          </div>

          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Audio File (Optional)</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="audio/*" 
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setFormData({...formData, audio_file: file});
                }}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#128a95] outline-none transition text-gray-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e8f3f4] file:text-[#128a95] hover:file:bg-[#d1eaeb]"
              />
              {formData.audio_file && typeof formData.audio_file === 'string' && (
                <a href={formData.audio_file} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-bold text-[#128a95] hover:underline">
                  View Current Audio
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Language</label>
              <select value={formData.uiLanguage} onChange={e => setFormData({...formData, uiLanguage: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#128a95] outline-none transition text-gray-900 font-medium">
                <option value="telugu">Telugu</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Song List</label>
              <select value={formData.uiSongList} onChange={e => setFormData({...formData, uiSongList: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#128a95] outline-none transition text-gray-900 font-medium">
                <option value="all_songs">All Songs</option>
                <option value="sunday_school">Sunday School</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Category</label>
              <select value={formData.category_ids[0] || ''} onChange={e => setFormData({...formData, category_ids: e.target.value ? [parseInt(e.target.value)] : []})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#128a95] outline-none transition text-gray-900 font-medium">
                <option value="">Uncategorized</option>
                {categoriesList.filter((cat: any) => cat.is_active !== false).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Letter</label>
              <select required value={formData.first_letter} onChange={e => setFormData({...formData, first_letter: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:bg-white focus:border-[#128a95] outline-none transition text-gray-900 font-medium">
                <option value="" disabled>Select letter</option>
                <optgroup label="Telugu">
                  {teluguLetters.map(l => <option key={l} value={l}>{l}</option>)}
                </optgroup>
                <optgroup label="English">
                  {englishLetters.map(l => <option key={l} value={l}>{l}</option>)}
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Status</label>
            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-[12px] cursor-pointer hover:bg-gray-100 transition max-w-[max-content]">
              <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-5 h-5 accent-[#128a95] cursor-pointer" />
              <span className="text-[14px] font-bold text-gray-700">{formData.is_published ? 'Active (Published)' : 'Inactive (Hidden)'}</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-[18px] font-bold text-[#1a3845] border-b border-gray-100 pb-3">Lyrics Content</h3>
          
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-1.5">Telugu Lyrics</label>
            <div className="bg-white border-gray-200 rounded-lg overflow-hidden [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:border-none [&_.ql-container]:border-none border">
              <ReactQuill theme="snow" value={formData.telugu_lyrics} onChange={val => setFormData({...formData, telugu_lyrics: val})} />
            </div>
          </div>
          
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-1.5">English Lyrics (Optional)</label>
            <div className="bg-white border-gray-200 rounded-lg overflow-hidden [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:border-none [&_.ql-container]:border-none border">
              <ReactQuill theme="snow" value={formData.english_lyrics} onChange={val => setFormData({...formData, english_lyrics: val})} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pb-8">
          <button type="button" onClick={() => router.push('/dashboard/songs')} className="px-8 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 font-bold text-gray-700 transition shadow-sm">Cancel</button>
          <button type="submit" className="px-10 py-3 bg-[#128a95] text-white rounded-full hover:bg-[#0f717a] font-bold shadow-md transition">Save Song</button>
        </div>
      </form>
    </div>
  );
}

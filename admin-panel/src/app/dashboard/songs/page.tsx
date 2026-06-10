'use client';
import { useState, useEffect } from 'react';

export default function ManageSongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/songs/')
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Songs</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
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
                    <button className="text-blue-600 hover:underline text-sm font-medium mr-4">Edit</button>
                    <button className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/summary/')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  const g = stats.global_counts;
  const activePercent = g.total_songs > 0 ? Math.round((g.active_songs / g.total_songs) * 100) : 0;
  const audioPercent = g.total_songs > 0 ? Math.round((g.audio_songs / g.total_songs) * 100) : 0;

  // Filter content breakdown into two columns
  const storiesSections = [
    'Old Testament', 'New Testament', 'Topical', 'Biographical',
    'Pre School', 'Coloring', 'Puzzles', 'Quizzes'
  ];
  const resourcesSections = [
    'Infographics', 'Maps', 'Resource Stories', 'Downloads', 'Genealogies', 'Missionary Stories'
  ];

  const getSectionCounts = (sectionName: string) => {
    const s = stats.content_breakdown.find((x: any) => x.section === sectionName);
    return s || { total: 0, active: 0 };
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Songs" value={g.total_songs} sub="All languages" color="bg-blue-600" />
        <StatCard title="Active Songs" value={g.active_songs} sub={`${activePercent}% published`} color="bg-green-600" />
        <StatCard title="Inactive Songs" value={g.inactive_songs} sub="Hidden from frontend" color="bg-gray-600" />
        <StatCard title="Audio Songs" value={g.audio_songs} sub={`${audioPercent}% with audio`} color="bg-purple-600" />
        
        <StatCard title="Categories" value={g.total_categories} sub="Song filters" color="bg-indigo-600" />
        <StatCard title="Bible Resources" value={
          resourcesSections.reduce((sum, sec) => sum + getSectionCounts(sec).total, 0)
        } sub="Resource cards" color="bg-teal-600" />
        <StatCard title="New Prayer Requests" value={g.unread_prayer_requests} sub="Unread messages" color="bg-red-500" />
        <StatCard title="Stories & Activities" value={
          storiesSections.reduce((sum, sec) => sum + getSectionCounts(sec).active, 0)
        } sub="Active content items" color="bg-orange-500" />
      </div>

      {/* BREAKDOWN LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Stories & Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Manage Stories & Activities</h3>
            <span className="text-xs text-gray-500 font-medium">View All</span>
          </div>
          <div className="divide-y divide-gray-100">
            {storiesSections.map(sec => {
              const counts = getSectionCounts(sec);
              return (
                <div key={sec} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                  <span className="text-sm font-medium text-blue-600">{sec}</span>
                  <span className="text-xs text-gray-500">{counts.active} active / {counts.total} total</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bible Resources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Manage Bible Resources</h3>
            <span className="text-xs text-gray-500 font-medium">View All</span>
          </div>
          <div className="divide-y divide-gray-100">
            {resourcesSections.map(sec => {
              const counts = getSectionCounts(sec);
              return (
                <div key={sec} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                  <span className="text-sm font-medium text-blue-600">{sec}</span>
                  <span className="text-xs text-gray-500">{counts.active} active / {counts.total} total</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* LANGUAGE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['English', 'Hindi', 'Telugu'].map(lang => {
          const lstat = stats.language_breakdown.find((x: any) => x.language === lang) || { total: 0, active: 0, inactive: 0 };
          return (
            <div key={lang} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold text-gray-800">{lang}</h3>
              <p className="text-4xl font-black text-blue-600 my-2">{lstat.total}</p>
              <p className="text-xs text-gray-500">{lstat.active} active / {lstat.inactive} inactive</p>
            </div>
          );
        })}
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Category Counts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Song Category Counts</h3>
            <Link href="/dashboard/songs/categories" className="text-xs text-blue-600 hover:underline font-medium">Manage Categories</Link>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white sticky top-0 border-b border-gray-100 shadow-sm z-10">
                <tr>
                  <th className="p-3 font-semibold text-gray-600">Category</th>
                  <th className="p-3 font-semibold text-gray-600 text-center">Total Songs</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.category_breakdown.map((cat: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-800 font-medium">{cat.name}</td>
                    <td className="p-3 text-center text-gray-600">{cat.total}</td>
                    <td className="p-3 text-right">
                      {cat.active > 0 ? (
                        <span className="text-green-600 font-medium">Active</span>
                      ) : (
                        <span className="text-red-500 font-medium">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Letter Wise Counts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Letter Wise Counts</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white sticky top-0 border-b border-gray-100 shadow-sm z-10">
                <tr>
                  <th className="p-3 font-semibold text-gray-600">Language</th>
                  <th className="p-3 font-semibold text-gray-600 text-center">Letter</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">Total Songs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.letter_breakdown.map((l: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{l.language}</td>
                    <td className="p-3 text-center font-bold text-blue-600">{l.first_letter || '#'}</td>
                    <td className="p-3 text-right text-gray-600">{l.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, sub, color }: { title: string, value: string|number, sub: string, color: string }) {
  return (
    <div className={`rounded-xl shadow-sm border border-transparent p-5 text-white ${color}`}>
      <h3 className="text-lg font-bold opacity-90">{title}</h3>
      <p className="text-4xl font-black my-2">{value}</p>
      <p className="text-xs opacity-75">{sub}</p>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Music, CheckCircle2, EyeOff, Headphones, Tags, BookOpen, MessageSquare, Layers } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    fetch('http://127.0.0.1:8000/api/summary/', { headers })
      .then(async res => {
        if (!res.ok) {
          throw new Error('Failed to fetch summary');
        }
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="animate-pulse p-4 text-[#1a3845] font-bold text-center mt-12 text-lg">Loading dashboard...</div>;
  }

  if (error || !stats) {
    return <div className="p-4 text-red-500 font-bold text-center mt-12 text-lg">Failed to load dashboard data. Ensure the backend is running and you are logged in.</div>;
  }

  const g = stats.global_counts;
  const activePercent = g.total_songs > 0 ? Math.round((g.active_songs / g.total_songs) * 100) : 0;
  const audioPercent = g.total_songs > 0 ? Math.round((g.audio_songs / g.total_songs) * 100) : 0;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Songs" value={g.total_songs} sub="All languages" 
          icon={Music} gradientFrom="#0B7A8A" gradientTo="#12B3C9" delay={0} 
        />
        <StatCard 
          title="Active Songs" value={g.active_songs} sub={`${activePercent}% published`} 
          icon={CheckCircle2} gradientFrom="#10B981" gradientTo="#34D399" delay={100} 
        />
        <StatCard 
          title="Inactive Songs" value={g.inactive_songs} sub="Hidden from frontend" 
          icon={EyeOff} gradientFrom="#F59E0B" gradientTo="#FBBF24" delay={200} 
        />
        <StatCard 
          title="Audio Songs" value={g.audio_songs} sub={`${audioPercent}% with audio`} 
          icon={Headphones} gradientFrom="#8B5CF6" gradientTo="#A78BFA" delay={300} 
        />
        
        <StatCard 
          title="Categories" value={g.total_categories} sub="Song filters" 
          icon={Tags} gradientFrom="#3B82F6" gradientTo="#60A5FA" delay={400} 
        />
        <StatCard 
          title="Bible Resources" 
          value={resourcesSections.reduce((sum, sec) => sum + getSectionCounts(sec).total, 0)} 
          sub="Resource cards" 
          icon={BookOpen} gradientFrom="#0EA5E9" gradientTo="#38BDF8" delay={500} 
        />
        <StatCard 
          title="New Prayer Requests" value={g.unread_prayer_requests} sub="Unread messages" 
          icon={MessageSquare} gradientFrom="#EC4899" gradientTo="#F472B6" delay={600} 
        />
        <StatCard 
          title="Stories & Activities" 
          value={storiesSections.reduce((sum, sec) => sum + getSectionCounts(sec).active, 0)} 
          sub="Active content items" 
          icon={Layers} gradientFrom="#EF4444" gradientTo="#F87171" delay={700} 
        />
      </div>

      {/* BREAKDOWN LISTS */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Stories & Activities */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden animate-fade-up" style={{ animationDelay: '800ms' }}>
          <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
            <h3 className="text-[20px] font-bold text-[#1a3845]">Manage Stories & Activities</h3>
            <Link href="/dashboard/content?section=Old Testament" className="bg-[#128a95] hover:bg-[#0f717a] text-white text-[13px] font-medium px-5 py-2 rounded-full transition-colors">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {storiesSections.map(sec => {
              const counts = getSectionCounts(sec);
              return (
                <div key={sec} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition">
                  <span className="text-[15px] font-semibold text-[#1a3845]">{sec}</span>
                  <span className="text-[13px] font-medium text-gray-500">{counts.active} active / {counts.total} total</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bible Resources */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden animate-fade-up" style={{ animationDelay: '900ms' }}>
          <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
            <h3 className="text-[20px] font-bold text-[#1a3845]">Manage Bible Resources</h3>
            <Link href="/dashboard/content?section=Infographics" className="bg-[#128a95] hover:bg-[#0f717a] text-white text-[13px] font-medium px-5 py-2 rounded-full transition-colors">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {resourcesSections.map(sec => {
              const counts = getSectionCounts(sec);
              return (
                <div key={sec} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition">
                  <span className="text-[15px] font-semibold text-[#1a3845]">{sec}</span>
                  <span className="text-[13px] font-medium text-gray-500">{counts.active} active / {counts.total} total</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* LANGUAGE CARDS */}
      <div className="grid grid-cols-1 gap-6">
        {['English', 'Hindi', 'Telugu'].map((lang, idx) => {
          const lstat = stats.language_breakdown.find((x: any) => x.language === lang) || { total: 0, active: 0, inactive: 0 };
          return (
            <div key={lang} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left animate-fade-up" style={{ animationDelay: `${1000 + (idx * 100)}ms` }}>
              <div>
                <h3 className="text-[20px] font-bold text-[#1a3845]">{lang} Songs</h3>
                <p className="text-[14px] font-medium text-gray-500 mt-1">{lstat.active} active / {lstat.inactive} inactive</p>
              </div>
              <p className="text-[48px] font-black text-[#128a95] leading-none mt-4 sm:mt-0">{lstat.total}</p>
            </div>
          );
        })}
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Category Counts */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[400px] animate-fade-up" style={{ animationDelay: '1300ms' }}>
          <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
            <h3 className="text-[20px] font-bold text-[#1a3845]">Song Category Counts</h3>
            <Link href="/dashboard/songs/categories" className="text-[13px] font-semibold text-[#128a95] hover:underline">Manage Categories</Link>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-white sticky top-0 border-b border-gray-100 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-500">Category</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-center">Total Songs</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.category_breakdown.map((cat: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#1a3845] font-semibold">{cat.name}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-600">{cat.total}</td>
                    <td className="px-4 py-3 text-right">
                      {cat.active > 0 ? (
                        <span className="text-[#10b981] font-semibold bg-[#10b981]/10 px-2 py-1 rounded-md text-[12px]">Active</span>
                      ) : (
                        <span className="text-[#ef4444] font-semibold bg-[#ef4444]/10 px-2 py-1 rounded-md text-[12px]">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Letter Wise Counts */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[400px] animate-fade-up" style={{ animationDelay: '1400ms' }}>
          <div className="px-6 py-5 border-b border-gray-100 bg-white">
            <h3 className="text-[20px] font-bold text-[#1a3845]">Letter Wise Counts</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-white sticky top-0 border-b border-gray-100 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-500">Language</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-center">Letter</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-right">Total Songs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.letter_breakdown.map((l: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-[#1a3845]">{l.language}</td>
                    <td className="px-4 py-3 text-center font-bold text-[#128a95]">{l.first_letter || '#'}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-600">{l.total}</td>
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

function StatCard({ 
  title, 
  value, 
  sub, 
  icon: Icon,
  gradientFrom,
  gradientTo,
  delay
}: { 
  title: string, 
  value: string|number, 
  sub: string, 
  icon: any,
  gradientFrom: string,
  gradientTo: string,
  delay: number
}) {
  return (
    <div 
      className={`relative rounded-[24px] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-up text-white`}
      style={{ 
        animationDelay: `${delay}ms`,
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
      }}
    >
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-[13px] font-bold tracking-wider text-white/80 uppercase mb-4">{title}</h3>
          <p className="text-[44px] font-black leading-none mb-2 tracking-tight drop-shadow-sm">{value}</p>
          <p className="text-[13px] font-semibold text-white/90">{sub}</p>
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
          <Icon size={28} className="text-white drop-shadow-md" />
        </div>
      </div>
      
      {/* Abstract Glassmorphism Shapes */}
      <div className="absolute -bottom-10 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -top-10 -left-8 w-24 h-24 rounded-full bg-white/20 blur-xl pointer-events-none" />
    </div>
  );
}

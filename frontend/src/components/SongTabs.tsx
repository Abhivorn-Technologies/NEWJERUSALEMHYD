'use client';
import { useState } from 'react';

interface SongProps {
  telugu_lyrics: string;
  hindi_lyrics: string;
  english_lyrics: string;
  powerpoint_slides: string;
  audio_video: string;
  chords: string;
}

export default function SongTabs({ song }: { song: SongProps }) {
  const tabs = [
    { id: 'telugu', label: 'Telugu Lyrics', content: song.telugu_lyrics },
    { id: 'hindi', label: 'Hindi Lyrics', content: song.hindi_lyrics },
    { id: 'english', label: 'English Lyrics', content: song.english_lyrics },
    { id: 'ppt', label: 'PowerPoint Slides', content: song.powerpoint_slides },
    { id: 'audio', label: 'Audio / Video', content: song.audio_video },
    { id: 'chords', label: 'Chords', content: song.chords },
  ];

  const activeTabs = tabs.filter(tab => tab.content && tab.content.trim().length > 0);
  const [activeId, setActiveId] = useState(activeTabs.length > 0 ? activeTabs[0].id : null);

  const formatLyrics = (htmlContent: string) => {
    if (!htmlContent) return '';
    
    // Clean up redundant newlines around HTML tags to prevent double line breaks
    if (/<p>|<br\s*\/?>/i.test(htmlContent)) {
      return htmlContent
        .replace(/(<br\s*\/?>)\s*\n/gi, '$1')
        .replace(/(<\/p>)\s*\n/gi, '$1')
        .replace(/(<p>)\s*\n/gi, '$1')
        .trim();
    }
    
    // Fallback for plain text: convert newlines to HTML breaks
    return htmlContent.replace(/\r?\n/g, '<br />');
  };

  if (activeTabs.length === 0) {
    return <div className="text-gray-500 italic p-4">No lyrics or media available.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
      <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
        {activeTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              activeId === tab.id 
                ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6 md:p-8">
        {activeTabs.map(tab => (
          <div 
            key={tab.id} 
            className={activeId === tab.id ? 'block' : 'hidden'}
          >
            <div 
              className="prose max-w-none text-gray-800 text-[17px] leading-relaxed [&_p]:my-5 [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatLyrics(tab.content) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

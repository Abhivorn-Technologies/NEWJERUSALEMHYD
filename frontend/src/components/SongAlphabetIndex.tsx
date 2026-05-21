'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Song {
  id: number;
  title: string;
  slug: string;
  first_letter: string;
}

const englishAlphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'];
const teluguAlphabet = ['అ','ఆ','ఇ','ఈ','ఉ','ఊ','ఋ','ఎ','ఏ','ఐ','ఒ','ఓ','ఔ','క','ఖ','గ','ఘ','చ','ఛ','జ','ఝ','ట','ఠ','డ','ఢ','ణ','త','థ','ద','ధ','న','ప','ఫ','బ','భ','మ','య','ర','ల','వ','శ','ష','స','హ','ళ','క్ష','ఱ','#'];
const hindiAlphabet = ['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ','क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह','क्ष','त्र','ज्ञ','#'];

export default function SongAlphabetIndex({ language = 'telugu', alphabet }: { language?: string; alphabet?: 'telugu' | 'english' | 'hindi' }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(true);

  const activeAlphabet = alphabet === 'english' ? englishAlphabet : alphabet === 'hindi' ? hindiAlphabet : teluguAlphabet;

  useEffect(() => {
    setSelectedLetter('');
    setSearchVal('');
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    fetch(`${baseUrl}/songs/?language=${language}`)
      .then(res => res.json())
      .then(data => {
        const normalizedData = data.map((song: any) => {
          let fl = song.first_letter;
          if (!fl || fl === '#') {
            const title = song.title || '';
            fl = title.trim().charAt(0).toUpperCase() || '#';
          }
          if (alphabet === 'english' && fl) {
            fl = fl.toUpperCase();
          }
          return { ...song, first_letter: fl || '#' };
        });
        setSongs(normalizedData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language, alphabet]);

  const filtered = searchVal
    ? songs.filter(s => s.title.toLowerCase().includes(searchVal.toLowerCase()))
    : songs;

  const avail: Record<string, boolean> = {};
  filtered.forEach(s => { avail[s.first_letter] = true; });

  const displaySongs = selectedLetter
    ? filtered.filter(s => s.first_letter === selectedLetter)
    : filtered;

  const groups: Record<string, Song[]> = {};
  displaySongs.forEach(s => {
    if (!groups[s.first_letter]) groups[s.first_letter] = [];
    groups[s.first_letter].push(s);
  });

  const sortedLetters = Object.keys(groups).sort((a, b) => {
    const ia = activeAlphabet.indexOf(a);
    const ib = activeAlphabet.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const alphaRows: string[][] = [];
  for (let i = 0; i < activeAlphabet.length; i += 9) {
    alphaRows.push(activeAlphabet.slice(i, i + 9));
  }

  let globalSno = 0;

  const styles = {
    container: { background: '#f5f6f8', borderRadius: '10px', padding: '6px', marginBottom: '8px' },
    alphaTable: { width: '100%', borderCollapse: 'separate' as const, borderSpacing: '2px', tableLayout: 'fixed' as const },
    alphaBtn: (isActive: boolean, hasSongs: boolean): React.CSSProperties => ({
      width: '100%',
      padding: '5px 1px',
      border: isActive ? '1px solid #4a6cf7' : '1px solid #e0e0e0',
      borderRadius: '5px',
      background: isActive ? '#4a6cf7' : '#fff',
      color: isActive ? '#fff' : '#333',
      fontSize: '11px',
      fontWeight: 600,
      cursor: hasSongs ? 'pointer' : 'default',
      fontFamily: 'inherit',
      transition: 'all .15s',
      minWidth: '24px',
      opacity: hasSongs ? 1 : 0.25,
      pointerEvents: hasSongs ? 'auto' : 'none' as React.CSSProperties['pointerEvents'],
    }),
    searchInput: {
      width: '100%',
      padding: '12px 18px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      fontSize: '15px',
      boxSizing: 'border-box' as const,
      outline: 'none',
      fontFamily: 'inherit',
      background: '#fafafa',
    },
    countBar: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 4px 12px',
      borderBottom: '2px solid #eee',
      marginBottom: '12px',
    },
    countText: { fontSize: '15px', color: '#4a6cf7', fontWeight: 600 },
    letterBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      background: '#4a6cf7',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 700,
      borderRadius: '8px',
      flexShrink: 0,
    } as React.CSSProperties,
    letterRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 0 6px', marginTop: '8px' },
    letterCount: { fontSize: '13px', color: '#888', fontWeight: 500 },
    letterLine: { flex: 1, height: '1px', background: '#e8e8e8' },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '8px' },
    th: { background: '#4a6cf7', color: '#fff', padding: '10px 14px', textAlign: 'left' as const, fontSize: '13px', fontWeight: 600 },
    thFirst: { width: '60px', textAlign: 'center' as const, borderRadius: '6px 0 0 0' },
    thLast: { borderRadius: '0 6px 0 0' },
    td: { padding: '10px 14px', borderBottom: '1px solid #eee', fontSize: '14px' },
    tdFirst: { textAlign: 'center' as const, color: '#999', fontWeight: 500, fontSize: '13px', width: '60px' },
    link: { color: '#333', textDecoration: 'none', lineHeight: 1.6 },
  };

  return (
    <div id="sse-songs">
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          id="sse-search"
          placeholder="Search songs by title..."
          style={styles.searchInput}
          onFocus={e => { e.target.style.borderColor = '#4a6cf7'; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#fafafa'; }}
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
      </div>

      <div style={styles.container}>
        <table style={styles.alphaTable}>
          {alphaRows.map((row, ri) => (
            <tr key={ri}>
              {row.map(letter => {
                const isActive = selectedLetter === letter;
                const hasSongs = avail[letter];
                return (
                  <td key={letter} style={{ textAlign: 'center' }}>
                    <button
                      className="sse-alpha"
                      data-letter={letter === '#' ? '%23' : letter}
                      style={styles.alphaBtn(isActive, !!hasSongs)}
                      onMouseEnter={e => { if (hasSongs && !isActive) { e.currentTarget.style.background = '#4a6cf7'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#4a6cf7'; }}}
                      onMouseLeave={e => { if (hasSongs && !isActive) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = '#e0e0e0'; }}}
                      onClick={() => {
                        if (!hasSongs) return;
                        if (selectedLetter === letter) {
                          setSelectedLetter('');
                        } else {
                          setSelectedLetter(letter);
                        }
                      }}
                    >
                      {letter}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </table>
      </div>

      <div style={styles.countBar}>
        <span style={styles.countText} id="sse-count">
          {loading ? 'Loading...' : `${displaySongs.length} song${displaySongs.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#bbb', fontSize: '15px' }}>
          Loading songs...
        </div>
      ) : (
        <>
          <div id="sse-songs-list">
            {sortedLetters.map(letter => {
              const sectionSongs = groups[letter];
              const startSno = globalSno + 1;
              globalSno += sectionSongs.length;
              return (
              <div key={letter}>
                <div style={styles.letterRow}>
                  <span style={styles.letterBadge}>{letter}</span>
                  <span style={styles.letterCount}>{sectionSongs.length} songs</span>
                  <span style={styles.letterLine}></span>
                </div>
                <table className="sse-songs-table" style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, ...styles.thFirst }}>S.No</th>
                      <th style={{ ...styles.th, ...styles.thLast }}>Song Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionSongs.map((song, idx) => (
                      <tr key={song.id}>
                        <td style={{ ...styles.td, ...styles.tdFirst }}>{startSno + idx}</td>
                        <td style={styles.td}>
                          <Link href={`/songs/${song.slug}`} style={styles.link}>
                            {song.title}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              );
            })}
          </div>
          <div id="sse-empty" style={{ display: displaySongs.length === 0 ? 'block' : 'none', textAlign: 'center', padding: '40px', color: '#bbb', fontSize: '15px' }}>
            No songs found for this selection.
          </div>
        </>
      )}

      <style>{`
        #sse-songs .sse-songs-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        #sse-songs .sse-songs-table th { background: #4a6cf7; color: #fff; padding: 10px 14px; text-align: left; font-size: 13px; font-weight: 600; }
        #sse-songs .sse-songs-table th:first-child { width: 60px; text-align: center; border-radius: 6px 0 0 0; }
        #sse-songs .sse-songs-table th:last-child { border-radius: 0 6px 0 0; }
        #sse-songs .sse-songs-table td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 14px; }
        #sse-songs .sse-songs-table td:first-child { text-align: center; color: #999; font-weight: 500; font-size: 13px; width: 60px; }
        #sse-songs .sse-songs-table tr:hover td { background: #f0f4ff; }
        #sse-songs .sse-songs-table tr:nth-child(even) td { background: #fafbfc; }
        #sse-songs .sse-songs-table tr:nth-child(even):hover td { background: #f0f4ff; }
        #sse-songs .sse-songs-table a { color: #333; text-decoration: none; line-height: 1.6; }
        #sse-songs .sse-songs-table a:hover { color: #4a6cf7; }
        @media (max-width:600px) {
          #sse-songs .sse-alpha { font-size: 11px !important; padding: 4px 1px !important; min-width: 22px !important; }
          #sse-songs table.sse-alpha-table { border-spacing: 2px !important; }
          #sse-songs .sse-songs-table td, #sse-songs .sse-songs-table th { padding: 8px 10px; font-size: 13px; }
          #sse-songs .sse-songs-table td:first-child { width: 40px; }
        }
      `}</style>
    </div>
  );
}

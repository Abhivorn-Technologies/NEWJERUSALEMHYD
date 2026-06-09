'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SongCategory {
  id: number;
  name: string;
  slug: string;
}

interface Song {
  id: number;
  title: string;
  slug: string;
  language: string;
  first_letter: string;
  telugu_lyrics: string;
  hindi_lyrics: string;
  english_lyrics: string;
  powerpoint_slides: string;
  audio_video: string;
  chords: string;
  categories: SongCategory[];
}

const englishAlphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'];
const teluguAlphabet = ['అ','ఆ','ఇ','ఈ','ఉ','ఊ','ఋ','ఎ','ఏ','ఐ','ఒ','ఓ','ఔ','క','ఖ','గ','ఘ','చ','ఛ','జ','ఝ','ట','ఠ','డ','ఢ','ణ','త','థ','ద','ధ','న','ప','ఫ','బ','భ','మ','య','ర','ల','వ','శ','ష','స','హ','ళ','క్ష','ఱ','#'];
const hindiAlphabet = ['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ','क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ','ण','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह','क्ष','त्र','ज्ञ','#'];

const ALLOWED_CATEGORIES = [
  'Christmas Songs',
  'Comfort Songs',
  'Commitment Songs',
  'Correction Songs',
  'Easter Songs',
  'Encouraging Songs',
  'English',
  'Good Friday Songs',
  'Gospel Songs',
  'Hindi',
  'Hope Songs',
  'Kids Songs',
  'Marriage Songs',
  'Offering Songs',
  'Praise Songs',
  'Prayer Songs',
  'Repentance Songs',
  'Second Coming Songs',
  'Telugu',
  'Thanksgiving Songs',
  'Worship Songs'
];

const getDynamicFirstLetter = (song: Song, kbLang: 'telugu' | 'english' | 'hindi') => {
  const title = (song.title || '').trim();
  if (!title) return '#';

  // 1. English letter index
  if (kbLang === 'english') {
    const parenMatch = title.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1]) {
      const engText = parenMatch[1].trim();
      const firstChar = engText.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) return firstChar;
    }
    const cleanTitle = title.replace(/^[🎵📖⛪🙏\s\-\/\(\)]+/, '');
    const firstChar = cleanTitle.charAt(0).toUpperCase();
    if (/[A-Z]/.test(firstChar)) return firstChar;

    return '#';
  }

  // 2. Hindi letter index
  if (kbLang === 'hindi') {
    const cleanTitle = title.replace(/^[🎵📖⛪🙏\s\-\/\(\)]+/, '');
    if (!cleanTitle) return '#';
    const firstChar = cleanTitle.charAt(0);
    if (/[\u0900-\u097F]/.test(firstChar)) {
      return firstChar;
    }
    const parenMatch = title.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1]) {
      const text = parenMatch[1].trim();
      const parenFirstChar = text.charAt(0);
      if (/[\u0900-\u097F]/.test(parenFirstChar)) return parenFirstChar;
    }
    return '#';
  }

  // 3. Telugu letter index
  if (kbLang === 'telugu') {
    const cleanTitle = title.replace(/^[🎵📖⛪🙏\s\-\/\(\)]+/, '');
    if (!cleanTitle) return '#';
    const firstChar = cleanTitle.charAt(0);
    if (/[\u0C00-\u0C7F]/.test(firstChar)) {
      return firstChar;
    }
    const parenMatch = title.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1]) {
      const text = parenMatch[1].trim();
      const parenFirstChar = text.charAt(0);
      if (/[\u0C00-\u0C7F]/.test(parenFirstChar)) return parenFirstChar;
    }
    return '#';
  }

  return song.first_letter || '#';
};

const cleanTeluguTitle = (title: string) => {
  if (!title) return '';
  let clean = title.split('/')[0].trim();
  const match = clean.match(/\s*\(([^)]*)\)\s*$/);
  if (match) {
    const inside = match[1];
    if (/[a-zA-Z]/.test(inside)) {
      clean = clean.replace(/\s*\([^)]*\)\s*$/, '').trim();
    }
  }
  return clean;
};

function SundaySchoolSongsDashboard() {
  const searchParams = useSearchParams();
  
  // App States
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<SongCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchVal, setSearchVal] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [lastSelectedLetter, setLastSelectedLetter] = useState<string>('');
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  
  // viewTab represents the current filter tab
  const [viewTab, setViewTab] = useState<'home' | 'telugu-songs' | 'hindi-songs' | 'english-songs' | 'telugu-index' | 'english-index' | 'song-request'>('home');
  
  // Song Request Form States
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    songTitle: '',
    language: 'telugu',
    details: ''
  });
  const [requestErrors, setRequestErrors] = useState({ name: '', email: '', submit: '' });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let valid = true;
    const newErrors = { name: '', email: '', submit: '' };

    // Name validation: alphabets and spaces only
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!requestForm.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    } else if (!nameRegex.test(requestForm.name.trim())) {
      newErrors.name = "Name can only contain alphabets and spaces.";
      valid = false;
    }

    // Email validation: standard email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!requestForm.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(requestForm.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. user@example.com).";
      valid = false;
    }

    setRequestErrors(newErrors);

    if (!valid) {
      return;
    }

    setSubmittingRequest(true);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS credentials are not configured in environment variables.");
      setRequestErrors(prev => ({
        ...prev,
        submit: "Submission failed: email service is not configured."
      }));
      setSubmittingRequest(false);
      return;
    }

    const formattedDetails = `
Song Title: ${requestForm.songTitle}
Language: ${requestForm.language}
Phone: ${requestForm.phone || 'N/A'}
Details / Lyrics / Links:
${requestForm.details || 'N/A'}
    `.trim();

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        song_title:      requestForm.songTitle || 'N/A',
        language:        requestForm.language || 'N/A',
        notes:           requestForm.details || 'N/A',
        requester_name:  requestForm.name,
        requester_email: requestForm.email,
        requester_phone: requestForm.phone || 'N/A',
        submitted_at:    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        subject:         `New Sunday School Song Request: ${requestForm.songTitle}`,
        reply_to:        requestForm.email,
      }
    };

    console.log("🚀 SENDING PAYLOAD TO EMAILJS:", payload);

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then((res) => {
      if (res.ok) {
        setRequestSubmitted(true);
        setRequestForm({
          name: '',
          email: '',
          phone: '',
          songTitle: '',
          language: 'telugu',
          details: ''
        });
        setRequestErrors({ name: '', email: '', submit: '' });
      } else {
        return res.text().then(text => {
          throw new Error(text || 'Failed to send email via EmailJS');
        });
      }
    })
    .catch((err) => {
      console.error(err);
      setRequestErrors(prev => ({
        ...prev,
        submit: "Failed to send request. Please try again later."
      }));
    })
    .finally(() => {
      setSubmittingRequest(false);
    });
  };
  const [viewMode, setViewMode] = useState<'all' | 'categories' | 'favorites'>('all');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  
  // ViewState: 'index' shows the lists/keyboards, 'lyrics' shows the reader
  const [viewState, setViewState] = useState<'index' | 'lyrics'>('index');
  
  // Interaction states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState<number>(18);
  const [activeLyricsTab, setActiveLyricsTab] = useState<'telugu' | 'english' | 'hindi' | 'ppt'>('telugu');
  const [keyboardLanguage, setKeyboardLanguage] = useState<'telugu' | 'english' | 'hindi'>('telugu');
  
  // Popups/Modals
  const [isLetterPickerOpen, setIsLetterPickerOpen] = useState<boolean>(false);
  
  const letterPickerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  const getLetterStyle = (l: string) => {
    const isTelugu = l && /[\u0C00-\u0C7F]/.test(l);
    const isHindi = l && /[\u0900-\u097F]/.test(l);
    return { 
      fontFamily: isTelugu ? 'var(--font-ramabhadra), sans-serif' : isHindi ? 'sans-serif' : 'var(--font-ramabhadra), sans-serif',
      fontSize: (isTelugu || isHindi) ? '34px' : '22px',
      lineHeight: '1'
    };
  };

  const getHeaderLetterStyle = (l: string) => {
    const isTelugu = l && /[\u0C00-\u0C7F]/.test(l);
    const isHindi = l && /[\u0900-\u097F]/.test(l);
    return { 
      fontFamily: isTelugu ? 'var(--font-ramabhadra), sans-serif' : isHindi ? 'sans-serif' : 'var(--font-ramabhadra), sans-serif',
      fontSize: (isTelugu || isHindi) ? '52px' : '32px',
      lineHeight: '1',
      verticalAlign: 'middle'
    };
  };

  const getButtonLetterStyle = (l: string) => {
    const isTelugu = l && /[\u0C00-\u0C7F]/.test(l);
    const isHindi = l && /[\u0900-\u097F]/.test(l);
    return { 
      fontFamily: isTelugu ? 'var(--font-ramabhadra), sans-serif' : isHindi ? 'sans-serif' : 'var(--font-ramabhadra), sans-serif',
      fontSize: (isTelugu || isHindi) ? '38px' : '24px',
      lineHeight: '1',
      paddingTop: (isTelugu || isHindi) ? '2px' : '0px'
    };
  };

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    if (val.trim().length > 0) {
      setSelectedLetter('');
    } else {
      if (lastSelectedLetter) {
        setSelectedLetter(lastSelectedLetter);
      } else {
        const alphabet = getAlphabetForLang(keyboardLanguage);
        const firstLetterWithSongs = alphabet.find(l => songs.some(s => getDynamicFirstLetter(s, keyboardLanguage) === l));
        setSelectedLetter(firstLetterWithSongs || '');
      }
    }
  };

  // Scroll to top when active song or tab changes
  useEffect(() => {
    if (activeSong) {
      window.scrollTo(0, 0);
      if (lyricsContainerRef.current) {
        lyricsContainerRef.current.scrollTop = 0;
      }
    }
  }, [activeSong, activeLyricsTab]);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('njm_favorite_sunday_songs');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleFavorite = (slug: string) => {
    let updated = [...favorites];
    if (updated.includes(slug)) {
      updated = updated.filter(s => s !== slug);
    } else {
      updated.push(slug);
    }
    setFavorites(updated);
    localStorage.setItem('njm_favorite_sunday_songs', JSON.stringify(updated));
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (letterPickerRef.current && !letterPickerRef.current.contains(event.target as Node)) {
        setIsLetterPickerOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all songs and filter client-side for Sunday School songs only
  useEffect(() => {
    setLoading(true);
    setSelectedLetter('');
    setLastSelectedLetter('');
    setSearchVal('');
    setKeyboardLanguage('telugu');
    
    fetch(`${baseUrl}/songs/?language=all`)
      .then(res => res.json())
      .then((data: Song[]) => {
        // Keep ONLY Sunday School songs
        const sundaySongs = data.filter(s => 
          s.language === 'sunday_telugu' || 
          s.language === 'sunday_english' || 
          s.language === 'sunday_hindi'
        );
        const normalized = sundaySongs.map(song => {
          let fl = song.first_letter;
          if (!fl || fl === '#') {
            const title = song.title || '';
            fl = title.trim().charAt(0).toUpperCase() || '#';
          }
          return { ...song, first_letter: fl || '#' };
        });
        setSongs(normalized);
        
        // Default select the first alphabet with songs
        if (normalized.length > 0) {
          const alphabet = teluguAlphabet;
          const firstLetterWithSongs = alphabet.find(l => normalized.some(s => getDynamicFirstLetter(s, 'telugu') === l));
          
          if (firstLetterWithSongs) {
            setSelectedLetter(firstLetterWithSongs);
            setLastSelectedLetter(firstLetterWithSongs);
          } else {
            const fallbackLetter = getDynamicFirstLetter(normalized[0], 'telugu');
            setSelectedLetter(fallbackLetter);
            setLastSelectedLetter(fallbackLetter);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading Sunday School songs:", err);
        setLoading(false);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${baseUrl}/categories/`)
      .then(res => res.json())
      .then((data: SongCategory[]) => {
        setCategories(data);
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const selectKeyboardLanguage = (kbLang: 'telugu' | 'english' | 'hindi') => {
    setKeyboardLanguage(kbLang);
    const alphabet = getAlphabetForLang(kbLang);
    const firstLetterWithSongs = alphabet.find(l => songs.some(s => getDynamicFirstLetter(s, kbLang) === l));
    setSelectedLetter(firstLetterWithSongs || '');
    setLastSelectedLetter(firstLetterWithSongs || '');
  };

  const determineDefaultLyricsTab = (song: Song) => {
    if (song.telugu_lyrics && song.telugu_lyrics.trim().length > 0) {
      setActiveLyricsTab('telugu');
    } else if (song.english_lyrics && song.english_lyrics.trim().length > 0) {
      setActiveLyricsTab('english');
    } else if (song.hindi_lyrics && song.hindi_lyrics.trim().length > 0) {
      setActiveLyricsTab('hindi');
    }
  };

  const handleSelectSong = (song: Song) => {
    setActiveSong(song);
    determineDefaultLyricsTab(song);
    
    const songLang = (song.language === 'sunday_english') ? 'english' : 
                     (song.language === 'sunday_hindi') ? 'hindi' : 'telugu';
    setKeyboardLanguage(songLang);
    
    const fl = getDynamicFirstLetter(song, songLang);
    setSelectedLetter(fl);
    setLastSelectedLetter(fl);
    
    setViewState('lyrics');
  };

  const getAlphabetForLang = (kbLang: 'telugu' | 'english' | 'hindi') => {
    if (kbLang === 'english') return englishAlphabet;
    if (kbLang === 'hindi') return hindiAlphabet;
    return teluguAlphabet;
  };

  const activeAlphabet = getAlphabetForLang(keyboardLanguage);

  // Filter songs based on current filters and active tabs
  const getBaseFilteredSongs = (): Song[] => {
    let result = songs;

    // ViewMode filters
    if (viewMode === 'favorites') {
      result = result.filter(s => favorites.includes(s.slug));
    } else if (viewMode === 'categories' && selectedCategorySlug) {
      result = result.filter(s => s.categories.some(c => c.slug === selectedCategorySlug));
    }

    // Search filter
    if (searchVal.trim().length > 0) {
      const q = searchVal.toLowerCase();
      result = result.filter(s => 
        (s.title && s.title.toLowerCase().includes(q)) || 
        (s.telugu_lyrics && s.telugu_lyrics.toLowerCase().includes(q)) || 
        (s.english_lyrics && s.english_lyrics.toLowerCase().includes(q)) || 
        (s.hindi_lyrics && s.hindi_lyrics.toLowerCase().includes(q))
      );
    }

    // Tab/Index filters
    if (viewState === 'index') {
      if (viewTab === 'telugu-songs' || viewTab === 'telugu-index') {
        result = result.filter(s => s.language === 'sunday_telugu');
      } else if (viewTab === 'hindi-songs') {
        result = result.filter(s => s.language === 'sunday_hindi');
      } else if (viewTab === 'english-songs' || viewTab === 'english-index') {
        result = result.filter(s => s.language === 'sunday_english');
      }
    } else if (viewState === 'lyrics') {
      if (keyboardLanguage === 'telugu') {
        result = result.filter(s => s.language === 'sunday_telugu');
      } else if (keyboardLanguage === 'hindi') {
        result = result.filter(s => s.language === 'sunday_hindi');
      } else if (keyboardLanguage === 'english') {
        result = result.filter(s => s.language === 'sunday_english');
      }
    }

    return result;
  };

  const getFilteredSongs = (): Song[] => {
    let result = getBaseFilteredSongs();

    if (selectedLetter && viewState === 'lyrics') {
      result = result.filter(s => getDynamicFirstLetter(s, keyboardLanguage) === selectedLetter);
    }

    return result;
  };

  const filteredSongsList = getFilteredSongs();

  // Find letter counts for active configuration
  const getLetterAvailability = (): Record<string, number> => {
    const avail: Record<string, number> = {};
    const targetSongs = getBaseFilteredSongs();

    targetSongs.forEach(s => {
      const dynamicLetter = getDynamicFirstLetter(s, keyboardLanguage);
      if (dynamicLetter) {
        avail[dynamicLetter] = (avail[dynamicLetter] || 0) + 1;
      }
    });
    return avail;
  };

  const letterAvailability = getLetterAvailability();

  const formatLyrics = (htmlContent: string) => {
    if (!htmlContent) return '';
    let content = htmlContent.trim();
    if (!/<p>|<br\s*\/?>/i.test(content)) {
      content = content.replace(/\r?\n/g, '<br />');
    } else {
      content = content
        .replace(/(<br\s*\/?>)\s*\n/gi, '$1')
        .replace(/(<\/p>)\s*\n/gi, '$1')
        .replace(/(<p>)\s*\n/gi, '$1');
    }
    return content;
  };

  const getActiveLyricsContent = (): string => {
    if (!activeSong) return '';
    switch (activeLyricsTab) {
      case 'telugu': return activeSong.telugu_lyrics || '';
      case 'english': return activeSong.english_lyrics || '';
      case 'hindi': return activeSong.hindi_lyrics || '';
      case 'ppt': return activeSong.powerpoint_slides || '';
      default: return activeSong.telugu_lyrics || '';
    }
  };

  const getSlides = (htmlContent: string): string[] => {
    if (!htmlContent) return [];
    let cleanText = htmlContent;
    let rawSlides = cleanText.split(/<\/p>/i);
    let slides = rawSlides
      .map(slide => {
        let text = slide.replace(/<p>/i, '').trim();
        text = text.replace(/<br\s*\/?>/gi, '\n');
        text = text.replace(/<[^>]*>/g, '');
        text = text
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        return text.trim();
      })
      .filter(slide => slide.length > 0);
      
    if (slides.length === 0) {
      let textContent = htmlContent
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '');
      slides = textContent
        .split(/\n\s*\n/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }
    return slides;
  };

  const downloadLyricsFile = () => {
    if (!activeSong) return;
    const lyricsText = getSlides(getActiveLyricsContent()).join('\n\n');
    const header = `${activeSong.title}\n=======================\n\n`;
    const blob = new Blob([header + lyricsText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeSong.slug}-lyrics.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPowerPointFile = async () => {
    if (!activeSong) return;
    try {
      const pptxgen = (await import('pptxgenjs')).default;
      const pptx = new pptxgen();
      pptx.layout = 'LAYOUT_16x9';

      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: '173C4E' };
      
      const cleanedTitle = activeSong.language === 'sunday_telugu' 
        ? cleanTeluguTitle(activeSong.title) 
        : activeSong.title;

      titleSlide.addText(cleanedTitle, {
        x: 0.5,
        y: 2.2,
        w: 12.3,
        h: 2.5,
        align: 'center',
        fontFace: 'Arial',
        fontSize: 44,
        color: 'FFFFFF',
        bold: true,
      });

      const lyricsText = getActiveLyricsContent();
      const slides = getSlides(lyricsText);

      slides.forEach((stanza) => {
        const lyricSlide = pptx.addSlide();
        lyricSlide.background = { color: '173C4E' };
        lyricSlide.addText(stanza, {
          x: 0.5,
          y: 1.0,
          w: 12.3,
          h: 5.5,
          align: 'center',
          fontFace: 'Arial',
          fontSize: 32,
          color: 'FFFFFF',
          lineSpacing: 44,
        });
      });

      pptx.writeFile({ fileName: `${activeSong.slug}.pptx` });
    } catch (error) {
      console.error("Error generating PowerPoint:", error);
      alert("Failed to generate PowerPoint file.");
    }
  };

  const activeContent = getActiveLyricsContent();

  // RENDER INDEX VIEW
  if (viewState === 'index') {
    return (
      <div className="min-h-screen bg-[#FADADD] py-8 px-4 md:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Title with Back Link */}
          <div className="flex flex-col gap-4">
            <div>
              <Link 
                href="/sunday-school" 
                className="inline-flex items-center text-[#D04A73] hover:text-[#A02C4E] font-bold text-sm transition-colors duration-200"
              >
                <span className="mr-2">&larr;</span> Back to Sunday School
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#D04A73] uppercase tracking-wide">
                Sunday School Songs
              </h1>
            </div>
          </div>



          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 md:p-8">
            
            {/* Top Navigation Tabs (2 Rows) */}
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 mb-6">
              {/* Row 1: Content Tabs */}
              <div className="flex flex-wrap gap-1 items-end">
                <button
                  onClick={() => { setViewTab('home'); }}
                  className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-colors ${
                    viewTab === 'home' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Home
                </button>
                <button
                  onClick={() => { setViewTab('telugu-songs'); }}
                  className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-colors ${
                    viewTab === 'telugu-songs' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Telugu Songs
                </button>
                <button
                  onClick={() => { setViewTab('hindi-songs'); }}
                  className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-colors ${
                    viewTab === 'hindi-songs' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Hindi Songs
                </button>
                <button
                  onClick={() => { setViewTab('english-songs'); }}
                  className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-colors ${
                    viewTab === 'english-songs' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  English Songs
                </button>
                <button
                  onClick={() => { setViewTab('song-request'); }}
                  className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-colors ${
                    viewTab === 'song-request' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Song Request
                </button>
              </div>

              {/* Row 2: Index Tabs */}
              <div className="flex flex-wrap gap-1 items-end">
                <button
                  onClick={() => { setViewTab('telugu-index'); selectKeyboardLanguage('telugu'); }}
                  className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-colors ${
                    viewTab === 'telugu-index' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Telugu Index
                </button>

                <button
                  onClick={() => { setViewTab('english-index'); selectKeyboardLanguage('english'); }}
                  className={`px-5 py-2.5 rounded-t-xl text-xs font-bold transition-colors ${
                    viewTab === 'english-index' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  English Index
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                <div className="w-10 h-10 border-4 border-[#FF99BE] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold">Loading Sunday School songs...</p>
              </div>
            ) : viewTab === 'song-request' ? (
              <div className="max-w-2xl mx-auto py-4 animate-fade-in">
                <div className="bg-[#FADADD] border border-[#FFC2D9]/60 rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#4D1C2C] mb-2">Request a Sunday School Song</h2>
                    <p className="text-sm text-gray-600 font-medium">
                      Let us know if there is a song you would like to see added to the Sunday School index.
                    </p>
                  </div>

                  {requestSubmitted ? (
                    <div className="text-center py-8 space-y-4 animate-fade-in text-gray-800">
                      <div className="w-16 h-16 bg-[#FFF0F3] border-2 border-[#FF99BE] rounded-full flex items-center justify-center mx-auto text-3xl">
                        🎉
                      </div>
                      <h3 className="text-xl font-bold text-[#4D1C2C]">Thank You!</h3>
                      <p className="text-sm text-gray-600 max-w-md mx-auto">
                        Your song request has been submitted successfully. Our Sunday School team will review and add it soon.
                      </p>
                      <button
                        onClick={() => setRequestSubmitted(false)}
                        className="px-6 py-2 bg-[#FF99BE] hover:bg-[#FF80AB] text-white font-bold rounded-xl transition-all shadow-sm shadow-[#FF99BE]/20 active:scale-95 text-sm"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestSubmit} className="space-y-4 text-sm text-gray-800">
                      {requestErrors.submit && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                          ⚠️ {requestErrors.submit}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">Your Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={requestForm.name}
                            onChange={e => {
                              setRequestForm(prev => ({ ...prev, name: e.target.value }));
                              if (requestErrors.name) setRequestErrors(prev => ({ ...prev, name: '' }));
                            }}
                            className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 bg-white text-gray-800 transition-colors ${
                              requestErrors.name
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-[#FF99BE] focus:ring-[#FF99BE]'
                            }`}
                          />
                          {requestErrors.name && (
                            <p className="text-xs text-red-500 font-semibold mt-1">{requestErrors.name}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">Song Title <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Enter song title"
                            value={requestForm.songTitle}
                            onChange={e => setRequestForm(prev => ({ ...prev, songTitle: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF99BE] focus:ring-1 focus:ring-[#FF99BE] transition-colors bg-white text-gray-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">Your Email <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            required
                            placeholder="yourname@example.com"
                            value={requestForm.email}
                            onChange={e => {
                              setRequestForm(prev => ({ ...prev, email: e.target.value }));
                              if (requestErrors.email) setRequestErrors(prev => ({ ...prev, email: '' }));
                            }}
                            className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 bg-white text-gray-800 transition-colors ${
                              requestErrors.email
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-[#FF99BE] focus:ring-[#FF99BE]'
                            }`}
                          />
                          {requestErrors.email && (
                            <p className="text-xs text-red-500 font-semibold mt-1">{requestErrors.email}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">Language <span className="text-red-500">*</span></label>
                          <select
                            value={requestForm.language}
                            onChange={e => setRequestForm(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#FF99BE] focus:ring-1 focus:ring-[#FF99BE] transition-colors text-gray-800"
                          >
                            <option value="telugu">Telugu</option>
                            <option value="hindi">Hindi</option>
                            <option value="english">English</option>
                            <option value="others">Others</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={requestForm.phone}
                          onChange={e => setRequestForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF99BE] focus:ring-1 focus:ring-[#FF99BE] transition-colors bg-white text-gray-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">Song Details / Lyrics / YouTube Link (Optional)</label>
                        <textarea
                          rows={4}
                          placeholder="Provide any details, lyrics or links to help us find the song..."
                          value={requestForm.details}
                          onChange={e => setRequestForm(prev => ({ ...prev, details: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF99BE] focus:ring-1 focus:ring-[#FF99BE] transition-colors resize-none bg-white text-gray-800"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={submittingRequest}
                          className="w-full py-3 bg-[#FF99BE] hover:bg-[#FF80AB] text-white font-bold rounded-xl transition-all shadow-md shadow-[#FF99BE]/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
                        >
                          {submittingRequest ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting...
                            </>
                          ) : (
                            "Submit Request"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div id="songs-top">
                {/* 1. Show Telugu Keyboard if Telugu Index is active */}
                {viewTab === 'telugu-index' && (
                  <div className="bg-[#FFF0F3] border-2 border-[#FFC2D9] rounded-2xl p-4 mb-8 max-w-3xl mx-auto shadow-inner">
                    <div className="grid grid-cols-10 sm:grid-cols-11 gap-1.5 keyboard-grid">
                      {teluguAlphabet.map((letter) => {
                        const hasSongs = filteredSongsList.some(s => getDynamicFirstLetter(s, 'telugu') === letter);
                        return (
                          <button
                            key={letter}
                            disabled={!hasSongs}
                            onClick={() => {
                              const el = document.getElementById(`letter-${letter}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`py-2 text-center rounded-lg text-sm font-semibold transition-all border ${
                              hasSongs
                                ? 'border-[#FFC2D9]/40 bg-white shadow-sm hover:border-[#FFC2D9] hover:bg-[#FFF0F3] text-[#A04A65] hover:text-[#4D1C2C] hover:shadow'
                                : 'border-transparent bg-transparent text-gray-300 cursor-not-allowed opacity-30'
                            }`}
                            style={{ fontFamily: 'var(--font-ramabhadra)', fontSize: '20px' }}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Show English Keyboard if English Index is active */}
                {viewTab === 'english-index' && (
                  <div className="bg-[#FFF0F3] border-2 border-[#FFC2D9] rounded-2xl p-4 mb-8 max-w-3xl mx-auto shadow-inner">
                    <div className="grid grid-cols-10 sm:grid-cols-11 gap-1.5 keyboard-grid">
                      {englishAlphabet.map((letter) => {
                        const hasSongs = filteredSongsList.some(s => getDynamicFirstLetter(s, 'english') === letter);
                        return (
                          <button
                            key={letter}
                            disabled={!hasSongs}
                            onClick={() => {
                              const el = document.getElementById(`letter-${letter}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`py-2 text-center rounded-lg text-sm font-semibold transition-all border ${
                              hasSongs
                                ? 'border-[#FFC2D9]/40 bg-white shadow-sm hover:border-[#FFC2D9] hover:bg-[#FFF0F3] text-[#A04A65] hover:text-[#4D1C2C] hover:shadow'
                                : 'border-transparent bg-transparent text-gray-300 cursor-not-allowed opacity-30'
                            }`}
                            style={{ fontSize: '18px' }}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Show Telugu Keyboard if Home tab is active */}
                {viewTab === 'home' && (
                  <div className="bg-[#FFF0F3] border-2 border-[#FFC2D9] rounded-2xl p-4 mb-8 max-w-3xl mx-auto shadow-inner">
                    <div className="grid grid-cols-10 sm:grid-cols-11 gap-1.5 keyboard-grid">
                      {teluguAlphabet.map((letter) => {
                        const hasSongs = filteredSongsList
                          .filter(s => s.language === 'sunday_telugu')
                          .some(s => getDynamicFirstLetter(s, 'telugu') === letter);
                        return (
                          <button
                            key={letter}
                            disabled={!hasSongs}
                            onClick={() => {
                              const el = document.getElementById(`letter-${letter}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`py-1.5 text-center rounded-lg text-sm font-semibold transition-all border ${
                              hasSongs
                                ? 'border-[#FFC2D9]/40 bg-white shadow-sm hover:border-[#FFC2D9] hover:bg-[#FFF0F3] text-[#A04A65] hover:text-[#4D1C2C] hover:shadow'
                                : 'border-transparent bg-transparent text-gray-300 cursor-not-allowed opacity-30'
                            }`}
                            style={{ fontFamily: 'var(--font-ramabhadra)', fontSize: '18px' }}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Render the songs lists */}
                {(() => {
                  let alphabetToUse = teluguAlphabet;
                  let letterLang: 'telugu' | 'english' | 'hindi' = 'telugu';

                  if (viewTab === 'english-songs' || viewTab === 'english-index') {
                    alphabetToUse = englishAlphabet;
                    letterLang = 'english';
                  } else if (viewTab === 'hindi-songs') {
                    alphabetToUse = hindiAlphabet;
                    letterLang = 'hindi';
                  } else if (viewTab === 'telugu-songs' || viewTab === 'telugu-index') {
                    alphabetToUse = teluguAlphabet;
                    letterLang = 'telugu';
                  }

                  // Home tab displays mixed lists (Telugu, Hindi, and English alphabets)
                  const isHomeTab = viewTab === 'home';
                  const alphabetsToGroup = isHomeTab ? [teluguAlphabet, hindiAlphabet, englishAlphabet] : [alphabetToUse];

                  return (
                    <>
                      {alphabetsToGroup.map((alphabet, aIdx) => {
                        let currentLang: 'telugu' | 'english' | 'hindi' = 'telugu';
                        if (isHomeTab) {
                          if (aIdx === 0) currentLang = 'telugu';
                          else if (aIdx === 1) currentLang = 'hindi';
                          else if (aIdx === 2) currentLang = 'english';
                        } else {
                          currentLang = 
                            (viewTab === 'hindi-songs') ? 'hindi' :
                            (viewTab === 'english-songs' || viewTab === 'english-index') ? 'english' : 
                            'telugu';
                        }
                        
                        return alphabet.map(letter => {
                          const targetLang = currentLang === 'telugu' ? 'sunday_telugu' :
                                             currentLang === 'english' ? 'sunday_english' : 'sunday_hindi';
                          const languageTargetedSongs = filteredSongsList.filter(s => s.language === targetLang);
                          const letterSongs = languageTargetedSongs.filter(s => getDynamicFirstLetter(s, currentLang) === letter);
                          if (letterSongs.length === 0) return null;
                          return (
                            <div key={`${letter}-${currentLang}`} id={`letter-${letter}`} className="mb-8 scroll-mt-24">
                              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
                                <span 
                                  className="text-4xl font-bold text-[#D04A73] leading-none" 
                                  style={{ 
                                    fontFamily: currentLang === 'telugu' ? 'var(--font-ramabhadra)' : 
                                                currentLang === 'hindi' ? 'sans-serif' : 'inherit' 
                                  }}
                                >
                                  {letter}
                                </span>
                                <span className="text-sm font-semibold text-gray-400 translate-y-[4px]">({letterSongs.length} songs)</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {letterSongs.map((song, idx) => (
                                  <button
                                    key={song.id}
                                    onClick={() => handleSelectSong(song)}
                                    className="song-btn text-left p-3 px-5 rounded-2xl border border-transparent hover:border-[#FFC2D9] bg-transparent hover:bg-[#FFF0F3] text-[#D04A73] hover:text-[#A02C4E] transition-all duration-200 flex gap-3 text-base items-center hover:shadow-sm w-full"
                                    style={{ 
                                      fontFamily: currentLang === 'telugu' ? 'var(--font-ramabhadra)' : 
                                                  currentLang === 'hindi' ? 'sans-serif' : 'inherit' 
                                    }}
                                  >
                                    <span className="text-xs font-mono font-medium opacity-65 pt-0.5">{idx + 1}.</span>
                                    <span className="leading-tight flex-1 truncate">
                                      {/* Only clean Title if it's the Telugu list and NOT the Home view */}
                                      {isHomeTab ? song.title : (song.language === 'sunday_telugu' ? cleanTeluguTitle(song.title) : song.title)}
                                    </span>
                                  </button>
                                ))}
                              </div>
                              <div className="text-right mt-4 pt-3 border-t border-gray-100">
                                <a
                                  href="#songs-searchbar"
                                  className="text-xs font-bold text-gray-400 hover:text-[#D04A73] transition-colors tracking-wider uppercase"
                                >
                                  Back to Top ↑
                                </a>
                              </div>
                            </div>
                          );
                        });
                      })}
                    </>
                  );
                })()}

              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  // RENDER LYRICS VIEW
  return (
    <div className="min-h-screen bg-[#FADADD] py-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200/80 flex flex-col md:flex-row min-h-[750px]">

        {/* Left column: Songs Index Search & List */}
        <div className="w-full md:w-[380px] border-r border-gray-200 p-6 flex flex-col flex-shrink-0 bg-[#FFFFFF]">
          
          <div className="mb-4">
            <button
              onClick={() => setViewState('index')}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFF0F3] hover:bg-[#FFE2EC] text-[#D04A73] font-bold text-xs transition-colors border border-[#FFC2D9]/40"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Index
            </button>
          </div>


          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div>
              <div className="text-[11px] text-[#D04A73] font-bold uppercase tracking-wider">
                Sunday School
              </div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-1.5 flex-wrap">
                For <span className="text-[#D04A73] text-3xl font-light">"</span>
                <span className="text-[#D04A73]" style={getHeaderLetterStyle(selectedLetter)}>{selectedLetter || 'All'}</span>
                <span className="text-[#D04A73] text-3xl font-light">"</span>
                <span className="text-sm text-gray-500 font-medium font-mono ml-0.5">
                  ({filteredSongsList.length} Songs)
                </span>
              </h2>
            </div>
            
            <div className="flex gap-2 relative" ref={letterPickerRef}>
              
              <button
                onClick={() => setViewMode(prev => prev === 'favorites' ? 'all' : 'favorites')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm ${
                  viewMode === 'favorites'
                    ? 'bg-[#FF99BE] text-white border-[#FF99BE] shadow-md shadow-[#FF99BE]/20'
                    : 'bg-white text-gray-400 hover:text-[#D04A73] hover:bg-[#FFF0F3] border-gray-200'
                }`}
                title={viewMode === 'favorites' ? "Show All Songs" : "Show Favorites Only"}
              >
                <svg className="w-6 h-6" fill={viewMode === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button 
                onClick={() => setIsLetterPickerOpen(!isLetterPickerOpen)}
                className="w-12 h-12 rounded-full bg-[#FFF0F3] hover:bg-[#FFE2EC] text-[#D04A73] font-bold flex items-center justify-center transition-all border border-[#FFC2D9]/50 shadow-sm"
                title="Select Letter"
                style={getButtonLetterStyle(selectedLetter)}
              >
                {selectedLetter || 'A'}
              </button>

              {isLetterPickerOpen && (
                <div className="absolute right-0 top-14 bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 w-72 z-40 max-h-96 overflow-y-auto">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Choose Letter</h4>

                  <div className="flex justify-between gap-1 mb-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                      onClick={() => selectKeyboardLanguage('telugu')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        keyboardLanguage === 'telugu' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Telugu
                    </button>
                    <button
                      onClick={() => selectKeyboardLanguage('hindi')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        keyboardLanguage === 'hindi' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Hindi
                    </button>
                    <button
                      onClick={() => selectKeyboardLanguage('english')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        keyboardLanguage === 'english' ? 'bg-[#FF99BE] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      English
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedLetter('');
                      setLastSelectedLetter('');
                      setIsLetterPickerOpen(false);
                    }}
                    className="w-full py-2 mb-3 text-center rounded-xl text-xs font-bold bg-gray-100 hover:bg-[#FFF0F3] hover:text-[#D04A73] border border-gray-200/50 transition-all text-gray-700 block"
                  >
                    Clear Filter / Show All
                  </button>

                  <div className="grid grid-cols-6 gap-1.5 keyboard-grid">
                    {activeAlphabet.map((letter) => {
                      const count = letterAvailability[letter] || 0;
                      const hasSongs = count > 0;
                      return (
                        <button
                          key={letter}
                          disabled={!hasSongs}
                          onClick={() => {
                            if (selectedLetter === letter) {
                              setSelectedLetter('');
                              setLastSelectedLetter('');
                            } else {
                              setSelectedLetter(letter);
                              setLastSelectedLetter(letter);
                            }
                            setIsLetterPickerOpen(false);
                          }}
                          className={`py-1 text-center rounded-lg text-sm font-normal transition-all ${
                            selectedLetter === letter
                              ? 'bg-[#FF99BE] text-white scale-110 shadow-md shadow-[#FF99BE]/30 font-semibold'
                              : hasSongs
                              ? 'bg-gray-100 text-gray-800 hover:bg-[#FFF0F3] hover:text-[#D04A73] border border-gray-200/50'
                              : 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-40'
                          }`}
                          style={getLetterStyle(letter)}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {viewMode === 'categories' && (
            <div className="mb-4 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
              {categories
                .filter(cat => ALLOWED_CATEGORIES.some(allowedName => allowedName.toLowerCase() === (cat.name || '').trim().toLowerCase()))
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-[#FF99BE] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              }
            </div>
          )}

          {/* Sidebar song list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[500px] md:max-h-[none]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <div className="w-8 h-8 border-4 border-[#FF99BE] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold">Loading songs...</p>
              </div>
            ) : filteredSongsList.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No songs match the current selection.
              </div>
            ) : (
              filteredSongsList.map((song, idx) => (
                <button
                  key={song.id}
                  onClick={() => {
                    setActiveSong(song);
                    determineDefaultLyricsTab(song);
                  }}
                  className={`song-btn w-full text-left p-3.5 rounded-2xl transition-all duration-200 border flex gap-3 text-base items-start ${
                    activeSong?.id === song.id
                      ? 'bg-[#FFF0F3] border-[#FFC2D9] text-[#D04A73] font-bold shadow-sm shadow-[#FF99BE]/10'
                      : 'bg-[#FCFDFF] border-gray-100 hover:bg-gray-50 text-gray-700 hover:border-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-ramabhadra)' }}
                >
                  <span className="text-xs font-mono font-medium opacity-65 pt-0.5">{idx + 1}.</span>
                  <span className="leading-tight flex-1">
                    {song.language === 'sunday_telugu' ? cleanTeluguTitle(song.title) : song.title}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right column: Lyrics Viewer with toolbar */}
        <div className="flex-1 p-6 md:p-8 flex flex-col bg-[#FCFDFF]">
          
          {activeSong ? (
            <>
              {/* Interaction Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-6">
                
                {/* Font Size Adjusters */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-100 rounded-xl p-1 shadow-inner border border-gray-200/50">
                  <span className="pl-2 pr-1">Font Size :</span>
                  <button 
                    onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                    className="w-7 h-7 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 font-extrabold flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all text-sm"
                  >
                    &mdash;
                  </button>
                  <button 
                    onClick={() => setFontSize(18)}
                    className="px-2.5 h-7 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all text-[11px]"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
                    className="w-7 h-7 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 font-extrabold flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Toolbar Buttons */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-600">
                  <div className="relative group">
                    <button
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm transition-all"
                    >
                      <span>☁</span> Download
                    </button>
                    
                    <div className="absolute right-0 top-8 bg-white border border-gray-200/80 rounded-xl shadow-xl py-1 w-60 hidden group-hover:block z-40">
                      <button
                        onClick={downloadLyricsFile}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-xs transition-colors"
                      >
                        As Text File (.txt)
                      </button>
                      <button
                        onClick={downloadPowerPointFile}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-xs border-t border-gray-100 transition-colors"
                      >
                        As PowerPoint (.pptx)
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-xs border-t border-gray-100 transition-colors"
                      >
                        Print / Save PDF
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Title Header with Favorite Heart button */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 
                    className="text-2xl md:text-3xl font-normal text-[#D04A73] leading-tight"
                    style={{ fontFamily: 'var(--font-ramabhadra)' }}
                  >
                    {activeSong.title}
                  </h1>
                  
                  {activeSong.categories && activeSong.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeSong.categories.map(c => (
                        <span key={c.id} className="bg-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => toggleFavorite(activeSong.slug)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    favorites.includes(activeSong.slug)
                      ? 'bg-[#FFF0F3] text-[#D04A73] border-[#FFC2D9] shadow-sm'
                      : 'bg-white text-gray-400 hover:text-[#D04A73] hover:bg-[#FFF0F3] border-gray-200'
                  }`}
                  title={favorites.includes(activeSong.slug) ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <svg className="w-6 h-6" fill={favorites.includes(activeSong.slug) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Language Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-6 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                {activeSong.telugu_lyrics && (
                  <button
                    onClick={() => setActiveLyricsTab('telugu')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLyricsTab === 'telugu'
                        ? 'bg-white text-[#D04A73] shadow-sm border border-[#FF99BE]/20 font-extrabold'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Telugu Lyrics
                  </button>
                )}
                {activeSong.english_lyrics && (
                  <button
                    onClick={() => setActiveLyricsTab('english')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLyricsTab === 'english'
                        ? 'bg-white text-[#D04A73] shadow-sm border border-[#FF99BE]/20 font-extrabold'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    English Lyrics
                  </button>
                )}
                {activeSong.hindi_lyrics && (
                  <button
                    onClick={() => setActiveLyricsTab('hindi')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLyricsTab === 'hindi'
                        ? 'bg-white text-[#D04A73] shadow-sm border border-[#FF99BE]/20 font-extrabold'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Hindi Lyrics
                  </button>
                )}
              </div>

              {/* Lyrics Content Render */}
              <div 
                ref={lyricsContainerRef}
                className="flex-1 overflow-y-auto bg-gray-50/30 rounded-2xl p-6 md:p-8 border border-gray-100 print-lyrics"
                style={{ fontSize: `${fontSize}px` }}
              >
                {activeContent ? (
                  <div 
                    className="prose max-w-none text-gray-800 leading-relaxed select-text [&_p]:mb-5 [&_p]:leading-normal [&_p_br]:mb-0 [&_br]:mb-0 print:text-black"
                    style={{ fontFamily: 'var(--font-mandali)' }}
                    dangerouslySetInnerHTML={{ __html: formatLyrics(activeContent) }}
                  />
                ) : (
                  <div className="text-gray-400 italic text-sm py-12 text-center">
                    No lyrics content available in this tab.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-400">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-1">Choose Song To View The Lyrics</h3>
              <p className="text-sm text-gray-500 max-w-sm">Select a song from the index list on the left to display its lyrics here.</p>
            </div>
          )}

        </div>

      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-lyrics, .print-lyrics * {
            visibility: visible;
          }
          .print-lyrics {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            border: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function SundaySchoolSongsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FADADD] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 w-80">
          <div className="w-12 h-12 border-4 border-[#FF99BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Lyrics Index...</p>
        </div>
      </div>
    }>
      <SundaySchoolSongsDashboard />
    </Suspense>
  );
}

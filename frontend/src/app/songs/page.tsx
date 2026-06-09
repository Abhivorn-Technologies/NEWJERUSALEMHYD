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

  // 1. If we want an English letter index
  if (kbLang === 'english') {
    // Check if there is English text in parentheses first (transliterated title)
    const parenMatch = title.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1]) {
      const engText = parenMatch[1].trim();
      const firstChar = engText.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) return firstChar;
    }
    
    // Otherwise, see if the main title starts with an English character
    const cleanTitle = title.replace(/^[🎵📖⛪🙏\s\-\/\(\)]+/, '');
    const firstChar = cleanTitle.charAt(0).toUpperCase();
    if (/[A-Z]/.test(firstChar)) return firstChar;

    // If the song is in Telugu and has no English in title,
    // map Telugu letters to English starting letters
    const teluguToEnglishMap: Record<string, string> = {
      'అ': 'A', 'ఆ': 'A', 'ఇ': 'I', 'ఈ': 'I', 'ఉ': 'U', 'ఊ': 'U', 'ఋ': 'R',
      'ఎ': 'E', 'ఏ': 'E', 'ఐ': 'I', 'ఒ': 'O', 'ఓ': 'O', 'ఔ': 'O',
      'క': 'K', 'ఖ': 'K', 'గ': 'G', 'ఘ': 'G', 'చ': 'C', 'ఛ': 'C', 'జ': 'J', 'ఝ': 'J',
      'ట': 'T', 'ఠ': 'T', 'డ': 'D', 'ఢ': 'D', 'ణ': 'N', 'త': 'T', 'థ': 'T', 'ద': 'D', 'ధ': 'D',
      'న': 'N', 'ప': 'P', 'ఫ': 'P', 'బ': 'B', 'భ': 'B', 'మ': 'M', 'య': 'Y', 'ర': 'R', 'ల': 'L',
      'వ': 'V', 'శ': 'S', 'ష': 'S', 'స': 'S', 'హ': 'H', 'ళ': 'L', 'క్ష': 'K', 'ఱ': 'R'
    };
    
    const firstCharTelugu = cleanTitle.charAt(0);
    if (teluguToEnglishMap[firstCharTelugu]) {
      return teluguToEnglishMap[firstCharTelugu];
    }

    return '#';
  }

  // 2. If we want a Telugu letter index (kbLang === 'telugu' or 'hindi')
  if (kbLang === 'telugu' || kbLang === 'hindi') {
    const cleanTitle = title.replace(/^[🎵📖⛪🙏\s\-\/\(\)]+/, '');
    if (!cleanTitle) return '#';

    // If the title starts with a Telugu character, use it
    const firstChar = cleanTitle.charAt(0);
    if (/[\u0C00-\u0C7F]/.test(firstChar)) {
      return firstChar;
    }

    // If the title starts with Hindi character (Devanagari)
    if (/[\u0900-\u097F]/.test(firstChar)) {
      const hindiToTeluguMap: Record<string, string> = {
        'अ': 'అ', 'आ': 'ఆ', 'इ': 'ఇ', 'ई': 'ఈ', 'उ': 'ఉ', 'ऊ': 'ఊ',
        'ए': 'ఎ', 'ऐ': 'ఐ', 'ओ': 'ఒ', 'औ': 'ఔ',
        'क': 'క', 'ख': 'ఖ', 'ग': 'గ', 'घ': 'ఘ',
        'च': 'చ', 'छ': 'ఛ', 'ज': 'జ', 'झ': 'ఝ',
        'ट': 'ట', 'ठ': 'ఠ', 'ड': 'డ', 'ढ': 'ఢ', 'ण': 'ణ',
        'त': 'త', 'थ': 'థ', 'द': 'ద', 'ध': 'ధ', 'न': 'న',
        'प': 'ప', 'ఫ': 'ఫ', 'ब': 'బ', 'भ': 'భ', 'म': 'మ',
        'य': 'య', 'र': 'ర', 'ल': 'ల', 'व': 'వ',
        'श': 'శ', 'ष': 'ష', 'स': 'స', 'ह': 'హ', 'ळ': 'ళ', 'क्ष': 'క్ష'
      };
      if (hindiToTeluguMap[firstChar]) return hindiToTeluguMap[firstChar];
      return firstChar;
    }

    // If the title starts with an English character but we want Telugu/Hindi index,
    // try to find a Telugu/Hindi title inside parentheses
    const parenMatch = title.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1]) {
      const telText = parenMatch[1].trim();
      const parenFirstChar = telText.charAt(0);
      if (/[\u0C00-\u0C7F]/.test(parenFirstChar)) return parenFirstChar;
      
      if (/[\u0900-\u097F]/.test(parenFirstChar)) {
        const hindiToTeluguMap: Record<string, string> = {
          'अ': 'అ', 'आ': 'ఆ', 'इ': 'ఇ', 'ई': 'ఈ', 'उ': 'ఉ', 'ऊ': 'ఊ',
          'ए': 'ఎ', 'ऐ': 'ఐ', 'ओ': 'ఒ', 'औ': 'ఔ',
          'क': 'క', 'ख': 'ఖ', 'ग': 'గ', 'घ': 'ఘ',
          'च': 'చ', 'छ': 'ఛ', 'ज': 'జ', 'झ': 'ఝ',
          'ट': 'ట', 'ठ': 'ఠ', 'ड': 'డ', 'ढ': 'ఢ', 'ण': 'ణ',
          'त': 'త', 'थ': 'థ', 'द': 'ద', 'ध': 'ధ', 'न': 'న',
          'प': 'ప', 'ఫ': 'ఫ', 'ब': 'బ', 'भ': 'భ', 'म': 'మ',
          'य': 'య', 'र': 'ర', 'ल': 'ల', 'व': 'వ',
          'श': 'శ', 'ष': 'ష', 'स': 'స', 'ह': 'హ', 'ळ': 'ళ', 'क्ष': 'క్ష'
        };
        if (hindiToTeluguMap[parenFirstChar]) return hindiToTeluguMap[parenFirstChar];
        return parenFirstChar;
      }
    }

    // Fallback: map English to Telugu characters
    const englishToTeluguMap: Record<string, string> = {
      'A': 'అ', 'B': 'బ', 'C': 'చ', 'D': 'ద', 'E': 'ఎ', 'F': 'ఫ', 'G': 'గ',
      'H': 'హ', 'I': 'ఇ', 'J': 'జ', 'K': 'క', 'L': 'ల', 'M': 'మ', 'N': 'న',
      'O': 'ఒ', 'P': 'ప', 'Q': 'క', 'R': 'ర', 'S': 'స', 'T': 'త', 'U': 'ఉ',
      'V': 'వ', 'W': 'వ', 'X': 'క్ష', 'Y': 'య', 'Z': 'జ'
    };
    const firstCharUpper = cleanTitle.charAt(0).toUpperCase();
    if (englishToTeluguMap[firstCharUpper]) {
      return englishToTeluguMap[firstCharUpper];
    }

    return '#';
  }

  return song.first_letter || '#';
};

const cleanTeluguTitle = (title: string) => {
  if (!title) return '';
  // Split by '/' if it exists
  let clean = title.split('/')[0].trim();
  
  // Find any trailing parenthesis
  const match = clean.match(/\s*\(([^)]*)\)\s*$/);
  if (match) {
    const inside = match[1];
    // If inside contains any English characters (A-Z or a-z), remove the parentheses
    if (/[a-zA-Z]/.test(inside)) {
      clean = clean.replace(/\s*\([^)]*\)\s*$/, '').trim();
    }
  }
  return clean;
};

function LyricsDashboard() {
  const searchParams = useSearchParams();
  
  // URL Query Parameters
  const initialLanguage = (searchParams.get('language') || 'all') as Song['language'];
  
  // App States
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<SongCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchVal, setSearchVal] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [lastSelectedLetter, setLastSelectedLetter] = useState<string>('');
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  
  // Filter settings
  const [language, setLanguage] = useState<Song['language']>(initialLanguage);
  const isSundaySchool = language === 'sunday_telugu' || language === 'sunday_english' || language === 'sunday_hindi';
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'categories' | 'favorites'>('all');
  
  // ViewState: 'index' shows the alphabet grid, 'lyrics' shows the side-by-side lyrics reader
  const [viewState, setViewState] = useState<'index' | 'lyrics'>('index');
  
  // Interaction states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState<number>(18);
  const [showChords, setShowChords] = useState<boolean>(false);
  const [activeLyricsTab, setActiveLyricsTab] = useState<'telugu' | 'english' | 'hindi' | 'ppt'>('telugu');

  // Keyboard language state for 'all' songs page
  const [keyboardLanguage, setKeyboardLanguage] = useState<'telugu' | 'english' | 'hindi'>('telugu');
  const [viewTab, setViewTab] = useState<'home' | 'telugu-index' | 'english-index'>('home');

  const getAlphabetForLang = (lang: string, kbLang: 'telugu' | 'english' | 'hindi') => {
    if (lang === 'sunday_english') {
      if (kbLang === 'telugu') return teluguAlphabet;
      return englishAlphabet;
    }
    if (lang === 'sunday_telugu') {
      if (kbLang === 'english') return englishAlphabet;
      return teluguAlphabet;
    }
    if (lang === 'sunday_hindi') {
      if (kbLang === 'english') return englishAlphabet;
      return teluguAlphabet;
    }
    if (lang === 'all') {
      if (kbLang === 'english') return englishAlphabet;
      if (kbLang === 'hindi') return hindiAlphabet;
      return teluguAlphabet;
    }
    return teluguAlphabet;
  };

  const selectKeyboardLanguage = (kbLang: 'telugu' | 'english' | 'hindi') => {
    setKeyboardLanguage(kbLang);
    const alphabet = getAlphabetForLang(language, kbLang);
    const firstLetterWithSongs = alphabet.find(l => songs.some(s => getDynamicFirstLetter(s, kbLang) === l));
    setSelectedLetter(firstLetterWithSongs || '');
    setLastSelectedLetter(firstLetterWithSongs || '');
  };
  
  // Popups/Modals
  const [isLetterPickerOpen, setIsLetterPickerOpen] = useState<boolean>(false);
  const [isFullscreenSlideshow, setIsFullscreenSlideshow] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  
  const letterPickerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  const getLetterStyle = (l: string) => {
    return { 
      fontFamily: 'var(--font-ramabhadra), sans-serif',
      fontSize: l && /[\u0C00-\u0C7F]/.test(l) ? '34px' : '22px',
      lineHeight: '1'
    };
  };

  const getHeaderLetterStyle = (l: string) => {
    return { 
      fontFamily: 'var(--font-ramabhadra), sans-serif',
      fontSize: l && /[\u0C00-\u0C7F]/.test(l) ? '52px' : '32px',
      lineHeight: '1',
      verticalAlign: 'middle'
    };
  };

  const getButtonLetterStyle = (l: string) => {
    return { 
      fontFamily: 'var(--font-ramabhadra), sans-serif',
      fontSize: l && /[\u0C00-\u0C7F]/.test(l) ? '38px' : '24px',
      lineHeight: '1',
      paddingTop: l && /[\u0C00-\u0C7F]/.test(l) ? '2px' : '0px'
    };
  };

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    if (val.trim().length > 0) {
      setSelectedLetter(''); // clear letter filter to search all songs
    } else {
      // Restore last selected letter, or default letter if none was selected
      if (lastSelectedLetter) {
        setSelectedLetter(lastSelectedLetter);
      } else {
        const alphabet = getAlphabetForLang(language, keyboardLanguage);
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
      const saved = localStorage.getItem('njm_favorite_songs');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Sync favorites with localStorage
  const toggleFavorite = (slug: string) => {
    let updated = [...favorites];
    if (updated.includes(slug)) {
      updated = updated.filter(s => s !== slug);
    } else {
      updated.push(slug);
    }
    setFavorites(updated);
    localStorage.setItem('njm_favorite_songs', JSON.stringify(updated));
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

  // Sync language with URL query param if changed
  useEffect(() => {
    const langParam = searchParams.get('language') as Song['language'];
    if (langParam && langParam !== language) {
      setLanguage(langParam);
      setViewMode('all');
      setSelectedCategorySlug('');
      setSelectedLetter('');
      setLastSelectedLetter('');
      setSearchVal('');
      setViewState('index');
    }
  }, [searchParams]);

  // Load songs whenever language changes
  useEffect(() => {
    setLoading(true);
    setSelectedLetter('');
    setLastSelectedLetter('');
    setSearchVal('');
    
    let defaultKbLang: 'telugu' | 'english' | 'hindi' = 'telugu';
    if (language === 'sunday_english') {
      defaultKbLang = 'english';
    }
    setKeyboardLanguage(defaultKbLang);
    
    fetch(`${baseUrl}/songs/?language=${language}`)
      .then(res => res.json())
      .then((data: Song[]) => {
        const normalized = data.map(song => {
          let fl = song.first_letter;
          if (!fl || fl === '#') {
            const title = song.title || '';
            fl = title.trim().charAt(0).toUpperCase() || '#';
          }
          if (language === 'sunday_english' || language === 'all') {
            fl = fl.toUpperCase();
          }
          return { ...song, first_letter: fl || '#' };
        });
        setSongs(normalized);
        
        // Default select the first alphabet with songs
        if (normalized.length > 0) {
          const alphabet = getAlphabetForLang(language, defaultKbLang);
          const firstLetterWithSongs = alphabet.find(l => normalized.some(s => getDynamicFirstLetter(s, defaultKbLang) === l));
          
          if (firstLetterWithSongs) {
            setSelectedLetter(firstLetterWithSongs);
            setLastSelectedLetter(firstLetterWithSongs);
          } else {
            const fallbackLetter = getDynamicFirstLetter(normalized[0], defaultKbLang);
            setSelectedLetter(fallbackLetter);
            setLastSelectedLetter(fallbackLetter);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading songs:", err);
        setLoading(false);
      });
  }, [language]);

  // Load categories
  useEffect(() => {
    fetch(`${baseUrl}/categories/`)
      .then(res => res.json())
      .then((data: SongCategory[]) => {
        setCategories(data);
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

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
    
    // Automatically match the sidebar keyboard language and letter filter to the selected song
    const songLang = (song.language === 'english' || song.language === 'sunday_english') ? 'english' : 
                     (song.language === 'hindi' || song.language === 'sunday_hindi') ? 'hindi' : 'telugu';
    setKeyboardLanguage(songLang);
    
    const fl = getDynamicFirstLetter(song, songLang);
    setSelectedLetter(fl);
    setLastSelectedLetter(fl);
    
    setViewState('lyrics');
  };

  // Keyboard navigation for Slideshow mode
  useEffect(() => {
    if (!isFullscreenSlideshow || !activeSong) return;
    
    const activeContent = getActiveLyricsContent();
    const slides = getSlides(activeContent);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsFullscreenSlideshow(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenSlideshow, activeSong, activeLyricsTab, showChords]);

  const activeAlphabet = getAlphabetForLang(language, keyboardLanguage);

  // Filter songs based on current filters
  // Base filtered songs (without selectedLetter filter)
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

    // Tab/Keyboard language separation on main page (when language is 'all')
    if (language === 'all') {
      if (viewState === 'index') {
        if (viewTab === 'home' || viewTab === 'telugu-index') {
          if (selectedCategorySlug === 'hindi') {
            result = result.filter(s => s.language === 'hindi' || s.language === 'sunday_hindi');
          } else {
            result = result.filter(s => s.language === 'telugu' || s.language === 'sunday_telugu');
          }
        } else if (viewTab === 'english-index') {
          result = result.filter(s => s.language === 'english' || s.language === 'sunday_english');
        }
      } else if (viewState === 'lyrics') {
        if (keyboardLanguage === 'telugu') {
          if (selectedCategorySlug === 'hindi') {
            result = result.filter(s => s.language === 'hindi' || s.language === 'sunday_hindi');
          } else {
            result = result.filter(s => s.language === 'telugu' || s.language === 'sunday_telugu');
          }
        } else if (keyboardLanguage === 'english') {
          result = result.filter(s => s.language === 'english' || s.language === 'sunday_english');
        } else if (keyboardLanguage === 'hindi') {
          result = result.filter(s => s.language === 'hindi' || s.language === 'sunday_hindi');
        }
      }
    }

    return result;
  };

  // Filter songs based on current filters
  const getFilteredSongs = (): Song[] => {
    let result = getBaseFilteredSongs();

    // Letter filter
    if (selectedLetter && viewState === 'lyrics') {
      result = result.filter(s => getDynamicFirstLetter(s, keyboardLanguage) === selectedLetter);
    }

    return result;
  };

  const filteredSongsList = getFilteredSongs();

  // Find letter counts for the active configuration
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

  // Clean raw HTML or plain text
  const formatLyrics = (htmlContent: string) => {
    if (!htmlContent) return '';
    let content = htmlContent.trim();
    
    // Convert plain text newlines to HTML breaks if no tags are present
    if (!/<p>|<br\s*\/?>/i.test(content)) {
      content = content.replace(/\r?\n/g, '<br />');
    } else {
      // Standardize spacing to prevent double vertical line gaps
      content = content
        .replace(/(<br\s*\/?>)\s*\n/gi, '$1')
        .replace(/(<\/p>)\s*\n/gi, '$1')
        .replace(/(<p>)\s*\n/gi, '$1');
    }
    
    return content;
  };

  // Get active tab lyrics
  const getActiveLyricsContent = (): string => {
    if (!activeSong) return '';
    
    if (showChords && activeSong.chords && activeSong.chords.trim().length > 0) {
      return activeSong.chords;
    }

    switch (activeLyricsTab) {
      case 'telugu': return activeSong.telugu_lyrics || '';
      case 'english': return activeSong.english_lyrics || '';
      case 'hindi': return activeSong.hindi_lyrics || '';
      case 'ppt': return activeSong.powerpoint_slides || '';
      default: return activeSong.telugu_lyrics || '';
    }
  };

  // Parse HTML into clean slides
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

  // Download Lyrics as .txt File
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

  // Download Lyrics as .pptx File
  const downloadPowerPointFile = async () => {
    if (!activeSong) return;
    try {
      const pptxgen = (await import('pptxgenjs')).default;
      const pptx = new pptxgen();

      // Configure layout (16:9 widescreen)
      pptx.layout = 'LAYOUT_16x9';

      // 1. Title Slide
      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: '173C4E' }; // Dark Teal background
      
      const cleanedTitle = activeSong.language === 'telugu' || activeSong.language === 'sunday_telugu' 
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

      // 2. Lyrics Slides
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

      // Write / Save File
      pptx.writeFile({ fileName: `${activeSong.slug}.pptx` });
    } catch (error) {
      console.error("Error generating PowerPoint:", error);
      alert("Failed to generate PowerPoint file.");
    }
  };

  const getLanguageLabel = (lang: Song['language']) => {
    switch (lang) {
      case 'all': return 'All Songs';
      case 'telugu': return 'Telugu Songs';
      case 'sunday_telugu': return 'Sunday School Telugu Songs';
      case 'sunday_english': return 'Sunday School English Songs';
      case 'sunday_hindi': return 'Sunday School Hindi Songs';
      default: return 'Songs';
    }
  };

  const getSundaySchoolLabel = (lang: Song['language']) => {
    switch (lang) {
      case 'sunday_telugu': return 'Telugu Songs';
      case 'sunday_english': return 'English Songs';
      case 'sunday_hindi': return 'Hindi Songs';
      default: return 'Songs';
    }
  };

  const activeContent = getActiveLyricsContent();

  // RENDER ALPHABETICAL INDEX VIEW
  if (viewState === 'index') {
    return (
      <div className="min-h-screen bg-[#e0f2f1] py-8 px-4 md:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Title */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-[#5795A7] uppercase tracking-wide">
              {isSundaySchool 
                ? getSundaySchoolLabel(language).toUpperCase()
                : getLanguageLabel(language)}
            </h1>
          </div>

          {/* Search Box with Category Dropdown on the right side */}
          <div id="songs-searchbar" className="flex max-w-2xl mx-auto items-center relative scroll-mt-24" ref={categoryDropdownRef}>
            <div className="flex flex-1 items-center bg-white rounded-2xl border-2 border-[#5795A7] focus-within:ring-2 focus-within:ring-[#5795A7]/20 transition-all overflow-hidden h-[46px]">
              
              {/* Search Icon on the left */}
              <div className="pl-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Text Input */}
              <div className="relative flex-grow h-full flex items-center">
                <input
                  type="text"
                  placeholder={selectedCategorySlug 
                    ? `Search in ${categories.find(c => c.slug === selectedCategorySlug)?.name || 'Category'}...` 
                    : "Search songs by lyrics/title..."
                  }
                  value={searchVal}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-3 pr-10 focus:outline-none text-gray-700 text-sm placeholder-gray-400 bg-transparent h-full py-2"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5795A7] font-bold p-1 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Vertical Divider line */}
              <div className="h-6 w-[1.5px] bg-gray-200"></div>

              {/* Category Dropdown Button on the right side */}
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="bg-[#5795A7] text-white px-5 h-full flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors min-w-[170px] justify-between"
              >
                <span className="truncate max-w-[130px]">
                  {selectedCategorySlug 
                    ? (categories.find(c => c.slug === selectedCategorySlug)?.name || 'Category') 
                    : 'All Categories'
                  }
                </span>
                <span className="text-[10px]">
                  {isCategoryDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
            </div>

            {/* Dropdown Options List */}
            {isCategoryDropdownOpen && (
              <div className="absolute right-0 top-[50px] w-64 bg-white border border-gray-200 shadow-2xl rounded-2xl py-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('all');
                    setSelectedCategorySlug('');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-colors border-b border-gray-100 ${
                    !selectedCategorySlug 
                      ? 'bg-[#e8f1f3] text-[#5795A7]' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ALL CATEGORIES
                </button>
                {categories
                  .filter(cat => ALLOWED_CATEGORIES.some(allowedName => allowedName.toLowerCase() === (cat.name || '').trim().toLowerCase()))
                  .map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setViewMode('categories');
                        setSelectedCategorySlug(cat.slug);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-xs font-semibold transition-colors ${
                        selectedCategorySlug === cat.slug 
                          ? 'bg-[#e8f1f3] text-[#5795A7]' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))
                }
              </div>
            )}
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 md:p-8">
            
            {/* Tab Bar Selector */}
            {isSundaySchool ? (
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-px mb-6 items-end">
                {/* HOME Tab */}
                <Link
                  href="/sunday-school/songs"
                  className="px-6 py-2.5 bg-white border-t border-x border-gray-200 text-gray-800 font-bold rounded-t-xl text-sm z-10 relative -mb-[2px] shadow-sm uppercase tracking-wider transition-colors hover:bg-gray-50"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  HOME
                </Link>
                
                {/* Telugu Index Button */}
                <button
                  onClick={() => selectKeyboardLanguage('telugu')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    keyboardLanguage === 'telugu'
                      ? 'bg-[#5795A7] border-[#5795A7] text-white shadow-md shadow-[#5795A7]/20'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Telugu Index
                </button>

                {/* English Index Button */}
                <button
                  onClick={() => selectKeyboardLanguage('english')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    keyboardLanguage === 'english'
                      ? 'bg-[#5795A7] border-[#5795A7] text-white shadow-md shadow-[#5795A7]/20'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  English Index
                </button>
              </div>
            ) : (
              <div className="flex gap-1 border-b border-gray-200 pb-px mb-6">
                <button
                  onClick={() => { setLanguage('all'); setViewTab('home'); selectKeyboardLanguage('telugu'); }}
                  className={`px-6 py-2.5 rounded-t-xl text-sm font-bold transition-colors ${
                    viewTab === 'home' ? 'bg-[#5795A7] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => { setLanguage('all'); setViewTab('telugu-index'); selectKeyboardLanguage('telugu'); }}
                  className={`px-6 py-2.5 rounded-t-xl text-sm font-bold transition-colors ${
                    viewTab === 'telugu-index' ? 'bg-[#5795A7] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Telugu Index
                </button>
                <button
                  onClick={() => { setLanguage('all'); setViewTab('english-index'); selectKeyboardLanguage('english'); }}
                  className={`px-6 py-2.5 rounded-t-xl text-sm font-bold transition-colors ${
                    viewTab === 'english-index' ? 'bg-[#5795A7] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  English Index
                </button>
              </div>
            )}

            {/* HOME VIEW: All songs grouped by Telugu letter, 2 columns, back-to-top, WITH TELUGU KEYBOARD */}
            {viewTab === 'home' && !isSundaySchool && (
              loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                  <div className="w-10 h-10 border-4 border-[#5795A7] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold">Loading songs list...</p>
                </div>
              ) : (
                <div id="songs-top">
                  {/* Premium tactile keyboard for navigation */}
                  <div className="bg-[#eef5f6] border-2 border-[#bcd3d8] rounded-2xl p-4 mb-8 max-w-3xl mx-auto shadow-inner">
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
                                ? 'border-[#bcd3d8]/40 bg-white shadow-sm hover:border-[#bcd3d8] hover:bg-[#e8f1f3] text-[#3d7685] hover:text-[#1f4251] hover:shadow'
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

                  {teluguAlphabet.map(letter => {
                    const letterSongs = filteredSongsList.filter(s => getDynamicFirstLetter(s, 'telugu') === letter);
                    if (letterSongs.length === 0) return null;
                    return (
                      <div key={letter} id={`letter-${letter}`} className="mb-8 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
                          <span className="text-4xl font-bold text-cyan-500 leading-none" style={{ fontFamily: 'var(--font-ramabhadra)' }}>{letter}</span>
                          <span className="text-sm font-semibold text-gray-400 translate-y-[4px]">({letterSongs.length} songs)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {letterSongs.map((song, idx) => (
                            <button
                              key={song.id}
                              onClick={() => handleSelectSong(song)}
                              className="song-btn text-left p-3 px-5 rounded-2xl border border-transparent hover:border-[#bcd3d8] bg-transparent hover:bg-[#e8f1f3] text-[#5795A7] hover:text-[#2c5a67] transition-all duration-200 flex gap-3 text-base items-center hover:shadow-sm w-full"
                              style={{ fontFamily: 'var(--font-ramabhadra)' }}
                            >
                              <span className="text-xs font-mono font-medium opacity-65 pt-0.5">{idx + 1}.</span>
                              <span className="leading-tight flex-1 truncate">
                                {song.title}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="text-right mt-4 pt-3 border-t border-gray-100">
                          <a
                            href="#songs-searchbar"
                            className="text-xs font-bold text-gray-400 hover:text-[#5795A7] transition-colors tracking-wider uppercase"
                          >
                            Back to Top ↑
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* TELUGU INDEX VIEW: Without keyboard, grouped by Telugu letter */}
            {((viewTab === 'telugu-index' && !isSundaySchool) || (isSundaySchool && keyboardLanguage === 'telugu')) && (
              loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                  <div className="w-10 h-10 border-4 border-[#5795A7] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold">Loading songs list...</p>
                </div>
              ) : (
                <div id="telugu-songs-top">
                  {teluguAlphabet.map(letter => {
                    const letterSongs = filteredSongsList.filter(s => getDynamicFirstLetter(s, 'telugu') === letter);
                    if (letterSongs.length === 0) return null;
                    return (
                      <div key={letter} id={`telugu-letter-${letter}`} className="mb-8 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
                          <span className="text-4xl font-bold text-cyan-500 leading-none" style={{ fontFamily: 'var(--font-ramabhadra)' }}>{letter}</span>
                          <span className="text-sm font-semibold text-gray-400 translate-y-[4px]">({letterSongs.length} songs)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {letterSongs.map((song, idx) => (
                            <button
                              key={song.id}
                              onClick={() => handleSelectSong(song)}
                              className="song-btn text-left p-3 px-5 rounded-2xl border border-transparent hover:border-[#bcd3d8] bg-transparent hover:bg-[#e8f1f3] text-[#5795A7] hover:text-[#2c5a67] transition-all duration-200 flex gap-3 text-base items-center hover:shadow-sm w-full"
                              style={{ fontFamily: 'var(--font-ramabhadra)' }}
                            >
                              <span className="text-xs font-mono font-medium opacity-65 pt-0.5">{idx + 1}.</span>
                              <span className="leading-tight flex-1 truncate">
                                {song.language === 'telugu' || song.language === 'sunday_telugu' ? cleanTeluguTitle(song.title) : song.title}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="text-right mt-4 pt-3 border-t border-gray-100">
                          <a
                            href="#songs-searchbar"
                            className="text-xs font-bold text-gray-400 hover:text-[#5795A7] transition-colors tracking-wider uppercase"
                          >
                            Back to Top ↑
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* ENGLISH INDEX VIEW: Without keyboard, grouped by English letter */}
            {((viewTab === 'english-index' && !isSundaySchool) || (isSundaySchool && keyboardLanguage === 'english')) && (
              loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                  <div className="w-10 h-10 border-4 border-[#5795A7] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold">Loading songs list...</p>
                </div>
              ) : (
                <div id="english-songs-top">
                  {englishAlphabet.map(letter => {
                    const letterSongs = filteredSongsList.filter(s => getDynamicFirstLetter(s, 'english') === letter);
                    if (letterSongs.length === 0) return null;
                    return (
                      <div key={letter} id={`english-letter-${letter}`} className="mb-8 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
                          <span className="text-4xl font-bold text-cyan-500 leading-none" style={{ fontFamily: 'var(--font-ramabhadra)' }}>{letter}</span>
                          <span className="text-sm font-semibold text-gray-400 translate-y-[4px]">({letterSongs.length} songs)</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {letterSongs.map((song, idx) => (
                            <button
                              key={song.id}
                              onClick={() => handleSelectSong(song)}
                              className="song-btn text-left p-3 px-5 rounded-2xl border border-transparent hover:border-[#bcd3d8] bg-transparent hover:bg-[#e8f1f3] text-[#5795A7] hover:text-[#2c5a67] transition-all duration-200 flex gap-3 text-base items-center hover:shadow-sm w-full"
                              style={{ fontFamily: 'var(--font-ramabhadra)' }}
                            >
                              <span className="text-xs font-mono font-medium opacity-65 pt-0.5">{idx + 1}.</span>
                              <span className="leading-tight flex-1 truncate">
                                {song.title}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="text-right mt-4 pt-3 border-t border-gray-100">
                          <a
                            href="#songs-searchbar"
                            className="text-xs font-bold text-gray-400 hover:text-[#5795A7] transition-colors tracking-wider uppercase"
                          >
                            Back to Top ↑
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

          </div>

        </div>
      </div>
    );
  }

  // RENDER LYRICS VIEW (SIDE-BY-SIDE SIDEBAR-LESS DASHBOARD)
  return (
    <div className="min-h-screen bg-[#e0f2f1] py-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200/80 flex flex-col md:flex-row min-h-[750px]">

        {/* Left column: Songs Index Search & List */}
        <div className="w-full md:w-[380px] border-r border-gray-200 p-6 flex flex-col flex-shrink-0 bg-[#FFFFFF]">
          
          {/* Back to alphabetical index button */}
          <div className="mb-4">
            <button
              onClick={() => setViewState('index')}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e8f1f3] hover:bg-[#d8e8eb] text-[#5795A7] font-bold text-xs transition-colors border border-[#bcd3d8]/40"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Index
            </button>
          </div>

          {/* Teal-bordered Search Bar */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search songs by lyrics/title..."
                value={searchVal}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-2xl border-2 border-[#5795A7] focus:outline-none focus:ring-2 focus:ring-[#5795A7]/20 text-gray-700 text-sm placeholder-gray-400 bg-white"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5795A7] font-bold p-1 transition-colors animate-fade-in"
                >
                  ✕
                </button>
              )}
            </div>
            <button className="bg-[#5795A7] text-white p-3 rounded-2xl hover:bg-[#478597] transition-colors shadow-md shadow-[#5795A7]/20 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Selection Title & Letter popover trigger */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div>
              <div className="text-[11px] text-[#5795A7] font-bold uppercase tracking-wider">
                {getLanguageLabel(language)}
              </div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-1.5 flex-wrap">
                For <span className="text-[#5795A7] text-3xl font-light">"</span>
                <span className="text-[#5795A7]" style={getHeaderLetterStyle(selectedLetter)}>{selectedLetter || 'All'}</span>
                <span className="text-[#5795A7] text-3xl font-light">"</span>
                <span className="text-sm text-gray-500 font-medium font-mono ml-0.5">
                  ({filteredSongsList.length} Songs)
                </span>
              </h2>
            </div>
            
            <div className="flex gap-2 relative" ref={letterPickerRef}>
              
              {/* Favorites Heart Filter Toggle */}
              <button
                onClick={() => setViewMode(prev => prev === 'favorites' ? 'all' : 'favorites')}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm ${
                  viewMode === 'favorites'
                    ? 'bg-[#5795A7] text-white border-[#5795A7] shadow-md shadow-[#5795A7]/20'
                    : 'bg-white text-gray-400 hover:text-[#5795A7] hover:bg-[#e8f1f3] border-gray-200'
                }`}
                title={viewMode === 'favorites' ? "Show All Songs" : "Show Favorites Only"}
              >
                <svg className="w-6 h-6" fill={viewMode === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Trigger for Alphabet Popover */}
              <button 
                onClick={() => setIsLetterPickerOpen(!isLetterPickerOpen)}
                className="w-12 h-12 rounded-full bg-[#e8f1f3] hover:bg-[#d8e8eb] text-[#5795A7] font-bold flex items-center justify-center transition-all border border-[#bcd3d8]/50 shadow-sm"
                title="Select Letter"
                style={getButtonLetterStyle(selectedLetter)}
              >
                {selectedLetter || 'A'}
              </button>

              {/* Letter Picker Grid Popover */}
              {isLetterPickerOpen && (
                <div className="absolute right-0 top-14 bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 w-72 z-40 max-h-96 overflow-y-auto">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Choose Letter</h4>

                  {(language === 'all' || isSundaySchool) && (
                    <div className="flex justify-between gap-1 mb-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                      <button
                        onClick={() => selectKeyboardLanguage('telugu')}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          keyboardLanguage === 'telugu' ? 'bg-[#5795A7] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Telugu
                      </button>
                      <button
                        onClick={() => selectKeyboardLanguage('english')}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          keyboardLanguage === 'english' ? 'bg-[#5795A7] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  )}
                  
                  {/* Clear filter option directly inside letter popover */}
                  <button
                    onClick={() => {
                      setSelectedLetter('');
                      setLastSelectedLetter('');
                      setIsLetterPickerOpen(false);
                    }}
                    className="w-full py-2 mb-3 text-center rounded-xl text-xs font-bold bg-gray-100 hover:bg-[#e8f1f3] hover:text-[#5795A7] border border-gray-200/50 transition-all text-gray-700 block"
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
                              ? 'bg-[#5795A7] text-white scale-110 shadow-md shadow-[#5795A7]/30 font-semibold'
                              : hasSongs
                              ? 'bg-gray-100 text-gray-800 hover:bg-[#e8f1f3] hover:text-[#5795A7] border border-gray-200/50'
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

          {/* Sub-Filters: Categories List */}
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
                        ? 'bg-[#5795A7] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              }
            </div>
          )}

          {/* Song list loading & container */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[500px] md:max-h-[none]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <div className="w-8 h-8 border-4 border-[#5795A7] border-t-transparent rounded-full animate-spin"></div>
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
                      ? 'bg-[#e8f1f3] border-[#bcd3d8] text-[#5795A7] font-bold shadow-sm shadow-[#5795A7]/10'
                      : 'bg-[#FCFDFF] border-gray-100 hover:bg-gray-50 text-gray-700 hover:border-gray-200'
                  }`}
                  style={{ fontFamily: 'var(--font-ramabhadra)' }}
                >
                  <span className="text-xs font-mono font-medium opacity-65 pt-0.5">{idx + 1}.</span>
                  <span className="leading-tight flex-1">
                    {song.language === 'telugu' || song.language === 'sunday_telugu' ? cleanTeluguTitle(song.title) : song.title}
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
                  {/* PDF Print & Text download */}
                  <div className="relative group">
                    <button
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm transition-all"
                    >
                      <span>☁</span> Download
                    </button>
                    
                    {/* Hover dropdown for actions */}
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
                    className="text-2xl md:text-3xl font-normal text-gray-800 leading-tight"
                    style={{ fontFamily: 'var(--font-ramabhadra)' }}
                  >
                    {activeSong.title}
                  </h1>
                  
                  {/* Category badges */}
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
                      ? 'bg-[#e8f1f3] text-[#5795A7] border-[#bcd3d8] shadow-sm'
                      : 'bg-white text-gray-400 hover:text-[#5795A7] hover:bg-[#e8f1f3] border-gray-200'
                  }`}
                  title={favorites.includes(activeSong.slug) ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <svg className="w-6 h-6" fill={favorites.includes(activeSong.slug) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Language Pills Tab Bar (only when chords is disabled) */}
              {!showChords && (
                <div className="flex flex-wrap gap-1.5 mb-6 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  {activeSong.telugu_lyrics && (
                    <button
                      onClick={() => setActiveLyricsTab('telugu')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeLyricsTab === 'telugu'
                          ? 'bg-white text-[#5795A7] shadow-sm border border-[#5795A7]/10 font-extrabold'
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
                          ? 'bg-white text-[#5795A7] shadow-sm border border-[#5795A7]/10 font-extrabold'
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
                          ? 'bg-white text-[#5795A7] shadow-sm border border-[#5795A7]/10 font-extrabold'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Hindi Lyrics
                    </button>
                  )}
                </div>
              )}

              {/* Chords Warning Badge */}
              {showChords && (
                <div className="mb-4 bg-[#e8f1f3] border border-[#bcd3d8] text-[#2c5a67] rounded-xl px-4 py-2 text-xs font-medium flex items-center justify-between">
                  <span>Showing Guitar Chords representation</span>
                  <button 
                    onClick={() => setShowChords(false)}
                    className="text-[#1f4251] font-bold hover:underline"
                  >
                    Switch back
                  </button>
                </div>
              )}

              {/* Lyrics Render Area (with custom paragraph margins) */}
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
              <p className="text-sm text-gray-500 max-w-sm">Select a song from the index list on the left to display its chords and lyrics here.</p>
            </div>
          )}

        </div>

      </div>

      {/* Slideshow Presentation Fullscreen Mode */}
      {isFullscreenSlideshow && activeSong && (() => {
        const slides = getSlides(activeContent);
        return (
          <div className="fixed inset-0 bg-[#0E0F11] text-white z-50 flex flex-col justify-between p-6 select-none">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 opacity-50 hover:opacity-100 transition-opacity">
              <div>
                <h4 className="text-sm font-semibold tracking-wide uppercase text-[#5795A7]">Presentation Mode</h4>
                <h3 
                  className="text-xl font-normal"
                  style={{ fontFamily: 'var(--font-ramabhadra)' }}
                >
                  {activeSong.title}
                </h3>
              </div>
              <button 
                onClick={() => setIsFullscreenSlideshow(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                title="Exit Slideshow (Esc)"
              >
                Exit (Esc)
              </button>
            </div>
            
            {/* Slide Body */}
            <div className="flex-1 flex flex-col justify-center text-center max-w-4xl mx-auto px-4">
              {slides.length === 0 ? (
                <div className="text-white/40 italic text-xl">No presentation slides available.</div>
              ) : (
                <div className="space-y-6 md:space-y-8 animate-fade-in" style={{ fontFamily: 'var(--font-mandali)' }}>
                  {(slides[currentSlideIndex] || '').split('\n').map((line, idx) => (
                    <p key={idx} className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-normal tracking-wide text-white drop-shadow-md">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer with Controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-sm font-mono text-white/50">
                Slide {slides.length > 0 ? currentSlideIndex + 1 : 0} of {slides.length}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 flex items-center justify-center text-white transition-all text-xl font-bold"
                  title="Previous Slide (Left Arrow)"
                >
                  &larr;
                </button>
                <button
                  disabled={currentSlideIndex === slides.length - 1}
                  onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 flex items-center justify-center text-white transition-all text-xl font-bold"
                  title="Next Slide (Right Arrow or Space)"
                >
                  &rarr;
                </button>
              </div>
            </div>

          </div>
        );
      })()}

      {/* Global CSS Inject for slide animation & custom margins */}
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

export default function SongsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#e0f2f1] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 w-80">
          <div className="w-12 h-12 border-4 border-[#5795A7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Lyrics Index...</p>
        </div>
      </div>
    }>
      <LyricsDashboard />
    </Suspense>
  );
}

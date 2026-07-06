"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

const englishAlphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "#",
];
const teluguAlphabet = [
  "అ",
  "ఆ",
  "ఇ",
  "ఈ",
  "ఉ",
  "ఊ",
  "ఋ",
  "ఎ",
  "ఏ",
  "ఐ",
  "ఒ",
  "ఓ",
  "ఔ",
  "క",
  "ఖ",
  "గ",
  "ఘ",
  "చ",
  "ఛ",
  "జ",
  "ఝ",
  "ట",
  "ఠ",
  "డ",
  "ఢ",
  "ణ",
  "త",
  "థ",
  "ద",
  "ధ",
  "న",
  "ప",
  "ఫ",
  "బ",
  "భ",
  "మ",
  "య",
  "ర",
  "ల",
  "వ",
  "శ",
  "ష",
  "స",
  "హ",
  "ళ",
  "క్ష",
  "ఱ",
  "#",
];
const hindiAlphabet = [
  "अ",
  "आ",
  "इ",
  "ई",
  "उ",
  "ऊ",
  "ए",
  "ऐ",
  "ओ",
  "औ",
  "क",
  "ख",
  "ग",
  "घ",
  "च",
  "छ",
  "ज",
  "झ",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "त",
  "थ",
  "द",
  "ध",
  "न",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "ष",
  "स",
  "ह",
  "क्ष",
  "त्र",
  "ज्ञ",
  "#",
];

const DESIRED_CATEGORIES = [
  { name: "Praise", slug: "praise-songs", match: "praise" },
  { name: "Worship", slug: "worship-songs", match: "worship" },
  { name: "Prayer", slug: "prayer-songs", match: "prayer" },
  { name: "Christmas", slug: "christmas-songs", match: "christmas" },
  { name: "Encouraging", slug: "encouraging-songs", match: "encouraging" },
  { name: "Correction", slug: "correction-songs", match: "correction" },
  { name: "Repentance", slug: "repentance-songs", match: "repentance" },
  { name: "Good Friday", slug: "good-friday-songs", match: "good friday" },
  { name: "Gospel", slug: "gospel-songs", match: "gospel" },
  { name: "Comfort", slug: "comfort-songs", match: "comfort" },
  { name: "Commitment", slug: "commitment-songs", match: "commitment" },
  { name: "Hope", slug: "hope-songs", match: "hope" },
  { name: "Thanksgiving", slug: "thanksgiving-songs", match: "thanksgiving" },
  { name: "Marriage", slug: "marriage-songs", match: "marriage" },
  { name: "Easter", slug: "easter-songs", match: "easter" },
  { name: "Offering", slug: "offering-song", match: "offering" },
  { name: "Second Coming", slug: "second-coming-songs", match: "second coming" },
];

const ALLOWED_CATEGORIES = [
  "Christmas Songs",
  "Comfort Songs",
  "Commitment Songs",
  "Correction Songs",
  "Easter Songs",
  "Encouraging Songs",
  "English",
  "Good Friday Songs",
  "Gospel Songs",
  "Hindi",
  "Hope Songs",
  "Kids Songs",
  "Marriage Songs",
  "Offering Songs",
  "Praise Songs",
  "Prayer Songs",
  "Repentance Songs",
  "Second Coming Songs",
  "Telugu",
  "Thanksgiving Songs",
  "Worship Songs",
];

const getDynamicFirstLetter = (
  song: Song,
  kbLang: "telugu" | "english" | "hindi",
) => {
  const title = (song.title || "").trim();
  if (!title) return "#";

  // 1. English letter index
  if (kbLang === "english") {
    const match = title.match(/[A-Za-z]/);
    if (match) {
      return match[0].toUpperCase();
    }
    return "#";
  }

  // 2. Hindi letter index
  if (kbLang === "hindi") {
    const cleanTitle = title.replace(/^[🎵📖⛪🙏\s\-\/\(\)]+/, "");
    if (!cleanTitle) return "#";
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
    return "#";
  }

  // 3. Telugu letter index
  if (kbLang === "telugu") {
    const cleanTitle = title.replace(/^[🎵📖⛪🙏\s\-\/\(\)]+/, "");
    if (!cleanTitle) return "#";
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
    return "#";
  }

  return song.first_letter || "#";
};

const extractTeluguTitle = (title: string) => {
  if (!title) return "";
  let clean = title.split("/")[0].trim();

  // Remove trailing English words (with optional dots/hyphens/spaces)
  clean = clean.replace(/[\s.\-a-zA-Z]+$/, "").trim();

  // Remove trailing parenthesis containing ONLY English words
  clean = clean.replace(/\s*\([a-zA-Z\s.\-]*\)\s*$/, "").trim();

  return clean || title;
};

const extractEnglishTitle = (title: string) => {
  if (!title) return "";
  // Remove all Telugu characters
  let englishOnly = title.replace(/[\u0C00-\u0C7F]+/g, "").trim();

  // Clean up any leading slashes or hyphens that might be left over
  englishOnly = englishOnly.replace(/^[\s/\-]+/, "").trim();

  return englishOnly || title; // fallback to title if it becomes empty
};

function SongsDashboard() {
  const searchParams = useSearchParams();

  // App States
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<SongCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [lastSelectedLetter, setLastSelectedLetter] = useState<string>("");
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  // viewTab represents the current filter tab
  const [viewTab, setViewTab] = useState<
    | "home"
    | "telugu-songs"
    | "hindi-songs"
    | "english-songs"
    | "telugu-index"
    | "english-index"
    | "song-request"
  >("home");

  // Song Request Form States
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    songTitle: "",
    language: "telugu",
    details: "",
  });
  const [requestErrors, setRequestErrors] = useState({
    name: "",
    email: "",
    submit: "",
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { name: "", email: "", submit: "" };

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
      newErrors.email =
        "Please enter a valid email address (e.g. user@example.com).";
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
      console.error(
        "EmailJS credentials are not configured in environment variables.",
      );
      setRequestErrors((prev) => ({
        ...prev,
        submit: "Submission failed: email service is not configured.",
      }));
      setSubmittingRequest(false);
      return;
    }

    const formattedDetails = `
Song Title: ${requestForm.songTitle}
Language: ${requestForm.language}
Phone: ${requestForm.phone || "N/A"}
Details / Lyrics / Links:
${requestForm.details || "N/A"}
    `.trim();

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        song_title: requestForm.songTitle || "N/A",
        language: requestForm.language || "N/A",
        notes: requestForm.details || "N/A",
        requester_name: requestForm.name,
        requester_email: requestForm.email,
        requester_phone: requestForm.phone || "N/A",
        submitted_at: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        subject: `New Song Request: ${requestForm.songTitle}`,
        reply_to: requestForm.email,
      },
    };

    console.log("🚀 SENDING PAYLOAD TO EMAILJS:", payload);

    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          setRequestSubmitted(true);
          setRequestForm({
            name: "",
            email: "",
            phone: "",
            songTitle: "",
            language: "telugu",
            details: "",
          });
          setRequestErrors({ name: "", email: "", submit: "" });
        } else {
          return res.text().then((text) => {
            throw new Error(text || "Failed to send email via EmailJS");
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setRequestErrors((prev) => ({
          ...prev,
          submit: "Failed to send request. Please try again later.",
        }));
      })
      .finally(() => {
        setSubmittingRequest(false);
      });
  };
  const [viewMode, setViewMode] = useState<"all" | "categories" | "favorites">(
    "all",
  );
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");

  // ViewState: 'index' shows the lists/keyboards, 'lyrics' shows the reader
  const [viewState, setViewState] = useState<"index" | "lyrics">("index");

  // Interaction states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontFamily, setFontFamily] = useState<string>("var(--font-mallanna)");
  const [lineHeight, setLineHeight] = useState<number>(2.0);
  const [activeLyricsTab, setActiveLyricsTab] = useState<
    "telugu" | "english" | "hindi" | "ppt"
  >("telugu");
  const [keyboardLanguage, setKeyboardLanguage] = useState<
    "telugu" | "english" | "hindi"
  >("telugu");

  // Popups/Modals
  const [isLetterPickerOpen, setIsLetterPickerOpen] = useState<boolean>(false);

  const letterPickerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] =
    useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  const getLetterStyle = (l: string) => {
    const isTelugu = l && /[\u0C00-\u0C7F]/.test(l);
    const isHindi = l && /[\u0900-\u097F]/.test(l);
    return {
      fontFamily: isTelugu
        ? "var(--font-mallanna), sans-serif"
        : isHindi
          ? "sans-serif"
          : "var(--font-mallanna), sans-serif",
      fontSize: isTelugu || isHindi ? "34px" : "22px",
      lineHeight: "1",
    };
  };

  const getHeaderLetterStyle = (l: string) => {
    const isTelugu = l && /[\u0C00-\u0C7F]/.test(l);
    const isHindi = l && /[\u0900-\u097F]/.test(l);
    return {
      fontFamily: isTelugu
        ? "var(--font-mallanna), sans-serif"
        : isHindi
          ? "sans-serif"
          : "var(--font-mallanna), sans-serif",
      fontSize: isTelugu || isHindi ? "64px" : "50px",
      lineHeight: "1",
      verticalAlign: "middle",
      fontWeight: "normal",
    };
  };

  const getButtonLetterStyle = (l: string) => {
    const isTelugu = l && /[\u0C00-\u0C7F]/.test(l);
    const isHindi = l && /[\u0900-\u097F]/.test(l);
    return {
      fontFamily: isTelugu
        ? "var(--font-mallanna), sans-serif"
        : isHindi
          ? "sans-serif"
          : "var(--font-mallanna), sans-serif",
      fontSize: isTelugu || isHindi ? "34px" : "24px",
      lineHeight: "1",
      paddingTop: isTelugu || isHindi ? "2px" : "0px",
      fontWeight: "normal",
    };
  };

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    if (val.trim().length > 0) {
      setSelectedLetter("");
    } else {
      if (lastSelectedLetter) {
        setSelectedLetter(lastSelectedLetter);
      } else {
        const alphabet = getAlphabetForLang(keyboardLanguage);
        const firstLetterWithSongs = alphabet.find((l) =>
          songs.some((s) => getDynamicFirstLetter(s, keyboardLanguage) === l),
        );
        setSelectedLetter(firstLetterWithSongs || "");
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
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("njm_favorite_sunday_songs");
      if (saved) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
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
      updated = updated.filter((s) => s !== slug);
    } else {
      updated.push(slug);
    }
    setFavorites(updated);
    localStorage.setItem("njm_favorite_sunday_songs", JSON.stringify(updated));
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        letterPickerRef.current &&
        !letterPickerRef.current.contains(event.target as Node)
      ) {
        setIsLetterPickerOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all songs and filter client-side for All songs only
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
     
    setSelectedLetter("");
     
    setLastSelectedLetter("");
     
    setSearchVal("");
     
    setKeyboardLanguage("telugu");

    fetch(`${baseUrl}/songs/?language=all`)
      .then((res) => res.json())
      .then((data: Song[]) => {
        // Keep ONLY All songs
        const congregationalSongs = data.filter(
          (s) =>
            s.language === "telugu" ||
            s.language === "english" ||
            s.language === "hindi" ||
            s.language === "all",
        );
        const normalized = congregationalSongs.map((song) => {
          let fl = song.first_letter;
          if (!fl || fl === "#") {
            const title = song.title || "";
            fl = title.trim().charAt(0).toUpperCase() || "#";
          }
          return { ...song, first_letter: fl || "#" };
        });
        setSongs(normalized);

        // Default select the first alphabet with songs
        if (normalized.length > 0) {
          const alphabet = teluguAlphabet;
          const firstLetterWithSongs = alphabet.find((l) =>
            normalized.some((s) => getDynamicFirstLetter(s, "telugu") === l),
          );

          if (firstLetterWithSongs) {
            setSelectedLetter(firstLetterWithSongs);
            setLastSelectedLetter(firstLetterWithSongs);
          } else {
            const fallbackLetter = getDynamicFirstLetter(
              normalized[0],
              "telugu",
            );
            setSelectedLetter(fallbackLetter);
            setLastSelectedLetter(fallbackLetter);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading All songs:", err);
        setLoading(false);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${baseUrl}/categories/`)
      .then((res) => res.json())
      .then((data: SongCategory[]) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const selectKeyboardLanguage = (kbLang: "telugu" | "english" | "hindi") => {
    setKeyboardLanguage(kbLang);
    const alphabet = getAlphabetForLang(kbLang);
    const firstLetterWithSongs = alphabet.find((l) =>
      songs.some((s) => getDynamicFirstLetter(s, kbLang) === l),
    );
    setSelectedLetter(firstLetterWithSongs || "");
    setLastSelectedLetter(firstLetterWithSongs || "");
  };

  const determineDefaultLyricsTab = (song: Song) => {
    if (song.telugu_lyrics && song.telugu_lyrics.trim().length > 0) {
      setActiveLyricsTab("telugu");
    } else if (song.english_lyrics && song.english_lyrics.trim().length > 0) {
      setActiveLyricsTab("english");
    } else if (song.hindi_lyrics && song.hindi_lyrics.trim().length > 0) {
      setActiveLyricsTab("hindi");
    }
  };

  const handleSelectSong = (song: Song) => {
    setActiveSong(song);
    determineDefaultLyricsTab(song);

    const songLang =
      song.language === "sunday_english"
        ? "english"
        : song.language === "sunday_hindi"
          ? "hindi"
          : "telugu";
    setKeyboardLanguage(songLang);

    const fl = getDynamicFirstLetter(song, songLang);
    setSelectedLetter(fl);
    setLastSelectedLetter(fl);

    setViewState("lyrics");
  };

  const getAlphabetForLang = (kbLang: "telugu" | "english" | "hindi") => {
    if (kbLang === "english") return englishAlphabet;
    if (kbLang === "hindi") return hindiAlphabet;
    return teluguAlphabet;
  };

  const activeAlphabet = getAlphabetForLang(keyboardLanguage);

  // Filter songs based on current filters and active tabs
  const getBaseFilteredSongs = (): Song[] => {
    let result = songs;

    // ViewMode filters
    if (viewMode === "favorites") {
      result = result.filter((s) => favorites.includes(s.slug));
    } else if (viewMode === "categories" && selectedCategorySlug) {
      const catObj = DESIRED_CATEGORIES.find((d) => d.slug === selectedCategorySlug);
      if (catObj) {
        result = result.filter((s) =>
          s.categories && s.categories.some((c) => c.name.toLowerCase().includes(catObj.match)),
        );
      }
    }

    // Search filter
    if (searchVal.trim().length > 0) {
      const q = searchVal.toLowerCase();
      result = result.filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.telugu_lyrics && s.telugu_lyrics.toLowerCase().includes(q)) ||
          (s.english_lyrics && s.english_lyrics.toLowerCase().includes(q)) ||
          (s.hindi_lyrics && s.hindi_lyrics.toLowerCase().includes(q)),
      );
    }

    // Tab/Index filters
    if (viewState === "index") {
      if (viewTab === "hindi-songs") {
        result = result.filter((s) => s.language === "hindi");
      }
      // telugu-songs and english-songs tabs show ALL congregational songs
    } else if (viewState === "lyrics") {
      if (keyboardLanguage === "hindi") {
        result = result.filter((s) => s.language === "hindi");
      }
      // telugu and english keyboards show ALL congregational songs
    }

    return result;
  };

  const getFilteredSongs = (): Song[] => {
    let result = getBaseFilteredSongs();

    if (selectedLetter && viewState === "lyrics") {
      result = result.filter(
        (s) => getDynamicFirstLetter(s, keyboardLanguage) === selectedLetter,
      );
    }

    return result;
  };

  const filteredSongsList = getFilteredSongs();

  // Find letter counts for active configuration
  const getLetterAvailability = (): Record<string, number> => {
    const avail: Record<string, number> = {};
    const targetSongs = getBaseFilteredSongs();

    targetSongs.forEach((s) => {
      const dynamicLetter = getDynamicFirstLetter(s, keyboardLanguage);
      if (dynamicLetter) {
        avail[dynamicLetter] = (avail[dynamicLetter] || 0) + 1;
      }
    });
    return avail;
  };

  const letterAvailability = getLetterAvailability();

  const formatLyrics = (htmlContent: string) => {
    if (!htmlContent) return "";
    let content = htmlContent.trim();
    if (!/<p>|<br\s*\/?>/i.test(content)) {
      content = content.replace(/\r?\n/g, "<br />");
    } else {
      content = content
        .replace(/(<br\s*\/?>)\s*\n/gi, "$1")
        .replace(/(<\/p>)\s*\n/gi, "$1")
        .replace(/(<p>)\s*\n/gi, "$1");
    }
    return content;
  };

  const getActiveLyricsContent = (): string => {
    if (!activeSong) return "";
    switch (activeLyricsTab) {
      case "telugu":
        return activeSong.telugu_lyrics || "";
      case "english":
        return activeSong.english_lyrics || "";
      case "hindi":
        return activeSong.hindi_lyrics || "";
      case "ppt":
        return activeSong.powerpoint_slides || "";
      default:
        return activeSong.telugu_lyrics || "";
    }
  };

  const getSlides = (htmlContent: string): string[] => {
    if (!htmlContent) return [];
    const cleanText = htmlContent;
    const rawSlides = cleanText.split(/<\/p>/i);
    let slides = rawSlides
      .map((slide) => {
        let text = slide.replace(/<p>/i, "").trim();
        text = text.replace(/<br\s*\/?>/gi, "\n");
        text = text.replace(/<[^>]*>/g, "");
        text = text
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        return text.trim();
      })
      .filter((slide) => slide.length > 0);

    if (slides.length === 0) {
      const textContent = htmlContent
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "");
      slides = textContent
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return slides;
  };

  const downloadLyricsFile = () => {
    if (!activeSong) return;
    const lyricsText = getSlides(getActiveLyricsContent()).join("\n\n");
    const header = `${activeSong.title}\n=======================\n\n`;
    const blob = new Blob([header + lyricsText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
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
      const pptxgen = (await import("pptxgenjs")).default;
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_16x9";

      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: "173C4E" };

      const cleanedTitle =
        activeSong.language === "all"
          ? extractTeluguTitle(activeSong.title)
          : activeSong.title;

      titleSlide.addText(cleanedTitle, {
        x: 0.5,
        y: 2.2,
        w: 12.3,
        h: 2.5,
        align: "center",
        fontFace: "Arial",
        fontSize: 44,
        color: "FFFFFF",
        bold: true,
      });

      const lyricsText = getActiveLyricsContent();
      const slides = getSlides(lyricsText);

      slides.forEach((stanza) => {
        const lyricSlide = pptx.addSlide();
        lyricSlide.background = { color: "173C4E" };
        lyricSlide.addText(stanza, {
          x: 0.5,
          y: 1.0,
          w: 12.3,
          h: 5.5,
          align: "center",
          fontFace: "Arial",
          fontSize: 32,
          color: "FFFFFF",
          lineSpacing: 44,
        });
      });

      pptx.writeFile({ fileName: `${activeSong.slug}.pptx` });
    } catch (error) {
      console.error("Error generating PowerPoint:", error);
      alert("Failed to generate PowerPoint file.");
    }
  };

  const getResourceUrl = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    const baseUrlStr = baseUrl.endsWith("/api")
      ? baseUrl.slice(0, -4)
      : baseUrl;
    return `${baseUrlStr}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const downloadAudio = () => {
    if (!activeSong || !activeSong.audio_video) {
      alert("Audio not available for this song.");
      return;
    }
    const url = getResourceUrl(activeSong.audio_video);
    window.open(url, "_blank");
  };

  const activeContent = getActiveLyricsContent();

  // RENDER INDEX VIEW
  if (viewState === "index") {
    return (
      <div className="min-h-screen bg-[#e8f1f3] py-8 px-4 md:px-8 font-sans">
        <div className="max-w-[90%] md:max-w-7xl lg:px-[85px] mx-auto space-y-6">
          {/* Header Title with Back Link */}
          <div className="flex flex-col gap-4">
            <div className="text-center pt-2">
              <h1 className="text-3xl font-extrabold text-[#5795A7] uppercase tracking-wide">
                All Songs
              </h1>
            </div>
          </div>

          {/* Search and Category Bar - Attached style */}
          <div className="flex flex-col sm:flex-row w-full max-w-5xl mx-auto shadow-sm rounded-2xl border-2 border-[#bcd3d8]/50 focus-within:border-[#5795A7] transition-all bg-white hover:shadow-md">
            <div className="relative flex-1 border-b sm:border-b-0 sm:border-r border-[#bcd3d8]/50 focus-within:bg-[#f4f8f9] rounded-t-[14px] sm:rounded-t-none sm:rounded-l-[14px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-[#5795A7]/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search songs..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 bg-transparent outline-none text-[#1f4251] font-medium placeholder-[#5795A7]/50"
              />
              {searchVal && (
                <button
                  onClick={() => setSearchVal("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5795A7] hover:text-[#1f4251] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div
              className="sm:w-60 bg-[#5795A7] hover:bg-[#4a8293] transition-colors relative rounded-b-[14px] sm:rounded-b-none sm:rounded-r-[14px]"
              ref={categoryDropdownRef}
            >
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="w-full h-full pl-11 pr-10 py-3.5 bg-transparent outline-none text-white font-bold text-left flex items-center justify-between"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <span className="truncate">
                  {selectedCategorySlug
                    ? (() => {
                        const catObj = DESIRED_CATEGORIES.find((c) => c.slug === selectedCategorySlug);
                        const count = catObj ? songs.filter((s) => s.categories && s.categories.some((c) => c.name.toLowerCase().includes(catObj.match))).length : 0;
                        return `${catObj?.name || 'Category'} (${count})`;
                      })()
                    : `All Songs (${songs.length})`}
                </span>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/90">
                  <svg
                    className="w-5 h-5 transition-transform duration-200"
                    style={{
                      transform: isCategoryDropdownOpen
                        ? "rotate(180deg)"
                        : "none",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#bcd3d8]/50 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto py-2">
                  <button
                    onClick={() => {
                      setSelectedCategorySlug("");
                      setViewMode("all");
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${!selectedCategorySlug ? "bg-[#5795A7] text-white font-bold" : "text-gray-800 hover:bg-[#e8f1f3] hover:text-[#3B7586]"}`}
                  >
                    All Songs ({songs.length})
                  </button>
                  {DESIRED_CATEGORIES.map((cat) => {
                    const count = songs.filter((s) => s.categories && s.categories.some((c) => c.name.toLowerCase().includes(cat.match))).length;
                    return (
                      <button
                        key={cat.slug}
                        disabled={count === 0}
                        onClick={() => {
                          setSelectedCategorySlug(cat.slug);
                          setViewMode("categories");
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${count === 0 ? "text-gray-400 cursor-not-allowed" : selectedCategorySlug === cat.slug ? "bg-[#5795A7] text-white font-bold" : "text-gray-800 hover:bg-[#e8f1f3] hover:text-[#3B7586]"}`}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 md:p-8">
            {/* Top Navigation Tabs (2 Rows) */}
            <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 mb-8">
              {/* Row 1: Content Tabs */}
              <div className="flex flex-row justify-center flex-wrap gap-5 items-center">
                <button
                  onClick={() => {
                    setViewTab("home");
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm border ${
                    viewTab === "home"
                      ? "bg-[#5795A7] text-white border-transparent"
                      : "bg-[#e8f1f3] text-[#5795A7] border-[#bcd3d8] hover:bg-[#d8e8eb]"
                  }`}
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  All Songs
                </button>
                <button
                  onClick={() => {
                    setViewTab("telugu-songs");
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm border ${
                    viewTab === "telugu-songs"
                      ? "bg-[#5795A7] text-white border-transparent"
                      : "bg-[#e8f1f3] text-[#5795A7] border-[#bcd3d8] hover:bg-[#d8e8eb]"
                  }`}
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Telugu Index
                </button>
                <button
                  onClick={() => {
                    setViewTab("english-songs");
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm border ${
                    viewTab === "english-songs"
                      ? "bg-[#5795A7] text-white border-transparent"
                      : "bg-[#e8f1f3] text-[#5795A7] border-[#bcd3d8] hover:bg-[#d8e8eb]"
                  }`}
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  English Index
                </button>
                <button
                  onClick={() => {
                    setViewTab("song-request");
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm border ${
                    viewTab === "song-request"
                      ? "bg-[#5795A7] text-white border-transparent"
                      : "bg-[#e8f1f3] text-[#5795A7] border-[#bcd3d8] hover:bg-[#d8e8eb]"
                  }`}
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Song Request
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                <div className="w-10 h-10 border-4 border-[#5795A7] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold">Loading All songs...</p>
              </div>
            ) : viewTab === "song-request" ? (
              <div className="max-w-2xl mx-auto py-4 animate-fade-in">
                <div className="bg-[#e8f1f3] border border-[#bcd3d8]/60 rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#1f4251] mb-2">
                      Request a Song
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Let us know if there is a song you would like to see added
                      to the All Songs index.
                    </p>
                  </div>

                  {requestSubmitted ? (
                    <div className="text-center py-8 space-y-4 animate-fade-in text-gray-800">
                      <div className="w-16 h-16 bg-[#e8f1f3] border-2 border-[#5795A7] rounded-full flex items-center justify-center mx-auto text-3xl">
                        🎉
                      </div>
                      <h3 className="text-xl font-bold text-[#1f4251]">
                        Thank You!
                      </h3>
                      <p className="text-sm text-gray-600 max-w-md mx-auto">
                        Your song request has been submitted successfully. Our
                        team will review and add it soon.
                      </p>
                      <button
                        onClick={() => setRequestSubmitted(false)}
                        className="px-6 py-2 bg-[#5795A7] hover:bg-[#478597] text-white font-bold rounded-xl transition-all shadow-sm shadow-[#5795A7]/20 active:scale-95 text-sm"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleRequestSubmit}
                      className="space-y-4 text-sm text-gray-800"
                    >
                      {requestErrors.submit && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                          ⚠️ {requestErrors.submit}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={requestForm.name}
                            onChange={(e) => {
                              setRequestForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }));
                              if (requestErrors.name)
                                setRequestErrors((prev) => ({
                                  ...prev,
                                  name: "",
                                }));
                            }}
                            className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 bg-white text-gray-800 transition-colors ${
                              requestErrors.name
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-[#5795A7] focus:ring-[#5795A7]"
                            }`}
                          />
                          {requestErrors.name && (
                            <p className="text-xs text-red-500 font-semibold mt-1">
                              {requestErrors.name}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                            Song Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter song title"
                            value={requestForm.songTitle}
                            onChange={(e) =>
                              setRequestForm((prev) => ({
                                ...prev,
                                songTitle: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#5795A7] focus:ring-1 focus:ring-[#5795A7] transition-colors bg-white text-gray-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                            Your Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="yourname@example.com"
                            value={requestForm.email}
                            onChange={(e) => {
                              setRequestForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }));
                              if (requestErrors.email)
                                setRequestErrors((prev) => ({
                                  ...prev,
                                  email: "",
                                }));
                            }}
                            className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 bg-white text-gray-800 transition-colors ${
                              requestErrors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200 focus:border-[#5795A7] focus:ring-[#5795A7]"
                            }`}
                          />
                          {requestErrors.email && (
                            <p className="text-xs text-red-500 font-semibold mt-1">
                              {requestErrors.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                            Language <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={requestForm.language}
                            onChange={(e) =>
                              setRequestForm((prev) => ({
                                ...prev,
                                language: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#5795A7] focus:ring-1 focus:ring-[#5795A7] transition-colors text-gray-800"
                          >
                            <option value="telugu">Telugu</option>
                            <option value="hindi">Hindi</option>
                            <option value="english">English</option>
                            <option value="others">Others</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={requestForm.phone}
                          onChange={(e) =>
                            setRequestForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#5795A7] focus:ring-1 focus:ring-[#5795A7] transition-colors bg-white text-gray-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                          Song Details / Lyrics / YouTube Link (Optional)
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Provide any details, lyrics or links to help us find the song..."
                          value={requestForm.details}
                          onChange={(e) =>
                            setRequestForm((prev) => ({
                              ...prev,
                              details: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#5795A7] focus:ring-1 focus:ring-[#5795A7] transition-colors resize-none bg-white text-gray-800"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={submittingRequest}
                          className="w-full py-3 bg-[#5795A7] hover:bg-[#478597] text-white font-bold rounded-xl transition-all shadow-md shadow-[#5795A7]/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
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
                {/* Index Tabs removed per request */}

                {/* Show Telugu Keyboard */}
                {viewTab === "home" && keyboardLanguage === "telugu" && (
                  <div className="bg-[#e8f1f3] border-2 border-[#bcd3d8] rounded-2xl py-3 px-2 sm:px-3 mb-8 max-w-5xl mx-auto shadow-inner sticky top-[85px] z-10">
                    <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 keyboard-grid">
                      {teluguAlphabet.map((letter) => {
                        const hasSongs = filteredSongsList.some(
                          (s) => getDynamicFirstLetter(s, "telugu") === letter,
                        );
                        return (
                          <button
                            key={letter}
                            disabled={!hasSongs}
                            onClick={() => {
                              const el = document.getElementById(
                                `letter-${letter}`,
                              );
                              if (el) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }
                            }}
                            className={`py-0 leading-none text-center rounded-lg font-normal transition-all border ${
                              hasSongs
                                ? "border-[#bcd3d8]/40 bg-white shadow-sm hover:border-[#bcd3d8] hover:bg-[#e8f1f3] text-[#5795A7] hover:text-[#1f4251] hover:shadow"
                                : "border-transparent bg-transparent text-gray-300 cursor-not-allowed opacity-30"
                            }`}
                            style={{
                              fontFamily: "var(--font-mallanna)",
                              fontSize: "40px",
                            }}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Show English Keyboard */}
                {viewTab === "home" && keyboardLanguage === "english" && (
                  <div className="bg-[#e8f1f3] border-2 border-[#bcd3d8] rounded-2xl py-3 px-2 sm:px-3 mb-8 max-w-5xl mx-auto shadow-inner sticky top-[85px] z-10">
                    <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 keyboard-grid">
                      {englishAlphabet.map((letter) => {
                        const hasSongs = filteredSongsList.some(
                          (s) => getDynamicFirstLetter(s, "english") === letter,
                        );
                        return (
                          <button
                            key={letter}
                            disabled={!hasSongs}
                            onClick={() => {
                              const el = document.getElementById(
                                `letter-${letter}`,
                              );
                              if (el) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                              }
                            }}
                            className={`py-0.5 leading-none text-center rounded-lg font-normal transition-all border ${
                              hasSongs
                                ? "border-[#bcd3d8]/40 bg-white shadow-sm hover:border-[#bcd3d8] hover:bg-[#e8f1f3] text-[#5795A7] hover:text-[#1f4251] hover:shadow"
                                : "border-transparent bg-transparent text-gray-300 cursor-not-allowed opacity-30"
                            }`}
                            style={{ fontSize: "32px" }}
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
                  let letterLang: "telugu" | "english" | "hindi" = "telugu";

                  if (
                    viewTab === "english-songs" ||
                    viewTab === "english-index"
                  ) {
                    alphabetToUse = englishAlphabet;
                    letterLang = "english";
                  } else if (viewTab === "hindi-songs") {
                    alphabetToUse = hindiAlphabet;
                    letterLang = "hindi";
                  } else if (
                    viewTab === "telugu-songs" ||
                    viewTab === "telugu-index"
                  ) {
                    alphabetToUse = teluguAlphabet;
                    letterLang = "telugu";
                  }

                  // Home tab displays mixed lists (Telugu, Hindi, and English alphabets)
                  const isHomeTab = viewTab === "home";
                  const alphabetsToGroup = isHomeTab
                    ? [teluguAlphabet, hindiAlphabet, englishAlphabet]
                    : [alphabetToUse];

                  return (
                    <>
                      {alphabetsToGroup.map((alphabet, aIdx) => {
                        let currentLang: "telugu" | "english" | "hindi" =
                          "telugu";
                        if (isHomeTab) {
                          if (aIdx === 0) currentLang = "telugu";
                          else if (aIdx === 1) currentLang = "hindi";
                          else if (aIdx === 2) currentLang = "english";
                        } else {
                          currentLang =
                            viewTab === "hindi-songs"
                              ? "hindi"
                              : viewTab === "english-songs" ||
                                  viewTab === "english-index"
                                ? "english"
                                : "telugu";
                        }

                        return alphabet.map((letter) => {
                          let languageTargetedSongs = filteredSongsList;

                          // In Home tab, we separate the languages into blocks.
                          // Otherwise, we show ALL filtered songs.
                          if (isHomeTab) {
                            if (currentLang === "telugu") {
                              languageTargetedSongs = filteredSongsList.filter(
                                (s) =>
                                  s.language === "telugu" ||
                                  s.language === "all",
                              );
                            } else if (currentLang === "hindi") {
                              languageTargetedSongs = filteredSongsList.filter(
                                (s) => s.language === "hindi",
                              );
                            } else if (currentLang === "english") {
                              languageTargetedSongs = filteredSongsList.filter(
                                (s) => s.language === "english",
                              );
                            }
                          }

                          const letterSongs = languageTargetedSongs.filter(
                            (s) =>
                              getDynamicFirstLetter(s, currentLang) === letter,
                          );
                          if (letterSongs.length === 0) return null;
                          return (
                            <div
                              key={`${letter}-${currentLang}`}
                              id={`letter-${letter}`}
                              className="mb-8 scroll-mt-24"
                            >
                              <div className="flex items-center gap-4 mb-6">
                                <span
                                  className="text-5xl md:text-6xl font-normal text-[#5795A7] leading-none shrink-0"
                                  style={{
                                    fontFamily:
                                      currentLang === "telugu"
                                        ? "var(--font-mallanna)"
                                        : currentLang === "hindi"
                                          ? "sans-serif"
                                          : "inherit",
                                  }}
                                >
                                  {letter}
                                </span>
                                <div className="flex-1 border-b border-gray-500 mt-2"></div>
                                <span className="text-lg md:text-xl font-bold text-[#1f4251] shrink-0 mt-2">
                                  {letterSongs.length} songs
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                {letterSongs.map((song, idx) => {
                                  // Determine which title format to show based on the active tab
                                  let displayTitle = song.title;
                                  if (
                                    viewTab === "telugu-songs" ||
                                    viewTab === "telugu-index"
                                  ) {
                                    displayTitle = extractTeluguTitle(
                                      song.title,
                                    );
                                  } else if (
                                    viewTab === "english-songs" ||
                                    viewTab === "english-index"
                                  ) {
                                    displayTitle = extractEnglishTitle(
                                      song.title,
                                    );
                                  }

                                  return (
                                    <button
                                      key={song.id}
                                      onClick={() => handleSelectSong(song)}
                                      className="song-btn text-left py-1 px-3 rounded-lg bg-transparent hover:bg-[#d1e3e8] text-[#3B7586] hover:text-[#1f4251] transition-colors duration-200 flex items-center gap-3 w-full"
                                      style={{
                                        fontFamily: "var(--font-mallanna)",
                                      }}
                                    >
                                      <span className="text-lg md:text-xl font-mono font-medium opacity-70 shrink-0">
                                        {idx + 1}.
                                      </span>
                                      <span className="leading-normal flex-1 text-2xl md:text-[28px] break-words">
                                        {displayTitle}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="text-right mt-4 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() =>
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    })
                                  }
                                  className="text-xs font-bold text-gray-400 hover:text-[#5795A7] transition-colors tracking-wider uppercase"
                                >
                                  Back to Top ↑
                                </button>
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
    <div className="min-h-screen bg-[#e8f1f3] py-8 px-4 md:px-8 font-sans">
      <div className="w-full max-w-[1500px] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200/80 flex flex-col md:flex-row min-h-[750px]">
        {/* Left column: Songs Index Search & List */}
        <div className="w-full md:w-[500px] border-r border-gray-200 p-6 flex flex-col flex-shrink-0 bg-[#FFFFFF]">
          <div className="mb-4">
            <button
              onClick={() => setViewState("index")}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#e8f1f3] hover:bg-[#c9e4eb] text-[#5795A7] font-bold text-xs transition-colors border border-[#bcd3d8]/40"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Index
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div>
              <div className="text-[11px] text-[#5795A7] font-bold uppercase tracking-wider">
                All Songs
              </div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-1.5 flex-wrap">
                For{" "}
                <span className="text-[#5795A7] text-5xl font-light">&quot;</span>
                <span
                  className="text-[#5795A7]"
                  style={getHeaderLetterStyle(selectedLetter)}
                >
                  {selectedLetter || "All"}
                </span>
                <span className="text-[#5795A7] text-5xl font-light">&quot;</span>
                <span className="text-sm text-gray-500 font-medium font-mono ml-0.5">
                  ({filteredSongsList.length} Songs)
                </span>
              </h2>
            </div>

            <div className="flex gap-2 relative" ref={letterPickerRef}>
              <button
                onClick={() =>
                  setViewMode((prev) =>
                    prev === "favorites" ? "all" : "favorites",
                  )
                }
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border shadow-sm ${
                  viewMode === "favorites"
                    ? "bg-[#5795A7] text-white border-[#5795A7] shadow-md shadow-[#5795A7]/20"
                    : "bg-white text-gray-400 hover:text-[#5795A7] hover:bg-[#e8f1f3] border-gray-200"
                }`}
                title={
                  viewMode === "favorites"
                    ? "Show All Songs"
                    : "Show Favorites Only"
                }
              >
                <svg
                  className="w-6 h-6"
                  fill={viewMode === "favorites" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <button
                onClick={() => setIsLetterPickerOpen(!isLetterPickerOpen)}
                className="w-12 h-12 rounded-full bg-[#e8f1f3] hover:bg-[#c9e4eb] text-[#5795A7] font-bold flex items-center justify-center transition-all border border-[#bcd3d8]/50 shadow-sm"
                title="Select Letter"
                style={getButtonLetterStyle(selectedLetter)}
              >
                {selectedLetter || "A"}
              </button>

              {isLetterPickerOpen && (
                <div className="absolute right-0 top-14 bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 w-72 z-40 max-h-96 overflow-y-auto">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Choose Letter
                  </h4>

                  <div className="flex justify-between gap-1 mb-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                      onClick={() => selectKeyboardLanguage("telugu")}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        keyboardLanguage === "telugu"
                          ? "bg-[#5795A7] text-white shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Telugu
                    </button>
                    <button
                      onClick={() => selectKeyboardLanguage("hindi")}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        keyboardLanguage === "hindi"
                          ? "bg-[#5795A7] text-white shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Hindi
                    </button>
                    <button
                      onClick={() => selectKeyboardLanguage("english")}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        keyboardLanguage === "english"
                          ? "bg-[#5795A7] text-white shadow-sm"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      English
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLetter("");
                      setLastSelectedLetter("");
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
                              setSelectedLetter("");
                              setLastSelectedLetter("");
                            } else {
                              setSelectedLetter(letter);
                              setLastSelectedLetter(letter);
                            }
                            setIsLetterPickerOpen(false);
                          }}
                          className={`py-1 text-center rounded-lg text-sm font-normal transition-all ${
                            selectedLetter === letter
                              ? "bg-[#5795A7] text-white scale-110 shadow-md shadow-[#5795A7]/30 font-semibold"
                              : hasSongs
                                ? "bg-gray-100 text-gray-800 hover:bg-[#e8f1f3] hover:text-[#5795A7] border border-gray-200/50"
                                : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-40"
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

          {viewMode === "categories" && (
            <div className="mb-4 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
              {DESIRED_CATEGORIES.map((cat) => {
                const count = songs.filter((s) => s.categories && s.categories.some((c) => c.name.toLowerCase().includes(cat.match))).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategorySlug === cat.slug
                        ? "bg-[#5795A7] text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Search Bar for sidebar */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-[#5795A7]/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search in this list..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-[#1f4251] placeholder-[#5795A7]/50 focus:border-[#5795A7] focus:ring-1 focus:ring-[#5795A7]/50 transition-all"
              />
              {searchVal && (
                <button
                  onClick={() => setSearchVal("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5795A7] hover:text-[#1f4251] transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar song list */}
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
                  className={`song-btn w-full text-left p-4 rounded-2xl transition-all duration-200 border flex gap-4 text-xl md:text-2xl items-center ${
                    activeSong?.id === song.id
                      ? "bg-[#d1e3e8] border-transparent text-[#3B7586] shadow-sm"
                      : "bg-[#FCFDFF] border-transparent hover:bg-white hover:shadow-[0_4px_12px_rgba(87,149,167,0.12)] hover:border-[#bcd3d8]/50 hover:text-[#3B7586] hover:-translate-y-0.5 text-gray-800"
                  }`}
                  style={{ fontFamily: "var(--font-mallanna)" }}
                >
                  <span className="text-lg md:text-xl font-mono opacity-65 pt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="leading-relaxed pt-1 pb-1 flex-1">
                    {keyboardLanguage === "telugu"
                      ? extractTeluguTitle(song.title)
                      : keyboardLanguage === "english"
                        ? extractEnglishTitle(song.title)
                        : song.title}
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
                    onClick={() =>
                      setFontSize((prev) => Math.max(12, prev - 2))
                    }
                    className="w-7 h-7 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 font-extrabold flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all text-sm"
                  >
                    &mdash;
                  </button>
                  <button
                    onClick={() => {
                      setFontSize(24);
                      setLineHeight(2.0);
                      setFontFamily("var(--font-mallanna)");
                    }}
                    className="px-3 h-7 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all text-[11px] font-bold"
                    title="Reset Font Size, Font Family, and Spacing"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() =>
                      setFontSize((prev) => Math.min(36, prev + 2))
                    }
                    className="w-7 h-7 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 font-extrabold flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Font Family Adjuster */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-100 rounded-xl p-1 shadow-inner border border-gray-200/50">
                  <span className="pl-2 pr-1">Font :</span>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg text-gray-700 text-xs px-2 py-1 outline-none shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <option value="var(--font-mallanna)">Mallanna</option>
                    <option value="var(--font-mallanna)">Ramabhadra</option>
                    <option value="var(--font-mallanna)">Suranna</option>
                    <option value="var(--font-poppins)">Poppins</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Nirmala UI', sans-serif">Nirmala UI</option>
                    <option value="'Segoe UI', sans-serif">Segoe UI</option>
                    <option value="'Courier New', monospace">Courier New</option>
                  </select>
                </div>

                {/* Line Height Slider */}
                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold bg-gray-100 rounded-xl px-3 py-1 shadow-inner border border-gray-200/50">
                  <span>Spacing :</span>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    className="w-20 md:w-24 accent-[#5795A7] cursor-pointer"
                  />
                  <span className="w-6 text-right">{lineHeight.toFixed(1)}</span>
                </div>

                {/* Toolbar Buttons */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-600">
                  <div className="relative group">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm transition-all">
                      <span>☁</span> Lyrics Download
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

                  <button
                    onClick={downloadAudio}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm transition-all"
                  >
                    <span>🎵</span> Audio Download
                  </button>
                </div>
              </div>

              {/* Title Header with Favorite Heart button */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1
                    className="text-3xl md:text-4xl font-normal text-[#3B7586] leading-normal py-1"
                    style={{ fontFamily: "var(--font-mallanna)" }}
                  >
                    {keyboardLanguage === "telugu"
                      ? extractTeluguTitle(activeSong.title)
                      : keyboardLanguage === "english"
                        ? extractEnglishTitle(activeSong.title)
                        : activeSong.title}
                  </h1>

                  {activeSong.categories &&
                    activeSong.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {activeSong.categories.map((c) => (
                          <span
                            key={c.id}
                            className="bg-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                          >
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
                      ? "bg-[#e8f1f3] text-[#5795A7] border-[#bcd3d8] shadow-sm"
                      : "bg-white text-gray-400 hover:text-[#5795A7] hover:bg-[#e8f1f3] border-gray-200"
                  }`}
                  title={
                    favorites.includes(activeSong.slug)
                      ? "Remove from Favorites"
                      : "Add to Favorites"
                  }
                >
                  <svg
                    className="w-6 h-6"
                    fill={
                      favorites.includes(activeSong.slug)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Language Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-6 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                {activeSong.telugu_lyrics && (
                  <button
                    onClick={() => setActiveLyricsTab("telugu")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLyricsTab === "telugu"
                        ? "bg-white text-[#5795A7] shadow-sm border border-[#5795A7]/20 font-extrabold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Telugu Lyrics
                  </button>
                )}
                {activeSong.english_lyrics && (
                  <button
                    onClick={() => setActiveLyricsTab("english")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLyricsTab === "english"
                        ? "bg-white text-[#5795A7] shadow-sm border border-[#5795A7]/20 font-extrabold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    English Lyrics
                  </button>
                )}
                {activeSong.hindi_lyrics && (
                  <button
                    onClick={() => setActiveLyricsTab("hindi")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeLyricsTab === "hindi"
                        ? "bg-white text-[#5795A7] shadow-sm border border-[#5795A7]/20 font-extrabold"
                        : "text-gray-500 hover:text-gray-800"
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
                    className="prose max-w-none text-gray-800 leading-[var(--lyrics-line-height)] select-text [&_p]:mb-5 [&_p]:leading-[var(--lyrics-line-height)] [&_p_br]:mb-0 [&_br]:mb-0 print:text-black"
                    style={{ 
                      fontFamily, 
                      "--lyrics-line-height": lineHeight 
                    } as React.CSSProperties}
                    dangerouslySetInnerHTML={{
                      __html: formatLyrics(activeContent),
                    }}
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
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-1">
                Choose Song To View The Lyrics
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Select a song from the index list on the left to display its
                lyrics here.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-lyrics,
          .print-lyrics * {
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#e8f1f3] flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 w-80">
            <div className="w-12 h-12 border-4 border-[#5795A7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">
              Loading Lyrics Index...
            </p>
          </div>
        </div>
      }
    >
      <SongsDashboard />
    </Suspense>
  );
}

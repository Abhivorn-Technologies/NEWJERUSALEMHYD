'use client';
import { useEffect, useState } from 'react';

interface HeroItem {
  id: number;
  icon: string;
  text: string;
  order: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function HeroBanner() {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/hero-items/`)
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter((item: HeroItem) => 
          !item.text.toLowerCase().includes('worship timings') && 
          !item.text.includes('α░åα░░α░╛α░ºα░¿ α░╕α░«α░»α░╛α░▓α▒ü')
        );
        setHeroItems(filtered);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-white h-auto md:h-[calc(100vh-75px)] md:min-h-[600px] md:max-h-[840px] md:max-h-[900px] w-full flex flex-col md:block">
      
      {/* Wave Background Layers Container (starts responsively to align with the middle of the book cover) */}
      <div className="absolute top-[160px] md:top-[125px] lg:top-[145px] xl:top-[165px] bottom-0 left-0 w-full pointer-events-none overflow-hidden">
        
        {/* Wave 1: Back layer (White - Slow) */}
        <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-slow opacity-15" style={{ zIndex: 1 }}>
          <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            <rect x="0" y="0" width="2000" height="30" fill="#ffffff" />
            <g transform="translate(0, 25)">
              <path
                d="M 0 0 L 0 160 C 80 180, 140 210, 200 210 C 260 210, 320 160, 380 160 C 430 160, 480 235, 530 235 C 580 235, 640 140, 700 140 C 750 140, 800 230, 850 230 C 900 230, 950 180, 1000 160 C 1080 180, 1140 210, 1200 210 C 1260 210, 1320 160, 1380 160 C 1430 160, 1480 235, 1530 235 C 1580 235, 1640 140, 1700 140 C 1750 140, 1800 230, 1850 230 C 1900 230, 1950 180, 2000 160 L 2000 0 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </div>

        {/* Wave 2: Middle layer (Semi-transparent White - Reverse) */}
        <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-mid opacity-25" style={{ zIndex: 2, animationDirection: 'reverse' }}>
          <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            <rect x="0" y="0" width="2000" height="30" fill="#ffffff" />
            <g transform="translate(0, 25)">
              <path
                d="M 0 0 L 0 140 C 80 160, 140 190, 200 190 C 260 190, 320 140, 380 140 C 430 140, 480 220, 530 220 C 580 220, 640 120, 700 120 C 750 120, 800 210, 850 210 C 900 210, 950 160, 1000 140 C 1080 160, 1140 190, 1200 190 C 1260 190, 1320 140, 1380 140 C 1430 140, 1480 220, 1530 220 C 1580 220, 1640 120, 1700 120 C 1750 120, 1800 210, 1850 210 C 1900 210, 1950 160, 2000 140 L 2000 0 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </div>

        {/* Wave 3: Middle-Front layer (White Wave - Fast) */}
        <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-fast opacity-50" style={{ zIndex: 3 }}>
          <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            <rect x="0" y="0" width="2000" height="30" fill="#ffffff" />
            <g transform="translate(0, 25)">
              <path
                d="M 0 0 L 0 145 C 80 165, 140 195, 200 195 C 260 195, 320 145, 380 145 C 430 145, 480 225, 530 225 C 580 225, 640 125, 700 125 C 750 125, 800 215, 850 215 C 900 215, 950 165, 1000 145 C 1080 165, 1140 195, 1200 195 C 1260 195, 1320 145, 1380 145 C 1430 145, 1480 225, 1530 225 C 1580 225, 1640 125, 1700 125 C 1750 125, 1800 215, 1850 215 C 1900 215, 1950 165, 2000 145 L 2000 0 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </div>

        {/* Wave 4: Front Solid White layer (defines the boundary) */}
        <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-mid" style={{ zIndex: 4 }}>
          <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            <rect x="0" y="0" width="2000" height="30" fill="#ffffff" />
            <g transform="translate(0, 25)">
              <path
                d="M 0 0 L 0 150 C 80 170, 140 200, 200 200 C 260 200, 320 150, 380 150 C 430 150, 480 230, 530 230 C 580 230, 640 130, 700 130 C 750 130, 800 220, 850 220 C 900 220, 950 170, 1000 150 C 1080 170, 1140 200, 1200 200 C 1260 200, 1320 150, 1380 150 C 1430 150, 1480 230, 1530 230 C 1580 230, 1640 130, 1700 130 C 1750 130, 1800 220, 1850 220 C 1900 220, 1950 170, 2000 150 L 2000 0 Z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </div>

        {/* Wave 5: Highlight Teal Wave 1 (Semi-transparent Light Blue Ribbon) */}
        <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-fast" style={{ zIndex: 5 }}>
          <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            <g transform="translate(0, 25)">
              <path
                d="M 0 150 C 80 170, 140 200, 200 200 C 260 200, 320 150, 380 150 C 430 150, 480 230, 530 230 C 580 230, 640 130, 700 130 C 750 130, 800 220, 850 220 C 900 220, 950 170, 1000 150 C 1080 170, 1140 200, 1200 200 C 1260 200, 1320 150, 1380 150 C 1430 150, 1480 230, 1530 230 C 1580 230, 1640 130, 1700 130 C 1750 130, 1800 220, 1850 220 C 1900 220, 1950 170, 2000 150 L 2000 1000 L 0 1000 Z"
                fill="#E0F8FB"
                opacity="0.3"
              />
            </g>
          </svg>
        </div>

        {/* Wave 6: Highlight Teal Wave 2 (Medium Teal Ribbon) */}
        <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-mid" style={{ zIndex: 6 }}>
          <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            <g transform="translate(0, 25)">
              <path
                d="M 0 160 C 80 180, 140 210, 200 210 C 260 210, 320 160, 380 160 C 430 160, 480 240, 530 240 C 580 240, 640 140, 700 140 C 750 140, 800 230, 850 230 C 900 230, 950 180, 1000 160 C 1080 180, 1140 210, 1200 210 C 1260 210, 1320 160, 1380 160 C 1430 160, 1480 240, 1530 240 C 1580 240, 1640 140, 1700 140 C 1750 140, 1800 230, 1850 230 C 1900 230, 1950 180, 2000 160 L 2000 1000 L 0 1000 Z"
                fill="#A4DCE0"
                opacity="0.45"
              />
            </g>
          </svg>
        </div>

        {/* Wave 7: Highlight Teal Wave 3 (Darker Teal Ribbon) */}
        <div className="absolute top-0 left-0 w-[200%] h-full animate-wave-slow" style={{ zIndex: 7 }}>
          <svg className="w-full h-full" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            <g transform="translate(0, 25)">
              <path
                d="M 0 170 C 80 190, 140 220, 200 220 C 260 220, 320 170, 380 170 C 430 170, 480 250, 530 250 C 580 250, 640 150, 700 150 C 750 150, 800 240, 850 240 C 900 240, 950 190, 1000 170 C 1080 190, 1140 220, 1200 220 C 1260 220, 1320 170, 1380 170 C 1430 170, 1480 250, 1530 250 C 1580 250, 1640 150, 1700 150 C 1750 150, 1800 240, 1850 240 C 1900 240, 1950 190, 2000 170 L 2000 1000 L 0 1000 Z"
                fill="#7ACED4"
                opacity="0.6"
              />
            </g>
          </svg>
        </div>

      </div>

      {/* Subtitle (Chinna Pillala...) centered slightly to the left */}
      <div className="relative md:absolute md:left-[42%] md:-translate-x-1/2 top-[2px] sm:top-[4px] md:top-[6px] lg:top-[8px] z-30 w-full md:w-[90%] max-w-4xl flex justify-center pointer-events-none pt-2 pb-1 px-4">
        <span 
          className="text-[#102E44] text-[13px] sm:text-[14px] md:text-[17px] lg:text-[21px] font-normal text-center select-none leading-normal font-sans"
          style={{ fontFamily: 'var(--font-mandali)' }}
        >
          α░Üα░┐α░¿α▒ìα░¿ α░¬α░┐α░▓α▒ìα░▓α░▓ α░åα░ºα▒ìα░»α░╛α░ñα▒ìα░«α░┐α░òα░«α▒êα░¿ α░Äα░ªα▒üα░ùα▒üα░ªα░▓ α░òα▒èα░░α░òα▒ü
        </span>
      </div>

      {/* Menu List Items & Ribbon (Right - placed near the top to reduce spacing) */}
      <div className="relative md:absolute md:right-[2%] sm:right-[5%] md:right-[8%] lg:right-[10%] top-[2px] sm:top-[4px] md:top-[6px] lg:top-[8px] w-full max-w-2xl md:w-auto md:max-w-[700px] lg:max-w-[900px] z-30 flex flex-row items-center justify-around md:justify-end gap-2.5 sm:gap-10 md:gap-8 mt-8 mb-6 md:my-0 px-2 sm:px-12 md:px-6">
        
        {/* Slanted Folded Ribbon: "α░¬α▒éα░░α▒ìα░ñα░┐α░ùα░╛ α░ëα░Üα░┐α░ñα░«α▒ü" designed exactly like the reference image */}
        <div className="hidden relative w-[110px] sm:w-[170px] md:w-[240px] lg:w-[280px] aspect-[400/180] select-none mb-0 transform translate-x-[40px] sm:translate-x-[60px] md:translate-x-[80px] lg:translate-x-[100px] -translate-y-[10px] md:-translate-y-[20px] flex-shrink-0">
          <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
            <defs>
              {/* Top Banner Gradient */}
              <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00A6CB" />
                <stop offset="100%" stopColor="#008CA8" />
              </linearGradient>
              {/* Bottom Banner Gradient */}
              <linearGradient id="bottomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00B5DA" />
                <stop offset="100%" stopColor="#0097B5" />
              </linearGradient>
              {/* Shadow Fold Gradient */}
              <linearGradient id="foldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#002D37" />
                <stop offset="100%" stopColor="#004D5C" />
              </linearGradient>
              {/* Drop Shadow filter for premium 3D look */}
              <filter id="ribbonShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#00181C" floodOpacity="0.45" />
              </filter>
            </defs>

            <g transform="rotate(-6 200 90)">
              {/* Speed lines above top banner */}
              <line x1="80" y1="18" x2="160" y2="18" stroke="#00A6CB" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
              <line x1="120" y1="24" x2="280" y2="24" stroke="#00A6CB" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
              
              {/* Speed lines to the right of top banner */}
              <line x1="310" y1="42" x2="360" y2="42" stroke="#00A6CB" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
              <line x1="320" y1="50" x2="350" y2="50" stroke="#00A6CB" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />

              {/* Connecting Fold (Shadow) - rendered under top banner but on top of bottom banner */}
              <path 
                d="M 235 90 L 260 30 L 320 30 L 295 60 L 320 90 Z" 
                fill="url(#foldGrad)" 
              />

              {/* Top Banner: "α░¬α▒éα░░α▒ìα░ñα░┐α░ùα░╛" */}
              <path 
                d="M 60 30 L 260 30 L 240 90 L 40 90 Z" 
                fill="url(#topGrad)" 
                filter="url(#ribbonShadow)"
              />
              <text 
                x="150" 
                y="70" 
                fill="#ffffff" 
                fontSize="24px" 
                fontWeight="900" 
                textAnchor="middle" 
                style={{ fontFamily: 'var(--font-poppins)', letterSpacing: '0.05em' }}
              >
                α░¬α▒éα░░α▒ìα░ñα░┐α░ùα░╛
              </text>

              {/* Bottom Banner: "α░ëα░Üα░┐α░ñα░«α▒ü" */}
              <path 
                d="M 100 90 L 300 90 L 280 150 L 80 150 Z" 
                fill="url(#bottomGrad)" 
                filter="url(#ribbonShadow)"
              />
              <text 
                x="190" 
                y="132" 
                fill="#ffffff" 
                fontSize="34px" 
                fontWeight="900" 
                textAnchor="middle" 
                style={{ fontFamily: 'var(--font-ramabhadra)', letterSpacing: '0.05em' }}
              >
                α░ëα░Üα░┐α░ñα░«α▒ü
              </text>
              
              {/* Speed lines below bottom banner */}
              <line x1="50" y1="162" x2="220" y2="162" stroke="#00B5DA" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
              <line x1="90" y1="168" x2="170" y2="168" stroke="#00B5DA" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        <div className="w-auto transform self-start mt-4 md:mt-[40px] lg:mt-[50px] ml-auto translate-x-[40px] sm:translate-x-[60px] md:translate-x-[100px] lg:translate-x-[130px]" style={{ fontFamily: 'var(--font-mandali)' }}>
          {/* Two columns layout for the bullet points */}
          <div className="flex gap-1 sm:gap-2 md:gap-3 text-[#102E44]">
            {/* First Column */}
            <div className="flex flex-col items-start gap-1.5 sm:gap-2 md:gap-2.5">
              {[
                "α░¼α▒êα░¼α░┐α░▓α▒ì α░òα░Ñα░▓α▒ü",
                "α░«α░┐α░╖α░¿α░░α▒Ç α░òα░Ñα░▓α▒ü",
                "α░òα░éα░áα░ñα░╛α░╡α░╛α░òα▒ìα░»α░«α▒üα░▓α▒ü"
              ].map((text, idx) => (
                <div key={idx} className="text-left font-normal text-[10px] sm:text-sm md:text-base lg:text-lg whitespace-nowrap">
                  {text}
                </div>
              ))}
            </div>
            {/* Second Column */}
            <div className="flex flex-col items-start gap-1.5 sm:gap-2 md:gap-2.5">
              {[
                "α░¬α▒ìα░░α░╛α░░α▒ìα░Ñα░¿α░▓α▒ü",
                "α░¬α░ªα░╡α░┐α░¿α▒ïα░ªα░╛α░▓α▒ü",
                "α░òα▒ìα░░α░╛α░½α▒ìα░ƒα▒ì α░╡α░░α▒ìα░òα▒ì α░ùα▒çα░«α▒ìα░╕α▒ì"
              ].map((text, idx) => (
                <div key={idx} className="text-left font-normal text-[10px] sm:text-sm md:text-base lg:text-lg whitespace-nowrap">
                  {text}
                </div>
              ))}
              <div className="text-left font-normal text-[10px] sm:text-sm md:text-base lg:text-lg tracking-wide whitespace-nowrap mt-1">
                α░çα░éα░òα░╛ α░«α░░α▒åα░¿α▒ìα░¿α▒ï ...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Book Cover & Stylized Title Image */}
      <div className="relative md:absolute md:left-[3%] sm:left-[5%] md:left-[6%] lg:left-[8%] md:top-[3%] sm:top-[4%] md:top-[4%] lg:top-[5%] z-30 flex items-center justify-center md:justify-start gap-2.5 md:gap-3 lg:gap-4 py-2 w-full md:w-auto mt-[-32px] md:mt-0">
        {/* Book Cover Image */}
        <div className="w-[90px] sm:w-[145px] md:w-[185px] lg:w-[225px] origin-bottom-left flex-shrink-0 -translate-y-10 md:-translate-y-18 transform translate-x-3 md:translate-x-8">
          <img
            src="/wp-content/uploads/2026/03/book-image.png"
            alt="Book Cover"
            className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(16,46,68,0.25)] hover:drop-shadow-[0_16px_32px_rgba(16,46,68,0.35)] transition-all duration-300"
          />
        </div>

        {/* Stylized Title, Boat & Fish - 3 separate images composed together */}
        <div 
          className="w-[215px] sm:w-[350px] md:w-[380px] lg:w-[480px] xl:w-[580px] flex-shrink-0 transform translate-y-1 sm:translate-y-2 md:translate-y-3 lg:translate-y-4 origin-bottom-right relative"
        >
          {/* Chinnarula Jalari Title Text Image - top left */}
          <img
            src="/wp-content/2026/03/text-image.png"
            alt="α░Üα░┐α░¿α▒ìα░¿α░╛α░░α▒üα░▓ α░£α░╛α░▓α░░α░┐"
            className="w-[58%] h-auto object-contain absolute top-[-5%] left-[1%] md:-left-[3%] z-10"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(16,46,68,0.15))' }}
          />
          
          {/* Custom Ribbon Shape Button */}
          <div className="absolute top-[40%] sm:top-[45%] md:top-[45%] lg:top-[48%] left-[3%] md:left-[0%] lg:-left-[1%] z-30 group cursor-pointer inline-block">
            {/* Ribbon 3D Shadow/Fold behind */}
            <div 
              className="absolute top-[4px] left-[4px] w-full h-full bg-[#003138] z-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 shadow-lg"
              style={{ transform: 'skewX(-15deg)' }}
            ></div>
            
            {/* Main Ribbon Body */}
            <button
              className="relative z-10 flex items-center justify-center px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2 bg-gradient-to-r from-[#00A6CB] to-[#008CA8] border border-[#00B5DA] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 overflow-hidden"
              style={{ transform: 'skewX(-15deg)' }}
              onClick={(e) => {
                e.preventDefault();
                // Link will be added here later
              }}
            >
              {/* Glossy reflection effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

              <span 
                className="relative z-20 inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] font-[800] text-white uppercase tracking-wider drop-shadow-md"
                style={{ fontFamily: 'var(--font-poppins)', transform: 'skewX(15deg)' }}
              >
                Click here to Subscribe
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>

          {/* Boat Image - top right, larger size */}
          <img
            src="/wp-content/2026/03/boat.png"
            alt="Boat"
            className="w-[64%] h-auto object-contain absolute top-[-5%] right-[-8%] z-20"
            style={{
              filter: 'drop-shadow(0 4px 10px rgba(16,46,68,0.2))',
              animation: 'float-book 12s ease-in-out infinite'
            }}
          />

          {/* Invisible spacer to maintain container height */}
          <div className="w-full" style={{ paddingTop: '90%' }} />
        </div>
      </div>

      {/* Welcome Message overlaying the bottom waves */}
      <div className="relative md:absolute bottom-0 md:left-1/2 md:-translate-x-1/2 w-full max-w-7xl px-6 pb-2 z-30 text-slate-800 text-left space-y-3 sm:space-y-4 select-none mt-3 md:mt-0">
        <h2 
          className="text-base sm:text-lg md:text-xl lg:text-[23px] font-normal text-[#102E44] tracking-wide"
          style={{ fontFamily: 'var(--font-ramabhadra)' }}
        >
          α░¿α▒éα░ñα░¿ α░»α▒åα░░α▒éα░╖α░▓α▒çα░«α▒ü α░¬α░░α░┐α░Üα░░α▒ìα░»α░▓ α░╡α▒åα░¼α▒ì α░╕α▒êα░ƒα▒ì α░òα▒ü α░╕α▒ìα░╡α░╛α░ùα░ñα░é!
        </h2>

        {/* Paragraph + Fish side by side after α░╕α▒ìα░╡α░╛α░ùα░ñα░é ΓÇö fish never touches text */}
        <div className="relative">
          <p 
            className="text-[12px] sm:text-sm md:text-[15px] lg:text-[18px] leading-relaxed font-[400] text-[#1F3E50] md:pr-[170px] lg:pr-[220px] text-justify"
            style={{ fontFamily: 'var(--font-mandali)' }}
          >
            α░¿α▒éα░ñα░¿ α░»α▒åα░░α▒éα░╖α░▓α▒çα░«α▒ü α░¬α░░α░┐α░Üα░░α▒ìα░»α░▓α▒ü α░àα░¿α▒ç α░ê α░╡α▒åα░¼α▒ìα░╕α▒êα░ƒα▒ì α░ñα▒åα░▓α▒üα░ùα▒ü α░òα▒ìα░░α▒êα░╕α▒ìα░ñα░╡ α░╕α░éα░ÿα░╛α░¿α░┐α░òα░┐ α░åα░ºα▒ìα░»α░╛α░ñα▒ìα░«α░┐α░ò, α░àα░¿α▒üα░╕α░░α░úα▒Çα░», α░╕α░ñα▒ìα░»α░╡α▒çα░ª α░╡α░╛α░òα▒ìα░»α░╛α░▓α░¿α▒ü α░ñα▒åα░▓α▒üα░ùα▒üα░▓α▒ï α░àα░éα░ªα░┐α░╕α▒ìα░ñα▒üα░éα░ªα░┐. α░çα░éα░ªα▒üα░▓α▒ï α░Äα░¿α▒ìα░¿α▒ï α░¬α▒ìα░░α░ñα▒ìα░»α▒çα░òα░«α▒êα░¿ α░òα▒ìα░░α▒êα░╕α▒ìα░ñα░╡ α░¬α▒üα░╕α▒ìα░ñα░òα░╛α░▓α▒ü, α░¼α▒êα░¼α░┐α░▓α▒üα░¿α▒ü α░▓α▒ïα░ñα▒üα░ùα░╛ α░àα░ºα▒ìα░»α░»α░¿α░é α░Üα▒çα░»α░íα░╛α░¿α░┐α░òα░┐ α░╕α░╣α░╛α░»α░¬α░íα▒ç α░╡α▒ìα░»α░╛α░ûα▒ìα░»α░╛α░¿α░╛α░▓α▒ü, α░çα░éα░òα░╛ α░«α░░α▒åα░¿α▒ìα░¿α▒ï α░╡α░¿α░░α▒üα░▓α▒ü, α░ñα▒åα░▓α▒üα░ùα▒üα░▓α▒ï α░àα░éα░ªα▒üα░¼α░╛α░ƒα▒üα░▓α▒ï α░ëα░¿α▒ìα░¿α░╛α░»α░┐. α░çα░╡α░┐ α░Üα░ªα░╡α░íα░é/α░╡α░┐α░¿α░íα░é α░ªα▒ìα░╡α░╛α░░α░╛ α░ªα▒üα░░α▒ìα░¼α▒ïα░ºα░▓α░òα▒ü α░óα▒Çα░ƒα▒êα░¿ α░╕α░«α░╛α░ºα░╛α░¿α░╛α░▓α░¿α▒ü α░ñα▒åα░▓α▒üα░╕α▒üα░òα▒ïα░╡α░íα░«α▒ç α░òα░╛α░òα▒üα░éα░íα░╛, α░ªα▒üα░░α▒ìα░¼α▒ïα░ºα░òα▒üα░▓α░òα▒ü α░«α░░α░┐α░»α▒ü α░╡α░┐α░«α░░α▒ìα░╢α░òα▒üα░▓α░òα▒ü α░▓α▒çα░ûα░¿α░╛α░¿α▒üα░╕α░╛α░░α░«α▒êα░¿ α░╕α░«α░╛α░ºα░╛α░¿α░╛α░▓α░¿α▒ü α░Äα░▓α░╛ α░çα░╡α▒ìα░╡α░╛α░▓α▒ï α░òα▒éα░íα░╛ α░«α▒Çα░░α▒ü α░¿α▒çα░░α▒ìα░Üα▒üα░òα▒üα░éα░ƒα░╛α░░α▒ü. α░£α▒Çα░╡α░┐α░ñα░éα░▓α▒ï α░Äα░ªα▒üα░░α░»α▒ìα░»α▒ç α░àα░¿α▒çα░ò α░Üα░┐α░òα▒ìα░òα▒ü α░¬α▒ìα░░α░╢α▒ìα░¿α░▓α░òα▒ü α░¼α▒êα░¼α░┐α░▓α▒ì α░åα░ºα░╛α░░α░┐α░ñ α░╕α░«α░╛α░ºα░╛α░¿α░╛α░▓α░ñα▒ï α░¿α░┐α░╡α▒âα░ñα▒ìα░ñα░┐α░¿α░┐ α░òα░▓α░┐α░ùα░┐α░éα░Üα▒çα░▓α░╛ α░ê α░╡α▒åα░¼α▒ìα░╕α▒êα░ƒα▒ì α░«α▒Çα░òα▒ïα░╕α░é α░¿α░┐α░░α▒ìα░«α░┐α░éα░Üα░¼α░íα░┐α░éα░ªα░┐.
          </p>
          {/* Fish ΓÇö smaller size */}
          <img
            src="/wp-content/2026/03/fish.png"
            alt="Fish"
            className="hidden md:block absolute right-0 top-[15%] w-[140px] lg:w-[190px] h-auto object-contain pointer-events-none -z-10"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(16,46,68,0.2))',
              transform: 'translateY(-50%) rotate(45deg)'
            }}
          />
        </div>

        {/* Scroll Divider Ornament */}
        <div className="flex justify-center pt-0 mt-[-4px] select-none pointer-events-none">
          <svg width="220" height="20" viewBox="0 0 220 24" fill="none" className="text-[#102E44] opacity-70">
            {/* Decorative center scroll curls */}
            <path d="M110 12 C115 8, 118 4, 120 4 C123 4, 125 8, 122 12 C119 16, 115 16, 110 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M110 12 C105 8, 102 4, 100 4 C97 4, 95 8, 98 12 C101 16, 105 16, 110 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <circle cx="110" cy="12" r="2.5" fill="currentColor" />
            {/* Scroll flourishes extending left and right */}
            <path d="M90 12 C75 12, 65 8, 50 12 C35 16, 20 12, 10 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M130 12 C145 12, 155 8, 170 12 C185 16, 195 12, 210 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            {/* Accents dots */}
            <circle cx="70" cy="12" r="1.5" fill="currentColor" />
            <circle cx="150" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>

    </section>
  );
}

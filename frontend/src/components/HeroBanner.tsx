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
          !item.text.includes('ఆరాధన సమయాలు')
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
          className="text-[#102E44] text-[15px] sm:text-[16px] md:text-[20px] lg:text-[25px] font-[600] text-center select-none leading-normal font-sans"
          style={{ fontFamily: 'var(--font-mallanna)' }}
        >
          చిన్న పిల్లల ఆధ్యాత్మికమైన ఎదుగుదల కొరకు
        </span>
      </div>

      {/* Menu List Items & Ribbon (Right - placed near the top to reduce spacing) */}
      <div className="relative md:absolute md:right-[2%] sm:right-[5%] md:right-[8%] lg:right-[10%] top-[2px] sm:top-[4px] md:top-[6px] lg:top-[8px] w-full max-w-2xl md:w-auto md:max-w-[460px] lg:max-w-[520px] z-30 flex flex-row md:flex-col items-center justify-around md:justify-end md:items-end gap-2.5 sm:gap-10 md:gap-0 mt-8 mb-6 md:my-0 px-2 sm:px-12 md:px-6">
        
        {/* Slanted Folded Ribbon: "పూర్తిగా ఉచితము" designed exactly like the reference image */}
        <div className="relative w-[135px] sm:w-[215px] md:w-[300px] lg:w-[360px] aspect-[400/180] select-none mb-0 md:mb-8 md:-translate-x-[60px] lg:-translate-x-[80px] flex-shrink-0">
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

              {/* Top Banner: "పూర్తిగా" */}
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
                పూర్తిగా
              </text>

              {/* Bottom Banner: "ఉచితము" */}
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
                ఉచితము
              </text>
              
              {/* Speed lines below bottom banner */}
              <line x1="50" y1="162" x2="220" y2="162" stroke="#00B5DA" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
              <line x1="90" y1="168" x2="170" y2="168" stroke="#00B5DA" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        <div className="w-auto max-w-[180px] sm:max-w-full transform -translate-x-1 md:translate-x-0" style={{ fontFamily: 'var(--font-tenali)' }}>
          {/* Two-column layout for the bullet points */}
          <div className="flex justify-between gap-2.5 sm:gap-8 md:gap-12 text-[#102E44]">
            {/* Left Column */}
            <div className="space-y-2.5 md:space-y-4">
              {[
                "బైబిల్ కథలు",
                "మిషనరీ కథలు",
                "కంఠతావాక్యములు"
              ].map((text, idx) => (
                <div key={idx} className="text-left font-semibold text-[11px] sm:text-base md:text-lg lg:text-[21px] whitespace-nowrap">
                  {text}
                </div>
              ))}
            </div>
            {/* Right Column */}
            <div className="space-y-2.5 md:space-y-4">
              {[
                "ప్రార్థనలు",
                "పదవినోదాలు",
                "క్రాఫ్ట్ వర్క్ గేమ్స్"
              ].map((text, idx) => (
                <div key={idx} className="text-left font-semibold text-[11px] sm:text-base md:text-lg lg:text-[21px] whitespace-nowrap">
                  {text}
                </div>
              ))}
            </div>
          </div>
          {/* Center-bottom label */}
          <div className="text-center mt-1.5 sm:mt-6">
            <span className="text-[#102E44] font-extrabold text-[11px] sm:text-base md:text-lg lg:text-[22px] tracking-wide">
              ఇంకా మరెన్నో ...
            </span>
          </div>
        </div>
      </div>

      {/* Combined Book Cover & Stylized Title Image */}
      <div className="relative md:absolute md:left-[3%] sm:left-[5%] md:left-[6%] lg:left-[8%] md:top-[3%] sm:top-[4%] md:top-[4%] lg:top-[5%] z-30 flex items-center justify-center md:justify-start gap-2.5 md:gap-3 lg:gap-4 py-2 w-full md:w-auto mt-[-32px] md:mt-0">
        {/* Book Cover Image */}
        <div className="w-[90px] sm:w-[145px] md:w-[185px] lg:w-[225px] animate-book origin-bottom-left flex-shrink-0">
          <img
            src="/wp-content/uploads/2026/03/book-image.png"
            alt="Book Cover"
            className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(16,46,68,0.25)] hover:drop-shadow-[0_16px_32px_rgba(16,46,68,0.35)] transition-all duration-300"
          />
        </div>

        {/* Stylized Title, Boat & Fish combined Image (Placed right after the book) */}
        <div 
          className="w-[215px] sm:w-[350px] md:w-[380px] lg:w-[480px] xl:w-[580px] flex-shrink-0 transform translate-y-1 sm:translate-y-2 md:translate-y-3 lg:translate-y-4 origin-bottom-right"
          style={{ animation: 'float-book 12s ease-in-out infinite' }}
        >
          <img
            src="/images/boat_with background.png"
            alt="Chinnarula Jalari, Boat and Fish"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Welcome Message overlaying the bottom waves */}
      <div className="relative md:absolute bottom-0 md:left-1/2 md:-translate-x-1/2 w-full max-w-7xl px-6 pb-2 z-30 text-slate-800 text-center space-y-3 sm:space-y-4 select-none mt-3 md:mt-0">
        <h2 
          className="text-base sm:text-lg md:text-xl lg:text-[23px] font-bold text-[#102E44] tracking-wide"
          style={{ fontFamily: 'var(--font-ramabhadra)' }}
        >
          నూతన యెరూషలేము పరిచర్యల వెబ్ సైట్ కు స్వాగతం!
        </h2>
        <p 
          className="text-[12px] sm:text-sm md:text-[15px] lg:text-[18px] leading-relaxed font-[400] text-[#1F3E50]"
          style={{ fontFamily: 'var(--font-tenali)' }}
        >
          నూతన యెరూషలేము పరిచర్యలు అనే ఈ వెబ్సైట్ తెలుగు క్రైస్తవ సంఘానికి ఆధ్యాత్మిక, అనుసరణీయ, సత్యవేద వాక్యాలను తెలుగులో అందిస్తుంది. ఇందులో ఎన్నో ప్రత్యేకమైన క్రైస్తవ పుస్తకాలు, బైబిలును లోతుగా అధ్యయనం చేయడానికి సహాయపడే వ్యాఖ్యానాలు, ఇంకా మరెన్నో వనరులు, తెలుగులో అందుబాటులో ఉన్నాయి. ఇవి చదవడం/వినడం ద్వారా దుర్బోధలకు ఢీటైన సమాధానాలను తెలుసుకోవడమే కాకుండా, దుర్బోధకులకు మరియు విమర్శకులకు లేఖనానుసారమైన సమాధానాలను ఎలా ఇవ్వాలో కూడా మీరు నేర్చుకుంటారు. జీవితంలో ఎదురయ్యే అనేక చిక్కు ప్రశ్నలకు బైబిల్ ఆధారిత సమాధానాలతో నివృత్తిని కలిగించేలా ఈ వెబ్సైట్ మీకోసం నిర్మించబడింది.
        </p>

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

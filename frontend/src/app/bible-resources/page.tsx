'use client';
import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { bibleMapsData } from './maps/data';
import { bibleInfographicsData } from './infographics/data';
import { bibleGenealogiesData } from './genealogies/data';
import { missionaryData } from './missionary-story/data';

interface ResourceCategory {
  id: string;
  title: string;
  subTitle: string;
  url: string;
  gradientClass: string;
  slantClass: string;
  originalRot: string;
}

export default function BibleResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const getResourceUrl = (url: string) => {
    if (
      url.includes('infographics_john') || 
      url.includes('infographics_mathew') ||
      url.includes('genelogogy') ||
      url.includes('Jacob_Genology')
    ) {
      return url;
    }
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
      return '/wp-content/uploads/2026/03/logo-pdf.jpg';
    }
    return '/wp-content/uploads/2026/03/logo.pdf';
  };

  const categories: ResourceCategory[] = [
    {
      id: "infographics",
      title: "BIBLE",
      subTitle: "INFOGRAPHICS",
      url: "/bible-resources/infographics",
      gradientClass: "from-[#917524] to-[#5C4D11]",
      slantClass: "slant-left-far z-10",
      originalRot: "28deg",
    },
    {
      id: "maps",
      title: "BIBLE",
      subTitle: "MAPS",
      url: "/bible-resources/maps",
      gradientClass: "from-[#1A5C5E] to-[#00383B]",
      slantClass: "slant-left-near z-20",
      originalRot: "22deg",
    },
    {
      id: "missionary-story",
      title: "MISSIONARY",
      subTitle: "STORIES",
      url: "/bible-resources/missionary-story",
      gradientClass: "from-[#C23130] via-[#AB2423] to-[#731312]",
      slantClass: "slant-flat-center z-30",
      originalRot: "0deg",
    },
    {
      id: "downloads",
      title: "BIBLE",
      subTitle: "DOWNLOADS",
      url: "/bible-resources/downloads",
      gradientClass: "from-[#16384A] to-[#0A1A23]",
      slantClass: "slant-right-near z-20",
      originalRot: "-22deg",
    },
    {
      id: "genealogies",
      title: "BIBLE",
      subTitle: "GENEALOGIES",
      url: "/bible-resources/genealogies",
      gradientClass: "from-[#1A5C4A] to-[#0D382B]",
      slantClass: "slant-right-far z-10",
      originalRot: "-28deg",
    },
  ];

  // Mouse Move: Calculate coordinate delta and update CSS variables in real time
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized coordinates (-0.5 to 0.5)
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;
    
    // Compute rotations (X: up/down max 25deg, Y: left/right max 25deg)
    const rx = -yc * 25; 
    const ry = xc * 25;
    
    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
    card.style.setProperty('--gx', `${x}px`);
    card.style.setProperty('--gy', `${y}px`);
  };

  // Mouse Leave: Reset coordinates smoothly to base Y-rotation and default glare position
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, originalRot: string, isActive: boolean) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', isActive ? '0deg' : originalRot);
    card.style.setProperty('--gx', '50%');
    card.style.setProperty('--gy', '50%');
  };

  const handleCardClick = (e: React.MouseEvent, catId: string) => {
    e.preventDefault();
    console.log("handleCardClick called for category:", catId);
    if (activeCategory === catId) {
      console.log("Deactivating category:", catId);
      setActiveCategory(null);
    } else {
      console.log("Activating category:", catId);
      setActiveCategory(catId);
      // Smooth scroll to the details container
      setTimeout(() => {
        console.log("Scrolling to ref:", detailsRef.current);
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  // Render Bible Maps Collection (Matching User Request and Screenshot format)
  const renderBibleMaps = () => {
    return (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#173C4E] mb-2 tracking-tight uppercase">
            Bible Maps Collection
          </h2>
          <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full mb-8"></div>
        </div>

        <div className="space-y-16">
          {bibleMapsData.map((section, si) => {
            // Find if there is any "Download All" link in this section's items
            let downloadAllLink: { text: string; url: string } | null = null;
            
            // Cleaned items list without the download all links
            const cleanedItems = section.items.map(item => {
              const itemDownloadAll = item.links.find(l => l.text.toLowerCase().includes('download all'));
              if (itemDownloadAll) {
                downloadAllLink = itemDownloadAll;
              }
              return {
                ...item,
                links: item.links.filter(l => !l.text.toLowerCase().includes('download all'))
              };
            });

            return (
              <div key={si} className="space-y-6">
                <h3 className="text-xl md:text-2xl font-black text-[#173C4E] text-center uppercase tracking-wide border-b border-gray-300 pb-3">
                  {section.title}
                </h3>
                
                <div className="space-y-3.5">
                  {cleanedItems.map((item, ii) => (
                    <div 
                      key={ii} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                    >
                      {/* Left Column: Title */}
                      <div className="font-bold text-[#8b1e15] text-base md:text-[17px] tracking-tight">
                        {item.title}
                      </div>

                      {/* Right Column: Divider & Buttons */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                        {/* Vertical Divider */}
                        <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                        
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                          {item.links.map((link, li) => {
                            const linkText = link.text.replace(/\u200b/g, '').trim();
                            
                            // Select color based on button type
                            let btnBg = 'bg-gray-500 hover:bg-gray-600';
                            if (linkText.toUpperCase() === 'ILLUSTRATOR') {
                              btnBg = 'bg-[#8b1e15] hover:bg-red-800';
                            } else if (linkText.toUpperCase() === 'JPEG' || linkText.toUpperCase() === 'COLOR') {
                              btnBg = 'bg-[#1F6F5A] hover:bg-[#185948]';
                            } else if (linkText.toUpperCase() === 'PDF') {
                              btnBg = 'bg-[#173C4E] hover:bg-[#12303e]';
                            } else if (linkText.toUpperCase() === 'POWERPOINT') {
                              btnBg = 'bg-[#d24726] hover:bg-[#b03a1e]';
                            } else if (linkText.toUpperCase() === 'KEYNOTE') {
                              btnBg = 'bg-[#106ebe] hover:bg-[#0d5a9c]';
                            } else if (linkText.toLowerCase().includes('black')) {
                              btnBg = 'bg-[#333333] hover:bg-[#222222]';
                            }

                            return (
                              <a
                                key={li}
                                href={getResourceUrl(link.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-center transition-all duration-200 select-none text-[11px] font-bold py-2 px-4 rounded uppercase text-white shadow-sm hover:scale-105 active:scale-95 ${btnBg}`}
                              >
                                {linkText}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {downloadAllLink && (
                  <div className="flex justify-center pt-4">
                    <a
                      href={getResourceUrl((downloadAllLink as any).url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#8b1e15] hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      {(downloadAllLink as any).text.replace(/\u200b/g, '').trim()}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Bible Infographics Collection (Matching Bible Maps format)
  const renderBibleInfographics = () => {
    return (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#173C4E] mb-2 tracking-tight uppercase">
            Bible Infographics Collection
          </h2>
          <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full mb-8"></div>
        </div>

        <div className="space-y-16">
          {bibleInfographicsData.map((section, si) => (
            <div key={si} className="space-y-6">
              <h3 className="text-xl md:text-2xl font-black text-[#173C4E] text-center uppercase tracking-wide border-b border-gray-300 pb-3">
                {section.title}
              </h3>
              
              <div className="space-y-3.5">
                {section.items.map((item, ii) => (
                  <div 
                    key={ii} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Left Column: Title */}
                    <div className="font-bold text-[#8b1e15] text-base md:text-[17px] tracking-tight">
                      {item.title}
                    </div>

                    {/* Right Column: Divider & Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                      {/* Vertical Divider */}
                      <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                      
                      <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                        {item.links.map((link, li) => {
                          const linkText = link.text.replace(/\u200b/g, '').trim();
                          
                          // Select color based on button type
                          let btnBg = 'bg-gray-500 hover:bg-gray-600';
                          if (linkText.toUpperCase() === 'JPEG') {
                            btnBg = 'bg-[#1F6F5A] hover:bg-[#185948]';
                          } else if (linkText.toUpperCase() === 'PDF') {
                            btnBg = 'bg-[#173C4E] hover:bg-[#12303e]';
                          }

                          return (
                            <a
                              key={li}
                              href={getResourceUrl(link.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-center transition-all duration-200 select-none text-[11px] font-bold py-2 px-4 rounded uppercase text-white shadow-sm hover:scale-105 active:scale-95 ${btnBg}`}
                            >
                              {linkText}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Infographics Images */}
        <div className="pt-12 border-t border-gray-300/60 space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-[#173C4E] uppercase tracking-wide">
              Featured Infographics
            </h3>
            <div className="h-1 w-12 bg-[#AB2423] mx-auto rounded-full mt-2 mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* John Infographic Card */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 group flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                <img 
                  src="/wp-content/uploads/2026/03/infographics_john.jpg" 
                  alt="Infographics John"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="font-bold text-[#8b1e15] text-base md:text-[17px] tracking-tight block">Gospel of John Infographic</span>
                <a 
                  href="/wp-content/uploads/2026/03/infographics_john.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-block bg-[#1F6F5A] hover:bg-[#185948] text-white text-[11px] font-bold py-2 px-6 rounded uppercase shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  View Full Image
                </a>
              </div>
            </div>

            {/* Matthew Infographic Card */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 group flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                <img 
                  src="/wp-content/uploads/2026/03/infographics_mathew.jpg" 
                  alt="Infographics Mathew"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="font-bold text-[#8b1e15] text-base md:text-[17px] tracking-tight block">Gospel of Matthew Infographic</span>
                <a 
                  href="/wp-content/uploads/2026/03/infographics_mathew.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-block bg-[#1F6F5A] hover:bg-[#185948] text-white text-[11px] font-bold py-2 px-6 rounded uppercase shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  View Full Image
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Bible Genealogies Collection (Matching Bible Maps format)
  const renderBibleGenealogies = () => {
    return (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#173C4E] mb-2 tracking-tight uppercase">
            Bible Genealogies Collection
          </h2>
          <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full mb-8"></div>
        </div>

        <div className="space-y-16">
          {bibleGenealogiesData.map((section, si) => (
            <div key={si} className="space-y-6">
              <h3 className="text-xl md:text-2xl font-black text-[#173C4E] text-center uppercase tracking-wide border-b border-gray-300 pb-3">
                {section.title}
              </h3>
              
              <div className="space-y-3.5">
                {section.items.map((item, ii) => (
                  <div 
                    key={ii} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Left Column: Title */}
                    <div className="font-bold text-[#8b1e15] text-base md:text-[17px] tracking-tight">
                      {item.title}
                    </div>

                    {/* Right Column: Divider & Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                      {/* Vertical Divider */}
                      <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                      
                      <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                        {item.links.map((link, li) => {
                          const linkText = link.text.replace(/\u200b/g, '').trim();
                          
                          // Select color based on button type
                          let btnBg = 'bg-gray-500 hover:bg-gray-600';
                          if (linkText.toUpperCase() === 'JPEG') {
                            btnBg = 'bg-[#1F6F5A] hover:bg-[#185948]';
                          } else if (linkText.toUpperCase() === 'PDF') {
                            btnBg = 'bg-[#173C4E] hover:bg-[#12303e]';
                          }

                          return (
                            <a
                              key={li}
                              href={getResourceUrl(link.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-center transition-all duration-200 select-none text-[11px] font-bold py-2 px-4 rounded uppercase text-white shadow-sm hover:scale-105 active:scale-95 ${btnBg}`}
                            >
                              {linkText}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Genealogies Images */}
        <div className="pt-12 border-t border-gray-300/60 space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-[#173C4E] uppercase tracking-wide">
              Featured Genealogies
            </h3>
            <div className="h-1 w-12 bg-[#AB2423] mx-auto rounded-full mt-2 mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* General Genealogy Card */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 group flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                <img 
                  src="/wp-content/uploads/2026/03/genelogogy.jpg" 
                  alt="Bible Genealogy"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="font-bold text-[#8b1e15] text-base md:text-[17px] tracking-tight block">Bible Genealogy</span>
                <a 
                  href="/wp-content/uploads/2026/03/genelogogy.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-block bg-[#1F6F5A] hover:bg-[#185948] text-white text-[11px] font-bold py-2 px-6 rounded uppercase shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  View Full Image
                </a>
              </div>
            </div>

            {/* Jacob Genealogy Card */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300 group flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                <img 
                  src="/wp-content/uploads/2026/03/Jacob_Genology.jpg" 
                  alt="Jacob Genealogy"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="font-bold text-[#8b1e15] text-base md:text-[17px] tracking-tight block">Jacob's Genealogy</span>
                <a 
                  href="/wp-content/uploads/2026/03/Jacob_Genology.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-block bg-[#1F6F5A] hover:bg-[#185948] text-white text-[11px] font-bold py-2 px-6 rounded uppercase shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  View Full Image
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Missionary Stories (Matching standalone page logic)
  const renderMissionaryStories = () => {
    return (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#173C4E] mb-2 tracking-tight uppercase">
            Missionary Stories
          </h2>
          <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full mb-8"></div>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Read inspiring stories of missionaries and their faithful journey in spreading the Gospel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {missionaryData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col group">
              <div className="relative h-60 bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={item.image} 
                  alt="Missionary Story" 
                  className="max-h-full max-w-full object-contain drop-shadow-md rounded transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {item.link ? (
                <div className="p-5 text-center border-t border-gray-50 mt-auto">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-[#1f4251] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#16303b] transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    Download Document
                  </a>
                </div>
              ) : (
                <div className="p-5 text-center border-t border-gray-50 mt-auto">
                  <span 
                    className="inline-block bg-gray-100 text-gray-400 border border-gray-200 px-6 py-2.5 rounded-full text-xs font-bold select-none cursor-not-allowed"
                  >
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Premium placeholder for other pages
  const renderPlaceholder = (title: string, description: string) => {
    return (
      <div className="py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-md border border-gray-150 text-[#173C4E] animate-pulse">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-[#173C4E] uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="inline-block bg-[#173C4E] text-white text-xs font-bold px-6 py-2.5 rounded-full opacity-60">
          Coming Soon
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-[#F7FAFC] py-16 px-6 overflow-x-hidden flex flex-col items-center transition-all duration-300 ${activeCategory ? 'justify-start' : 'justify-center'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
      {/* Title Header */}
      <div className="text-center mb-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#173C4E] mb-4 tracking-tight">
          Bible Resources
        </h1>
        <div className="h-1.5 w-24 bg-[#AB2423] mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
          Deepen your study of the Scriptures with our collection of interactive infographics, historical maps, missionary stories, downloads, and biblical genealogies.
        </p>
      </div>

      {/* 3D Perspective Grid Container */}
      <div className="w-full max-w-6xl flex justify-center items-center py-12 md:py-20 overflow-visible">
        {/* Scaling wrapper to keep layout pixel-perfect on mobile */}
        <div className="flex justify-center items-center w-full scale-55 xs:scale-65 sm:scale-75 md:scale-95 lg:scale-100 origin-center transition-transform duration-300">
          <div className={`perspective-1200 reflect-below flex justify-center items-center py-6 overflow-visible select-none ${activeCategory ? 'has-active' : ''}`}>
            {categories.map((cat, idx) => {
              const isActive = activeCategory === cat.id;
              return (
                <div
                  key={idx}
                  onClick={(e) => handleCardClick(e, cat.id)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={(e) => handleMouseLeave(e, cat.originalRot, isActive)}
                  style={{ '--original-rot': isActive ? '0deg' : cat.originalRot } as React.CSSProperties}
                  className={`slant-card ${cat.slantClass} ${isActive ? 'active-card' : ''} group relative block rounded-2xl md:rounded-3xl border border-white/20 shadow-xl overflow-hidden cursor-pointer
                    w-[140px] h-[240px] 
                    xs:w-[160px] xs:h-[280px]
                    sm:w-[190px] sm:h-[320px] 
                    md:w-[225px] md:h-[390px] 
                    mx-[-6px] xs:mx-[-10px] sm:mx-[-14px] md:mx-[-18px]
                    bg-gradient-to-br ${cat.gradientClass}
                  `}
                >
                  {/* Real-time spotlight glare shine */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                    style={{
                      background: 'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.22) 0%, transparent 60%)'
                    }}
                  />

                  {/* Glossy linear overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Inner border glow */}
                  <div className="absolute inset-px rounded-[22px] md:rounded-[29px] border border-white/10 pointer-events-none"></div>

                  {/* Inner Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center px-4 py-4 md:px-8 md:py-6 text-center select-none">
                    {/* Subtle decorative icon container */}
                    <div className="mb-3 opacity-20 group-hover:opacity-40 transition-opacity duration-300 transform group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>

                    {/* Text Header */}
                    <h3 className="text-white text-xs sm:text-sm md:text-[17px] font-black tracking-wider leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
                      {cat.title}
                    </h3>
                    <h3 className="text-white text-xs sm:text-sm md:text-[17px] font-black tracking-wider leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)] mt-0.5">
                      {cat.subTitle}
                    </h3>
                  </div>

                  {/* Bottom colored bar accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Detail Viewer Container */}
      {activeCategory && (
        <div 
          ref={detailsRef}
          className="w-full max-w-6xl mt-12 pb-20 animate-[fadeIn_0.35s_ease-out]"
        >
          <div className="bg-[#e8f4f8] rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200/50 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                console.log("Closing detail viewer");
                setActiveCategory(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-white text-gray-500 hover:text-gray-800 hover:shadow-md transition-all z-10 border border-gray-200/60"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {activeCategory === 'maps' && renderBibleMaps()}
            {activeCategory === 'missionary-story' && renderMissionaryStories()}
            {activeCategory === 'infographics' && renderBibleInfographics()}
            {activeCategory === 'downloads' && renderPlaceholder("Bible Downloads", "Download high-quality study materials, booklets, and worksheets for personal or ministry use.")}
            {activeCategory === 'genealogies' && renderBibleGenealogies()}
          </div>
        </div>
      )}
    </div>
  );
}


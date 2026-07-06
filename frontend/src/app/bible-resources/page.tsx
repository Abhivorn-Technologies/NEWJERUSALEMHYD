'use client';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
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

export const getButtonColor = (linkText: string) => {
  const text = linkText.toUpperCase();
  const baseClasses = "shadow-md hover:shadow-lg transition-all duration-300";
  
  if (text === 'ILLUSTRATOR') return `${baseClasses} bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/30`;
  
  if (text === 'COLOR') return `${baseClasses} bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-500/30`;
  
  if (text === 'JPEG') return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-500/30`;
  
  if (text === 'PDF') return `${baseClasses} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-600/30`;
  
  if (text === 'PPT' || text === 'POWERPOINT') return `${baseClasses} bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/30`;
  
  if (text === 'KEYNOTE') return `${baseClasses} bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/30`;
  
  if (text === 'DOWNLOAD' || text === 'DOWNLOAD DOCUMENT') return `${baseClasses} bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/30`;
  
  if (linkText.toLowerCase().includes('black')) return `${baseClasses} bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black shadow-gray-500/30`;
  
  return `${baseClasses} bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-slate-500/30`;
};

export default function BibleResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [resourceDownloads, setResourceDownloads] = useState<any[]>([]);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [dynamicMissionaryData, setDynamicMissionaryData] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    
    // Fetch resource downloads
    fetch(`${baseUrl}/resource-downloads/`)
      .then(res => res.json())
      .then(data => {
        setResourceDownloads(data);
      })
      .catch(err => console.error('Error fetching resource downloads:', err));

    // Fetch missionary stories dynamically
    fetch(`${baseUrl}/content-items/?page_category=Missionary+Stories`)
      .then(res => res.json())
      .then(data => {
        const activeItems = (Array.isArray(data) ? data : (data.results || [])).filter((item: any) => item.is_active);
        setDynamicMissionaryData(activeItems);
      })
      .catch(err => console.error('Error fetching missionary stories:', err));

    // Fetch resource cards dynamically
    fetch(`${baseUrl}/bible-resources/`)
      .then(res => res.json())
      .then(data => {
        const sorted = (Array.isArray(data) ? data : (data.results || [])).sort((a: any, b: any) => a.order - b.order);
        
        const visualStyles = [
          { gradientClass: "from-[#ECA300] to-[#D68F00]", slantClass: "slant-left-far z-10", originalRot: "28deg" },
          { gradientClass: "from-[#F8411C] to-[#E3300C]", slantClass: "slant-left-near z-20", originalRot: "22deg" },
          { gradientClass: "from-[#D80053] to-[#BC0044]", slantClass: "slant-flat-center z-30", originalRot: "0deg" },
          { gradientClass: "from-[#A400F5] to-[#8A00D1]", slantClass: "slant-right-near z-20", originalRot: "-22deg" },
          { gradientClass: "from-[#644CF4] to-[#4F39D6]", slantClass: "slant-right-far z-10", originalRot: "-28deg" },
        ];

        const mapped = sorted.map((item: any, index: number) => {
          const style = visualStyles[index % visualStyles.length];
          const parts = item.title.trim().split(' ');
          const title = parts[0] || '';
          const subTitle = parts.slice(1).join(' ') || '';
          const id = item.link ? item.link.split('/').filter(Boolean).pop() || item.id.toString() : item.id.toString();

          return {
            id,
            title,
            subTitle,
            url: item.link || '#',
            ...style
          };
        });
        setCategories(mapped);
      })
      .catch(err => console.error('Error fetching bible resources:', err));
  }, []);

  const getResourceUrl = (url: string) => {
    if (!url) return '';
    // Append backend URL for media uploads
    if (url.startsWith('/media/')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://127.0.0.1:8000';
      return `${backendUrl}${url}`;
    }
    // Return original url for frontend assets (/images, /wp-content, etc)
    return url;
  };

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
                
                <div className="space-y-1.5">
                  {cleanedItems.map((item, ii) => (
                    <div 
                      key={ii} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                    >
                      {/* Left Column: Title */}
                      <div className="font-medium text-[#173C4E] text-[17px] md:text-[19px] tracking-tight">
                        {item.title}
                      </div>

                      {/* Right Column: Divider & Buttons */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                        {/* Vertical Divider */}
                        <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                        
                        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                          {item.links.map((link, li) => {
                            const linkText = link.text.replace(/\u200b/g, '').trim();
                            
                            const btnBg = getButtonColor(linkText);

                            return (
                              <a
                                key={li}
                                href={getResourceUrl(link.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-center transition-all duration-200 select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white shadow-sm hover:scale-105 active:scale-95 ${btnBg}`}
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
                      href={getResourceUrl((downloadAllLink as { url: string }).url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#8b1e15] hover:bg-red-800 text-white font-medium text-[13px] tracking-wide uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all duration-200 text-center w-[90%] sm:w-[400px] md:w-[500px]"
                    >
                      {(downloadAllLink as { text: string }).text.replace(/\u200b/g, '').trim()}
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
              
              <div className="space-y-1.5">
                {section.items.map((item, ii) => (
                  <div 
                    key={ii} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Left Column: Title */}
                    <div className="font-medium text-[#173C4E] text-[17px] md:text-[19px] tracking-tight">
                      {item.title}
                    </div>

                    {/* Right Column: Divider & Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                      {/* Vertical Divider */}
                      <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                      
                      <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                        {item.links.map((link, li) => {
                          const linkText = link.text.replace(/\u200b/g, '').trim();
                          
                          const btnBg = getButtonColor(linkText);

                          return (
                            <a
                              key={li}
                              href={getResourceUrl(link.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-center transition-all duration-200 select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white shadow-sm hover:scale-105 active:scale-95 ${btnBg}`}
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

        {/* Featured Infographics Row List */}
        <div className="pt-12 border-t border-gray-300/60 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-black text-[#173C4E] uppercase tracking-wide">
              Featured Infographics
            </h3>
            <div className="h-1 w-12 bg-[#AB2423] mx-auto rounded-full mt-2 mb-6"></div>
          </div>

          <div className="space-y-1.5 max-w-5xl mx-auto">
            {/* John Row */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md">
              <div className="font-medium text-[#173C4E] text-[17px] md:text-[19px] tracking-tight">
                Gospel of John Infographic
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  <a
                    href="/wp-content/uploads/2026/03/infographics_john.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white hover:scale-105 active:scale-95 ${getButtonColor('JPEG')}`}
                  >
                    JPEG
                  </a>
                  <a
                    href="/wp-content/uploads/2026/03/infographics_john.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white hover:scale-105 active:scale-95 ${getButtonColor('PDF')}`}
                  >
                    PDF
                  </a>
                </div>
              </div>
            </div>

            {/* Matthew Row */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md">
              <div className="font-medium text-[#173C4E] text-[17px] md:text-[19px] tracking-tight">
                Gospel of Matthew Infographic
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  <a
                    href="/wp-content/uploads/2026/03/infographics_mathew.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white hover:scale-105 active:scale-95 ${getButtonColor('JPEG')}`}
                  >
                    JPEG
                  </a>
                  <a
                    href="/wp-content/uploads/2026/03/infographics_mathew.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white hover:scale-105 active:scale-95 ${getButtonColor('PDF')}`}
                  >
                    PDF
                  </a>
                </div>
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
              
              <div className="space-y-1.5">
                {section.items.map((item, ii) => (
                  <div 
                    key={ii} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Left Column: Title */}
                    <div className="font-medium text-[#173C4E] text-[17px] md:text-[19px] tracking-tight">
                      {item.title}
                    </div>

                    {/* Right Column: Divider & Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                      {/* Vertical Divider */}
                      <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                      
                      <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                        {item.links.map((link, li) => {
                          const linkText = link.text.replace(/\u200b/g, '').trim();
                          
                          const btnBg = getButtonColor(linkText);

                          return (
                            <a
                              key={li}
                              href={getResourceUrl(link.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-center transition-all duration-200 select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white shadow-sm hover:scale-105 active:scale-95 ${btnBg}`}
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


      </div>
    );
  };

  // Render Bible Downloads
  const renderBibleDownloads = () => {
    // Group resource downloads by category
    const softwareItems = resourceDownloads
      .filter(item => item.category === 'Software')
      .map(item => ({
        title: item.title,
        links: [{ text: "Download", url: item.file }]
      }));

    const pptItems = resourceDownloads
      .filter(item => item.category === 'PPT')
      .map(item => ({
        title: item.title,
        links: [{ text: "PPT", url: item.file }]
      }));

    const pdfItems = resourceDownloads
      .filter(item => item.category === 'PDF')
      .map(item => ({
        title: item.title,
        links: [{ text: "PDF", url: item.file }]
      }));

    // Fallback placeholders if DB is empty
    const dummySoftwareItems = [
      { title: "1", links: [{ text: "Download", url: "#" }] },
      { title: "2", links: [{ text: "Download", url: "#" }] },
      { title: "3", links: [{ text: "Download", url: "#" }] },
      { title: "4", links: [{ text: "Download", url: "#" }] }
    ];

    const dummyPptItems = [
      { title: "1", links: [{ text: "PPT", url: "#" }] },
      { title: "2", links: [{ text: "PPT", url: "#" }] },
      { title: "3", links: [{ text: "PPT", url: "#" }] },
      { title: "4", links: [{ text: "PPT", url: "#" }] }
    ];

    const dummyPdfItems = [
      { title: "1", links: [{ text: "PDF", url: "#" }] },
      { title: "2", links: [{ text: "PDF", url: "#" }] },
      { title: "3", links: [{ text: "PDF", url: "#" }] },
      { title: "4", links: [{ text: "PDF", url: "#" }] }
    ];

    const downloadsData = [
      {
        title: "Softwares",
        items: softwareItems.length > 0 ? softwareItems : dummySoftwareItems
      },
      {
        title: "PPTs",
        items: pptItems.length > 0 ? pptItems : dummyPptItems
      },
      {
        title: "PDFs",
        items: pdfItems.length > 0 ? pdfItems : dummyPdfItems
      }
    ];

    return (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#173C4E] mb-2 tracking-tight uppercase">
            Bible Downloads Collection
          </h2>
          <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full mb-8"></div>
        </div>

        <div className="space-y-16">
          {downloadsData.map((section, si) => (
            <div key={si} className="space-y-6">
              <h3 className="text-xl md:text-2xl font-black text-[#173C4E] text-center uppercase tracking-wide border-b border-gray-300 pb-3">
                {section.title}
              </h3>
              
              <div className="space-y-1.5">
                {section.items.map((item, ii) => (
                  <div 
                    key={ii} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Left Column: Title */}
                    <div className="font-medium text-[#173C4E] text-[17px] md:text-[19px] tracking-tight">
                      {item.title}
                    </div>

                    {/* Right Column: Divider & Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap md:flex-nowrap">
                      <div className="hidden md:block h-6 w-[1.5px] bg-gray-200 mx-2"></div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                        {item.links.map((link, li) => {
                          const linkText = link.text.replace(/\u200b/g, '').trim();
                          
                          const btnBg = getButtonColor(linkText);

                          return (
                            <a
                              key={li}
                              href={getResourceUrl(link.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-center transition-all duration-200 select-none text-[12.5px] font-medium tracking-wide py-2 px-4 rounded uppercase text-white shadow-sm hover:scale-105 active:scale-95 ${btnBg}`}
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
          {dynamicMissionaryData.length > 0 ? dynamicMissionaryData.map((item, idx) => {
            const firstLink = Array.isArray(item.links) && item.links.length > 0 ? item.links[0] : null;
            const pdfLink = firstLink ? (typeof firstLink === 'string' ? firstLink : firstLink.url) : null;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                <div className="relative pt-4 pb-0 px-4 flex items-center justify-center overflow-hidden bg-transparent">
                  <img 
                    src={item.cover_image ? getResourceUrl(item.cover_image) : (item.image_url ? getResourceUrl(item.image_url) : item.image)} 
                    alt={item.title || "Missionary Story"} 
                    className="w-full h-auto object-contain drop-shadow-md rounded-xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {pdfLink ? (
                  <div className="pt-3 pb-4 px-4 text-center mt-auto">
                    <a 
                      href={getResourceUrl(pdfLink)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-[#1f4251] text-white px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wide hover:bg-[#16303b] transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                      Download Document
                    </a>
                  </div>
                ) : (
                  <div className="pt-3 pb-4 px-4 text-center mt-auto">
                    <span 
                      className="inline-block bg-[#1f4251] text-white px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wide select-none cursor-not-allowed shadow-sm"
                    >
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            );
          }) : (
            <p className="col-span-full text-center text-gray-500">No stories available.</p>
          )}
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
        <div className="inline-block bg-[#173C4E] text-white text-[13px] font-medium tracking-wide px-6 py-2.5 rounded-full opacity-60">
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
      <div className="w-full max-w-[90%] md:max-w-7xl lg:px-[85px] flex justify-center items-center py-4 md:py-6 overflow-visible">
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
                    w-[140px] h-[160px] 
                    xs:w-[160px] xs:h-[190px]
                    sm:w-[190px] sm:h-[220px] 
                    md:w-[225px] md:h-[260px] 
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
          className="w-full max-w-[90%] md:max-w-7xl lg:px-[85px] mt-12 pb-20 animate-[fadeIn_0.35s_ease-out]"
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
            {activeCategory === 'downloads' && renderBibleDownloads()}
            {activeCategory === 'genealogies' && renderBibleGenealogies()}
          </div>
        </div>
      )}
    </div>
  );
}


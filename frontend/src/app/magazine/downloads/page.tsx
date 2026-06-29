"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

export default function MagazineDownloadsPage() {
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/magazines/");
        if (res.ok) {
          const data = await res.json();
          setMagazines(data);
        }
      } catch (err) {
        console.error("Error fetching magazines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f6f9] pb-20 font-sans">
      <Head>
        <title>Download Magazines | New Jerusalem Ministries</title>
      </Head>
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center">
        <Link 
          href="/magazine"
          className="inline-flex items-center gap-2 text-[#5795A7] hover:text-[#1f4251] font-semibold mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Subscription
        </Link>
        <br />
        <span className="inline-block py-1 px-3 rounded-full bg-[#5795A7]/10 text-[#5795A7] text-sm font-semibold tracking-wider uppercase mb-2">
          Downloads
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f4251] uppercase tracking-wide">
          Digital Magazines
        </h1>
        <div className="h-1 w-24 bg-[#5795A7] mx-auto rounded-full mt-4 mb-4"></div>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          Download digital copies of our past and present "Chinnaarula Jaalaree" kids magazines to read on the go.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-20 text-[#5795A7] font-bold animate-pulse">Loading Magazines...</div>
        ) : magazines.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">No magazines found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {magazines.map((mag) => (
              <div 
                key={mag.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#5795A7]/10 border border-white/60 group hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={mag.cover_image} 
                    alt={mag.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-top"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1f4251] shadow-sm">
                    {mag.language}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-sm text-[#5795A7] font-bold mb-1">{mag.month_year}</div>
                  <h3 className="text-xl font-extrabold text-[#1f4251] mb-4 line-clamp-2 flex-1">
                    {mag.title}
                  </h3>
                  
                  <a 
                    href={mag.file}
                    target="_blank"
                    rel="noreferrer"
                  className="flex items-center justify-center w-full px-6 py-3 bg-[#e8f1f3] text-[#5795A7] group-hover:bg-[#5795A7] group-hover:text-white font-bold rounded-xl transition-colors duration-300 gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

const ScrollDivider = () => (
  <div className="flex justify-center py-6 select-none pointer-events-none">
    <svg width="220" height="24" viewBox="0 0 220 24" fill="none" className="text-[#FFEBB3] opacity-60">
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
);

const PinIcon = ({ className = "text-[#AB2423]" }: { className?: string }) => (
  <svg className={`w-5 h-5 md:w-6 md:h-6 mt-1 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = ({ className = "text-[#009FB2]" }: { className?: string }) => (
  <svg className={`w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = ({ className = "text-[#009FB2]" }: { className?: string }) => (
  <svg className={`w-5 h-5 md:w-6 md:h-6 mt-0.5 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname() || '';
  const isSongsPage = pathname === '/songs';
  const isSundaySchool = pathname.startsWith('/sunday-school')
    || pathname.startsWith('/stories')
    || pathname.startsWith('/activities');
  const isSpecialTheme = isSongsPage || isSundaySchool;

  let footerBgClass = 'bg-[#003138]';
  if (isSongsPage) {
    footerBgClass = 'bg-[#5795A7]';
  } else if (isSundaySchool) {
    footerBgClass = 'bg-[#D04A73]';
  }

  return (
    <footer className={`${footerBgClass} pb-6 text-white w-full select-none`}>
      <div className="max-w-7xl mx-auto px-6 space-y-4">

        {/* Contact Details Title */}
        <div 
          className="text-center text-[#FFEBB3] text-[13px] sm:text-base md:text-lg lg:text-[21px] font-normal leading-relaxed pt-4 md:pt-6"
          style={{ fontFamily: 'var(--font-ramabhadra)' }}
        >
          <p>మీ ప్రార్థన అవసరతకై సంప్రదించవలసిన మా చిరునామా :</p>
        </div>

        {/* Contact Address & Logo Grid */}
        <div className="pt-0 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center w-full pt-1 pb-4 md:pt-2 md:pb-8">
            
            {/* Left Column - Logo */}
            <div className="w-full md:flex-1 flex justify-center md:justify-end md:pr-14">
              <div className="p-0 w-[260px] sm:w-[320px] md:w-[380px] lg:w-[440px] flex items-center justify-center overflow-hidden">
                <img
                  src="/images/footer_logo.png"
                  alt="New Jerusalem Ministries"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            
            {/* Vertical line divider */}
            <div className="hidden md:block w-[1.5px] bg-white/20 self-stretch my-2"></div>
            
            {/* Right Column - Info */}
            <div className="w-full md:flex-1 flex flex-col justify-start md:pl-14 gap-6 text-gray-200 mt-8 md:mt-0" style={{ fontFamily: 'var(--font-poppins)' }}>
              {/* Location */}
              <div className="flex items-start gap-4">
                <PinIcon className={isSpecialTheme ? 'text-[#FFEBB3]' : 'text-[#AB2423]'} />
                <p className="text-sm sm:text-base font-[400] leading-relaxed">
                  # 14-22, Grace Nilayam, Kamala Nagar,<br />
                  Near Anitha Residency, MEDIPALLY,<br />
                  HYDERABAD, TELANGANA 500039.
                </p>
              </div>
              {/* Phone */}
              <div className="flex items-center gap-4">
                <PhoneIcon className={isSpecialTheme ? 'text-[#FFEBB3]' : 'text-[#009FB2]'} />
                <p className="text-sm sm:text-base font-[500]">
                  +91 958 1234563 , +91-40-35585579
                </p>
              </div>
              {/* Email */}
              <div className="flex items-center gap-4">
                <MailIcon className={isSpecialTheme ? 'text-[#FFEBB3]' : 'text-[#009FB2]'} />
                <p className={`text-sm sm:text-base font-[400] transition-colors ${isSpecialTheme ? 'hover:text-[#FFEBB3]' : 'hover:text-[#009FB2]'}`}>
                  info@newjerusalemminiseries.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Disclaimer Block */}
        <div 
          className="text-center space-y-4 text-gray-300 text-[11px] sm:text-xs md:text-sm leading-relaxed max-w-7xl mx-auto pt-2"
        >
          <p 
            className="font-normal text-white tracking-wide text-[13px] sm:text-base md:text-lg lg:text-[20px]"
            style={{ fontFamily: 'var(--font-ramabhadra)' }}
          >
            ఈ వెబ్ సైట్ యొక్క సర్వ హక్కులు నూతన యెరూషలేము పరిచర్యలు నకు చెందినవి.
          </p>
          <p 
            className="text-gray-300/85 leading-loose text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]"
            style={{ fontFamily: 'var(--font-mandali)' }}
          >
            ముఖ్య గమనిక : నూతన యెరూషలేము పరిచర్యలు ఎప్పుడూ, ఎవరినీ ఆర్థిక సహాయం కోరదు; ఒకవేళ నూతన యెరూషలేము పరిచర్యలు పేరుతో ఎవరైనా ఆర్థిక సహాయం అడిగితే, వారి వివరాలు మాకు తప్పక తెలియజేయండి. ఈ హెచ్చరికను ఖాతరు చేయకుండా ఎవరైనా నూతన యెరూషలేము పరిచర్యలకు అనుకుని ఆర్థిక సహాయం అందిస్తే అందుకు నూతన యెరూషలేము పరిచర్యలు ఎలాంటి బాధ్యత వహించదు.
          </p>
        </div>

        {/* English Copyright & Developer Info */}
        <div 
          className={`flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm pt-4 border-t border-white/10 max-w-7xl mx-auto mt-6 gap-4 ${isSpecialTheme ? 'text-white/70' : 'text-gray-400'}`}
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <p className="text-center md:text-left">
            &copy; 2026 New Jerusalem Ministries. All rights reserved.
          </p>
          <p className="text-center md:text-right">
            Developed by{' '}
            <a 
              href="https://www.abhivorn.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`transition-colors hover:underline ${isSpecialTheme ? 'text-[#FFEBB3] hover:text-white' : 'text-[#009FB2] hover:text-[#00c3d9]'}`}
            >
              Abhivorn Technologies Pvt Ltd
            </a>
            {' '}and{' '}
            <a 
              href="https://www.digilevelup.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`transition-colors hover:underline ${isSpecialTheme ? 'text-[#FFEBB3] hover:text-white' : 'text-[#009FB2] hover:text-[#00c3d9]'}`}
            >
              Digi Levelup
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

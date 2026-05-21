'use client';
import { useEffect, useState } from 'react';

interface SiteSettings {
  site_name: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  footer_tagline: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/site-settings/`)
      .then(r => r.json())
      .then(data => setSettings(data[0] ?? null))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#003138] text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20 py-16 md:py-24">
        {/* Left Column - Logo */}
        <div className="w-full md:w-[44%]">
          <img
            src="/wp-content/uploads/2025/11/CL-Circle-logo-12-e1775125631656.png"
            alt="New Jerusalem Ministries"
            className="w-full max-w-md mx-auto rounded-[15px]"
          />
        </div>

        {/* Right Column - Info */}
        <div className="w-full md:w-auto flex flex-col gap-8 pl-0 md:pl-[2%] border-l-0 md:border-l-3 md:border-l-white">
          <div>
            <h3 className="text-lg font-[500] mb-2">{settings?.site_name ?? 'New Jerusalem Ministries'}</h3>
            <p className="text-base font-[300] text-gray-300 leading-relaxed">
              {settings?.footer_tagline ?? ''}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-[500] mb-2">Contact Us</h3>
            <ul className="text-gray-300 space-y-1">
              {settings?.phone1 && <li>{settings.phone1}</li>}
              {settings?.phone2 && <li>{settings.phone2}</li>}
              {settings?.email && <li>{settings.email}</li>}
            </ul>
          </div>
          {settings?.address && (
            <div>
              <p className="text-gray-400 text-sm leading-relaxed">{settings.address}</p>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-700 mt-0 py-6 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} {settings?.site_name ?? 'New Jerusalem Ministries'}. All rights reserved.
      </div>
    </footer>
  );
}

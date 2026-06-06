'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function SundaySchoolSongsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', songName: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const songCategories = [
    { title: 'Telugu Songs', icon: '🎵', link: '/songs?language=sunday_telugu', description: 'Sunday School songs in Telugu' },
    { title: 'English Songs', icon: '🎵', link: '/songs?language=sunday_english', description: 'Sunday School songs in English' },
    { title: 'Hindi Songs', icon: '🎵', link: '/songs?language=sunday_hindi', description: 'Sunday School songs in Hindi' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let valid = true;
    const newErrors = { name: '', email: '' };

    // Name validation: alphabets and spaces only
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.name.trim())) {
      newErrors.name = "Name can only contain alphabets and spaces.";
      valid = false;
    }

    // Email validation: standard email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. user@example.com).";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    setLoading(true);
    
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS credentials are not configured in environment variables.");
      setErrors(prev => ({
        ...prev,
        email: "Submission failed: email service is not configured."
      }));
      setLoading(false);
      return;
    }

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject || 'New Song Request',
          song_details: formData.songName
        }
      })
    })
    .then((res) => {
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', songName: '' });
        setErrors({ name: '', email: '' });
      } else {
        return res.text().then(text => {
          throw new Error(text || 'Failed to send email');
        });
      }
    })
    .catch((err) => {
      console.error(err);
      setErrors(prev => ({
        ...prev,
        email: "Failed to send request. Please try again later."
      }));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <Link 
            href="/sunday-school" 
            className="inline-flex items-center text-[#1f4251]/80 hover:text-[#8b1e15] font-semibold transition-colors duration-200"
          >
            <span className="mr-2">&larr;</span> Back to Sunday School
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Sunday School Songs</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Choose a language below to view and search our Sunday School songs, or submit a request to add a new song.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {songCategories.map((cat, idx) => (
            <Link key={idx} href={cat.link} className="group block">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center card-elevate h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1f4251] mb-2 group-hover:text-[#8b1e15] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}

          {/* Song Request Card */}
          <button 
            onClick={() => {
              setSuccess(false);
              setErrors({ name: '', email: '' });
              setIsOpen(true);
            }} 
            className="group block text-left w-full focus:outline-none"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center card-elevate h-full flex flex-col justify-between cursor-pointer">
              <div>
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  📝
                </div>
                <h3 className="text-xl font-bold text-[#1f4251] mb-2 group-hover:text-[#8b1e15] transition-colors">
                  Song Request
                </h3>
                <p className="text-gray-600 text-sm">Request a new song to be added</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#1f4251]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-fade-in relative">
            
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1f4251]">Song Request</h2>
                <div className="h-0.5 w-12 bg-[#8b1e15] mt-1.5 rounded-full"></div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {success ? (
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-[#e8f4f8] text-[#8b1e15] rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm animate-bounce">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-[#1f4251]">Request Submitted!</h3>
                  <p className="text-sm text-gray-600 max-w-xs mx-auto">
                    Thank you! Your request has been successfully submitted. We will review it shortly.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-[#8b1e15] hover:bg-[#a6251b] text-white font-bold rounded-xl transition-colors shadow-md shadow-[#8b1e15]/20 mt-4 text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 text-sm bg-gray-50/30 ${
                        errors.name 
                          ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-gray-200/80 focus:ring-[#8b1e15]/20 focus:border-[#8b1e15]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 font-semibold">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 text-gray-700 text-sm bg-gray-50/30 ${
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-gray-200/80 focus:ring-[#8b1e15]/20 focus:border-[#8b1e15]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 font-semibold">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Enter subject"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#8b1e15]/20 focus:border-[#8b1e15] text-gray-700 text-sm bg-gray-50/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1f4251] uppercase tracking-wider">
                      Song Name / Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.songName}
                      onChange={(e) => setFormData({ ...formData, songName: e.target.value })}
                      placeholder="Describe the song you want to request (title, artist, lyrics link, etc.)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#8b1e15]/20 focus:border-[#8b1e15] text-gray-700 text-sm bg-gray-50/30 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-[#8b1e15] hover:bg-[#a6251b] text-white font-bold rounded-xl transition-colors shadow-md shadow-[#8b1e15]/20 text-sm flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Send Request"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Local animation style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}} />
    </div>
  );
}

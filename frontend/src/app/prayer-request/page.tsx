"use client";
import { useState } from "react";

export default function PrayerRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", phone: "", email: "", address: "", message: "" });
    }, 1500);
  };
  return (
    <div
      className="min-h-screen bg-[#f0f6f9]"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* ── Main Content ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        {/* Page Header */}
        <div className="text-center mb-10 reveal">
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4 tracking-tight">
            Prayer Request
          </h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full" />
          <p className="mt-5 text-gray-600 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            We believe in the power of prayer. Share your heart with us and our
            dedicated prayer team will intercede faithfully on your behalf.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ── Left Column ──────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Beautiful Trending Contact Details Card */}
            <div className="rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden group bg-white h-full">
              {/* Modern Ambient Glows */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-[#f0f6f9] rounded-full blur-[60px] opacity-60 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-gray-50 rounded-full blur-[60px] opacity-60 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-[22px] font-bold text-[#1f4251] mb-2 tracking-tight">
                  New Jerusalem Ministries
                </h3>
                <div className="h-1 w-12 bg-[#8b1e15] rounded-full mb-10"></div>

                <div className="space-y-8 flex-grow">
                  {/* Address */}
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0f6f9] border border-gray-100 text-[#1f4251] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Our Location
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        # 14-22, Grace Nilayam, Kamala Nagar,
                        <br /> Near Anitha Residency, Medipally,
                        <br /> Hyderabad, Telangana 500039.
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0f6f9] border border-gray-100 text-[#1f4251] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.54-4.24-7.136-7.136l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Call Us
                      </p>
                      <div className="flex flex-col sm:flex-row sm:gap-4 text-sm">
                        <p className="font-semibold text-[#1f4251] tracking-wide">
                          +91 95812 34563
                        </p>
                        <span className="hidden sm:inline text-gray-300">
                          |
                        </span>
                        <p className="font-semibold text-[#1f4251] tracking-wide">
                          +91 40 3558 5579
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-5 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0f6f9] border border-gray-100 text-[#1f4251] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Email Us
                      </p>
                      <p className="font-semibold text-[#1f4251] tracking-wide break-all text-sm">
                        INFO@NEWJERUSALEMMINISTRIES.COM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links (based on user reference) */}
                <div className="pt-8 mt-6 border-t border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Connect With Us
                  </p>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-4 w-full px-5 py-3.5 bg-[#f0f6f9] hover:bg-[#e2eef2] text-[#1f4251] rounded-full transition-colors font-medium text-[15px]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                      Facebook
                    </a>
                    
                    <a href="#" className="flex items-center gap-4 w-full px-5 py-3.5 bg-[#f0f6f9] hover:bg-[#e2eef2] text-[#1f4251] rounded-full transition-colors font-medium text-[15px]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      Instagram
                    </a>

                    <a href="#" className="flex items-center gap-4 w-full px-5 py-3.5 bg-[#f0f6f9] hover:bg-[#e2eef2] text-[#1f4251] rounded-full transition-colors font-medium text-[15px]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186a2.68 2.68 0 0 0-1.884-1.888C17.98 3.8 12 3.8 12 3.8s-5.98 0-7.698.498A2.68 2.68 0 0 0 2.418 6.186C1.92 7.91 1.92 12 1.92 12s0 4.09.498 5.814a2.68 2.68 0 0 0 1.884 1.888c1.718.498 7.698.498 7.698.498s5.98 0 7.698-.498a2.68 2.68 0 0 0 1.884-1.888C22.08 16.09 22.08 12 22.08 12s0-4.09-.498-5.814zM9.912 15.228V8.772L15.654 12l-5.742 3.228z"/></svg>
                      YouTube
                    </a>

                    <a href="#" className="flex items-center gap-4 w-full px-5 py-3.5 bg-[#f0f6f9] hover:bg-[#e2eef2] text-[#1f4251] rounded-full transition-colors font-medium text-[15px]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      WhatsApp
                    </a>

                    <a href="#" className="flex items-center gap-4 w-full px-5 py-3.5 bg-[#f0f6f9] hover:bg-[#e2eef2] text-[#1f4251] rounded-full transition-colors font-medium text-[15px]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Twitter / X
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column — Google Form ─────────────────── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 h-full flex flex-col">
              {/* Form header */}
              <h2 className="text-[22px] font-bold text-[#1f4251] mb-8 tracking-tight">
                Send Prayer Request
              </h2>

              {/* Form Container */}
              <div className="bg-white">
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✨</span>
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Prayer Request Received
                    </h3>
                    <p className="text-green-700 text-sm">
                      Thank you for sharing your heart with us. Our prayer team
                      will begin interceding for you.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#1f4251] mb-1.5">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8b1e15] focus:ring-2 focus:ring-[#8b1e15]/20 outline-none transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1f4251] mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8b1e15] focus:ring-2 focus:ring-[#8b1e15]/20 outline-none transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-[#1f4251] mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8b1e15] focus:ring-2 focus:ring-[#8b1e15]/20 outline-none transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#1f4251] mb-1.5">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8b1e15] focus:ring-2 focus:ring-[#8b1e15]/20 outline-none transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1f4251] mb-1.5">
                        Prayer Request / Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#8b1e15] focus:ring-2 focus:ring-[#8b1e15]/20 outline-none transition-all bg-white resize-y"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-3 px-8 rounded-full bg-[#1f4251] hover:bg-[#173C4E] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
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
          </div>
        </div>
      </section>
    </div>
  );
}

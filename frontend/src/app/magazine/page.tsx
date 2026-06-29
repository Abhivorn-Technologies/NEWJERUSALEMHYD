"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function MagazineSubscribePage() {
  const [relationship, setRelationship] = useState("Parent");
  const [numChildren, setNumChildren] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted! To be connected to backend.");
    alert("Application submitted successfully! (Frontend Only)");
  };

  return (
    <div className="min-h-screen bg-[#f0f6f9] pb-20 font-sans">
      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-[#5795A7]/10 text-[#5795A7] text-sm font-semibold tracking-wider uppercase mb-2">
          Magazine
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f4251] uppercase tracking-wide">
          &quot;Chinnaarula Jaalaree&quot; Kids Magazine
        </h1>
        <div className="h-1 w-24 bg-[#5795A7] mx-auto rounded-full mt-4 mb-4"></div>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          Subscribe to our magazine and receive it regularly to support your
          child&apos;s spiritual development.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Top Section: Info & Do You Know (2 Columns) */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column: About Magazine */}
          <div className="w-full lg:w-1/2">
            {/* Intro Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#5795A7]/5 border border-white/60 relative overflow-hidden group h-full">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5795A7] to-[#8bbacc]" />
              <h2 className="text-2xl font-bold text-[#1f4251] mb-6 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-[#5795A7]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                About the Magazine
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-start">
                <div className="flex-1">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    &quot;Chinnaarula Jaalaree&quot; is a kid&apos;s magazine,
                    which comprises daily bible reading portions along with
                    memory verses. More than 3,000 copies are sent to kids all
                    over the world each month. It contains:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Bible Lessons",
                      "Missionary Stories",
                      "Bible reading Portions",
                      "Memory Verses",
                      "Prayer Points",
                      "Global News",
                      "Exciting Activities",
                      "Puzzles And much more...",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-700 font-medium"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shrink-0 w-48 xl:w-40 relative group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-[#5795A7]/20 blur-xl rounded-full transform -translate-y-4" />
                  <img
                    src="https://newjerusalemhyd.com/uploads/resources/resource_6a3d3735e1fbb9.34693331.png"
                    alt="Kids Magazine Cover"
                    className="relative z-10 w-full rounded-lg shadow-2xl border border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Do You Know */}
          <div className="w-full lg:w-1/2">
            {/* Do You Know Section */}
            <div className="bg-[#1f4251] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden h-full">
              {/* Decorative background shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5795A7] rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3B7586] rounded-full mix-blend-multiply filter blur-2xl opacity-50 -translate-x-10 translate-y-10" />

              <h2 className="relative text-2xl font-bold text-[#e8f1f3] mb-6 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-[#8bbacc]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Do You Know?
              </h2>

              <div className="relative space-y-6 text-[#cddfe6] text-sm md:text-base leading-relaxed">
                <ul className="space-y-4 list-none">
                  {[
                    '"చిన్నారుల జాలరీ" అనేది పిల్లల కోసం రూపొందించిన ఒక ప్రత్యేక ప్రచురణ. మేము ఈ పుస్తకాన్ని ప్రత్యేకంగా 3 నుండి 14 సంవత్సరాల వయస్సు గల పిల్లలకు మాత్రమే పంపుతాము.',
                    'ఈ దరఖాస్తు ఫారమ్‌ను పూర్తి చేసి సమర్పించిన వారికి మాత్రమే "చిన్నారుల జాలరీ" పంపబడుతుంది.',
                    '15 సంవత్సరాల కంటే ఎక్కువ వయస్సు ఉన్నవారు రూ. 100/- వార్షిక చందా రుసుము చెల్లించి "చిన్నారుల జాలరీ" పత్రికకు చందా కట్టాలని మేము ప్రోత్సహిస్తున్నాము.',
                    'ప్రస్తుతం, "చిన్నారుల జాలరీ" తెలుగు, కన్నడ మరియు తమిళంలో మాత్రమే పంపిణీ చేయబడుతోంది.',
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[#8bbacc] mt-1 text-lg leading-none">
                        •
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="h-px w-full bg-[#5795A7]/30 my-6" />
                <ul className="space-y-4 list-none">
                  {[
                    'The "Chinnaarula Jaalaree" magazine is published exclusively for children each month in an effort to support their spiritual development.',
                    "Children between the ages of 3 and 18 can read this magazine. Please complete the form and submit it to us.",
                    "This magazine will only be sent to subscribers.",
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-[#8bbacc] mt-1 text-lg leading-none">
                        •
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Subscribe Form */}
        <div className="w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl shadow-[#5795A7]/10 border border-white">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-[#1f4251]">
                Subscription Form
              </h2>
              <p className="text-gray-500 mt-2">
                Please fill in the details below to subscribe.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Parent / Guardian Details */}
              <div>
                <h3 className="text-lg font-bold text-[#5795A7] border-b border-gray-200 pb-2 mb-5 uppercase tracking-wide">
                  1. Parent / Guardian Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Relationship *
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      required
                    >
                      <option value="Parent">Parent</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Primary Parent / Guardian Name *
                    </label>
                    <div className="flex gap-3">
                      <select className="w-24 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none">
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Rev.">Rev.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  {relationship === "Parent" && (
                    <div className="col-span-1 md:col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-semibold text-gray-700">
                        Secondary Parent Name
                      </label>
                      <input
                        type="text"
                        placeholder="Spouse / Second Parent Name (Optional)"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      />
                    </div>
                  )}

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Email ID
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@example.com"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Contact Details */}
              <div>
                <h3 className="text-lg font-bold text-[#5795A7] border-b border-gray-200 pb-2 mb-5 uppercase tracking-wide">
                  2. Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Country *
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Country
                      </option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Optional"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Address Details */}
              <div>
                <h3 className="text-lg font-bold text-[#5795A7] border-b border-gray-200 pb-2 mb-5 uppercase tracking-wide">
                  3. Address Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-5">
                    <div className="md:w-1/3 space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Door / Bldg No. *
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                        required
                      />
                    </div>
                    <div className="md:w-2/3 space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">
                        Street Name *
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Area / Locality *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      City / Post *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Pincode / Zipcode *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      State *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      District *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 4. Children Details */}
              <div>
                <h3 className="text-lg font-bold text-[#5795A7] border-b border-gray-200 pb-2 mb-5 uppercase tracking-wide">
                  4. Children Details
                </h3>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Number of Children *
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      value={numChildren}
                      onChange={(e) => setNumChildren(parseInt(e.target.value))}
                      required
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {Array.from({ length: numChildren }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-5 rounded-2xl border border-gray-200/60 animate-in fade-in slide-in-from-top-2 duration-300"
                      >
                        <h4 className="font-bold text-[#1f4251] mb-4 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5795A7] text-white text-xs">
                            {index + 1}
                          </span>
                          Child {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                              Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Child's Name"
                              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                              Date of Birth *
                            </label>
                            <input
                              type="date"
                              className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Preferences */}
              <div>
                <h3 className="text-lg font-bold text-[#5795A7] border-b border-gray-200 pb-2 mb-5 uppercase tracking-wide">
                  5. Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Magazine Language *
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Language
                      </option>
                      <option value="Telugu">Telugu</option>
                      <option value="Kannada">Kannada</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Mode of Receiving Data *
                    </label>
                    <select
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#5795A7]/50 focus:border-[#5795A7] transition-all outline-none"
                      required
                    >
                      <option value="Post">Post (Physical Copy)</option>
                      <option value="Digital">
                        Digital (Email / WhatsApp)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-100 text-center">
                <button
                  type="submit"
                  className="w-full px-10 py-4 bg-gradient-to-r from-[#5795A7] to-[#1f4251] hover:from-[#498091] hover:to-[#15303c] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#5795A7]/30 transform hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-[#5795A7]/50 outline-none mb-4"
                >
                  Submit Subscription
                </button>
                <Link
                  href="/magazine/downloads"
                  className="flex items-center justify-center w-full px-10 py-4 bg-white border-2 border-[#5795A7] text-[#1f4251] hover:bg-[#e8f1f3] hover:text-[#3B7586] font-bold text-lg rounded-2xl shadow-sm transform hover:-translate-y-1 transition-all duration-300 focus:ring-4 focus:ring-[#5795A7]/20 outline-none"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Magazines
                </Link>
                <p className="text-xs text-gray-400 mt-6 text-center">
                  By submitting this form, you agree to receive the Chinnaarula
                  Jaalaree magazine and related communications.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

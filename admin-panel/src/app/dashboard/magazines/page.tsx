"use client";

import React, { useState, useEffect } from "react";

export default function MagazinesAdminPage() {
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [language, setLanguage] = useState("Telugu");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Filters
  const [activeLangFilter, setActiveLangFilter] = useState("All Languages");
  const [searchQuery, setSearchQuery] = useState("");

  const languagesList = ["All Languages", "Tamil", "Telugu", "English", "Hindi", "Kannada", "Malayalam"];

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

  useEffect(() => {
    fetchMagazines();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage || !pdfFile) {
      alert("Please select both a cover image and a PDF file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("month_year", monthYear);
    formData.append("language", language);
    formData.append("cover_image", coverImage);
    formData.append("file", pdfFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/magazines/", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Magazine uploaded successfully!");
        setTitle("");
        setMonthYear("");
        setCoverImage(null);
        setPdfFile(null);
        setShowAddForm(false);
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input: any) => (input.value = ""));
        fetchMagazines();
      } else {
        alert("Upload failed. Check console.");
        console.error(await res.text());
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading magazine.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this magazine?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/magazines/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMagazines((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMagazines = magazines.filter((m) => {
    const matchesLang = activeLangFilter === "All Languages" || m.language === activeLangFilter;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <div className="space-y-6 text-[#1A4B5C]">
      {/* Top Header */}
      <div className="bg-white rounded-[20px] shadow-sm py-5 px-8 flex items-center justify-between">
        <h2 className="text-[28px] font-extrabold text-[#053245]">Magazines</h2>
        <span className="text-[#0B7A8A] font-medium text-sm">admin</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[30px] shadow-sm p-8 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-[22px] font-bold text-[#053245]">Manage Magazine Downloads</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2.5 bg-[#0B7A8A] text-white font-semibold rounded-full hover:bg-[#09626e] transition-colors shadow-sm text-sm"
          >
            {showAddForm ? "Cancel" : "Add Magazine"}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-[#EAF5F8] p-6 rounded-2xl mb-8 border border-[#BDE0E8]">
            <h4 className="font-bold text-[#053245] mb-4">Upload New Magazine</h4>
            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-0 focus:ring-2 focus:ring-[#0B7A8A] rounded-xl px-4 py-2.5 shadow-sm text-sm"
                  placeholder="e.g. Test"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Month & Year / Version</label>
                <input
                  type="text"
                  required
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                  className="w-full border-0 focus:ring-2 focus:ring-[#0B7A8A] rounded-xl px-4 py-2.5 shadow-sm text-sm"
                  placeholder="e.g. v2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border-0 focus:ring-2 focus:ring-[#0B7A8A] rounded-xl px-4 py-2.5 shadow-sm text-sm bg-white"
                >
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                </select>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Cover Image</label>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#0B7A8A] hover:file:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Magazine PDF</label>
                  <input
                    type="file"
                    required
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#0B7A8A] hover:file:bg-gray-50"
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-[#871936] text-white font-semibold rounded-full hover:bg-[#6c142b] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                >
                  {uploading ? "Uploading..." : "Save Magazine"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {languagesList.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLangFilter(lang)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                activeLangFilter === lang
                  ? "bg-[#871936] text-white shadow-sm"
                  : "bg-[#EAF5F8] text-[#0B7A8A] hover:bg-[#D5EBEF]"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-wrap gap-4 mb-10 items-center">
          <input
            type="text"
            placeholder="Search items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-5 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-[#0B7A8A] text-sm w-64 placeholder-gray-400"
          />
          <div className="relative">
            <select 
              value={activeLangFilter}
              onChange={(e) => setActiveLangFilter(e.target.value)}
              className="appearance-none px-5 py-2.5 pr-10 rounded-full border border-gray-200 focus:outline-none focus:border-[#0B7A8A] text-sm text-gray-700 bg-white min-w-[140px] cursor-pointer"
            >
              {languagesList.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none px-5 py-2.5 pr-10 rounded-full border border-gray-200 focus:outline-none focus:border-[#0B7A8A] text-sm text-gray-700 bg-white min-w-[140px] cursor-pointer">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-[#0B7A8A] font-medium">Loading magazines...</div>
        ) : filteredMagazines.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-medium">No magazines found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider pl-2">Title</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Language</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">File Size</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Downloads</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Status</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredMagazines.map((mag, i) => (
                  <tr key={mag.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 pl-2">
                      <div className="font-bold text-[#053245] text-[15px]">{mag.title}</div>
                      <div className="text-[12px] font-medium text-gray-400 mt-1">{mag.month_year || 'v2'}</div>
                    </td>
                    <td className="py-5 text-gray-600 font-medium text-[14px]">{mag.language}</td>
                    <td className="py-5 text-[#053245] font-medium text-[13px]">15.35 KB</td>
                    <td className="py-5 text-[#053245] font-medium text-[14px]">2</td>
                    <td className="py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                        Active
                      </span>
                    </td>
                    <td className="py-5 space-x-2">
                      <button className="px-4 py-1.5 bg-[#0B7A8A] text-white text-xs font-bold rounded-full hover:bg-[#09626e] transition-colors">
                        Edit
                      </button>
                      <button className="px-4 py-1.5 bg-[#EAF5F8] text-[#0B7A8A] text-xs font-bold rounded-full hover:bg-[#D5EBEF] transition-colors">
                        Inactive
                      </button>
                      <button
                        onClick={() => handleDelete(mag.id)}
                        className="px-4 py-1.5 bg-[#B32625] text-white text-xs font-bold rounded-full hover:bg-[#921f1e] transition-colors shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


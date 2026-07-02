"use client";

import React, { useState, useEffect } from "react";
import ConfirmModal from '../../../components/ConfirmModal';
import AlertModal from '../../../components/AlertModal';

export default function MagazinesAdminPage() {
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });

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
      const token = localStorage.getItem('admin_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Token ${token}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/magazines/`, { headers });
      if (res.ok) {
        const data = await res.json();
        setMagazines(Array.isArray(data) ? data : (data?.results || []));
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

  const handleOpenEdit = (mag: any) => {
    setIsEditing(true);
    setEditId(mag.id);
    setTitle(mag.title);
    setMonthYear(mag.month_year || "");
    setLanguage(mag.language || "Telugu");
    setCoverImage(null);
    setPdfFile(null);
    setShowAddForm(true);
  };

  const handleToggleStatus = async (mag: any) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/magazines/${mag.id}/`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: JSON.stringify({ is_active: mag.is_active === undefined ? false : !mag.is_active })
      });
      if (res.ok) {
        fetchMagazines();
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to update status.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Error updating status.', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && (!coverImage || !pdfFile)) {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Please select both a cover image and a PDF file.', type: 'error' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("month_year", monthYear);
    formData.append("language", language);
    if (coverImage) formData.append("cover_image", coverImage);
    if (pdfFile) formData.append("file", pdfFile);

    try {
      const token = localStorage.getItem('admin_token');
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/magazines/${editId}/` 
        : `${process.env.NEXT_PUBLIC_API_URL}/magazines/`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: formData,
      });

      if (res.ok) {
        setTitle("");
        setMonthYear("");
        setCoverImage(null);
        setPdfFile(null);
        setIsEditing(false);
        setEditId(null);
        setShowAddForm(false);
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input: any) => (input.value = ""));
        fetchMagazines();
        setAlertConfig({ isOpen: true, title: 'Success', message: isEditing ? 'Magazine updated successfully!' : 'Magazine uploaded successfully!', type: 'success' });
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: isEditing ? 'Update failed. Check console.' : 'Upload failed. Check console.', type: 'error' });
        console.error(await res.text());
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({ isOpen: true, title: 'Error', message: isEditing ? 'Error updating magazine.' : 'Error uploading magazine.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/magazines/${deleteId}/`, {
        method: "DELETE",
        headers: {
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        }
      });
      if (res.ok) {
        setMagazines((prev) => prev.filter((m) => m.id !== deleteId));
        setDeleteId(null);
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to delete magazine.', type: 'error' });
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Error deleting magazine.', type: 'error' });
      setDeleteId(null);
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
            onClick={() => {
              if (showAddForm) {
                setShowAddForm(false);
                setIsEditing(false);
                setEditId(null);
                setTitle("");
                setMonthYear("");
                setLanguage("Telugu");
              } else {
                setShowAddForm(true);
              }
            }}
            className="px-6 py-2.5 bg-[#0B7A8A] text-white font-semibold rounded-full hover:bg-[#09626e] transition-colors shadow-sm text-sm"
          >
            {showAddForm ? "Cancel" : "Add Magazine"}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-[#EAF5F8] p-6 rounded-2xl mb-8 border border-[#BDE0E8]">
            <h4 className="font-bold text-[#053245] mb-4">{isEditing ? "Edit Magazine" : "Upload New Magazine"}</h4>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    required={!isEditing}
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#0B7A8A] hover:file:bg-gray-50"
                  />
                  {isEditing && <p className="text-xs text-gray-500 mt-1">Leave blank to keep current cover.</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Magazine PDF</label>
                  <input
                    type="file"
                    required={!isEditing}
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#0B7A8A] hover:file:bg-gray-50"
                  />
                  {isEditing && <p className="text-xs text-gray-500 mt-1">Leave blank to keep current PDF.</p>}
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${mag.is_active !== false ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>
                        {mag.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-5 space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(mag)}
                        className="px-4 py-1.5 bg-[#0B7A8A] text-white text-xs font-bold rounded-full hover:bg-[#09626e] transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(mag)}
                        className="px-4 py-1.5 bg-[#EAF5F8] text-[#0B7A8A] text-xs font-bold rounded-full hover:bg-[#D5EBEF] transition-colors"
                      >
                        {mag.is_active !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => confirmDelete(mag.id)}
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

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Magazine"
        message="Are you sure you want to permanently delete this magazine? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />

      <AlertModal 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}


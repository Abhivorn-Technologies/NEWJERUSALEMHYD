'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfirmModal from '../../../components/ConfirmModal';
import AlertModal from '../../../components/AlertModal';

function ContentItemsPageInner() {
  const searchParams = useSearchParams();
  const sectionQuery = searchParams.get('section');
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });

  // Form states
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [section, setSection] = useState("Old Testament");
  const [pdfLink, setPdfLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const sectionsMap: Record<string, string> = {
    "All Sections": "All Sections",
    "Old Testament": "Old Testament Stories",
    "New Testament": "New Testament Stories",
    "Topical": "Topical Lessons",
    "Biographical": "Biographical Stories",
    "Pre School": "Pre School Lessons",
    "Coloring": "Coloring Activities",
    "Quizzes": "Bible Quizzes",
    "Puzzles": "Bible Puzzles"
  };

  const sectionsList = Object.keys(sectionsMap);

  const [activeSectionFilter, setActiveSectionFilter] = useState(
    sectionQuery && sectionsList.includes(sectionQuery) ? sectionQuery : "All Sections"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/content-items/?page_category=Bible+Stories+%26+Activities");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle("");
    setSubtitle("");
    setSection(activeSectionFilter !== "All Sections" ? activeSectionFilter : "Old Testament");
    setPdfLink("");
    setIsActive(true);
    setShowAddForm(true);
  };

  const handleOpenEdit = (item: any) => {
    setIsEditing(true);
    setEditId(item.id);
    setTitle(item.title);
    setSubtitle(item.subtitle || "");
    setSection(item.section);
    setIsActive(item.is_active);
    
    let pdf = "";
    if (item.links && Array.isArray(item.links) && item.links.length > 0) {
      pdf = item.links[0].url || "";
    } else if (item.link) {
      pdf = item.link;
    }
    setPdfLink(pdf);
    
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const token = localStorage.getItem('admin_token');
    
    const links = pdfLink ? [{ text: 'PDF', url: pdfLink }] : [];

    const payload = {
      title,
      subtitle,
      section,
      is_active: isActive,
      links,
      page_category: 'Bible Stories & Activities'
    };

    const url = isEditing 
      ? `http://127.0.0.1:8000/api/content-items/${editId}/` 
      : `http://127.0.0.1:8000/api/content-items/`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAddForm(false);
        fetchItems();
        setAlertConfig({ isOpen: true, title: 'Success', message: 'Item saved successfully!', type: 'success' });
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to save item. Check console.', type: 'error' });
        console.error(await res.text());
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Error saving item.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async (item: any) => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/content-items/${item.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ is_active: !item.is_active })
    });
    if (res.ok) {
      fetchItems();
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const executeDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/content-items/${deleteId}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      if (res.ok) {
        setItems((prev) => prev.filter((m) => m.id !== deleteId));
        setDeleteId(null);
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to delete item.', type: 'error' });
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Error deleting item.', type: 'error' });
      setDeleteId(null);
    }
  };

  const filteredItems = items.filter((m) => {
    const matchesSection = activeSectionFilter === "All Sections" || m.section === activeSectionFilter;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const isRelevantSection = sectionsList.includes(m.section) && m.section !== "All Sections";
    return matchesSection && matchesSearch && isRelevantSection;
  });

  return (
    <div className="space-y-6 text-[#1A4B5C]">
      {/* Top Header */}
      <div className="bg-white rounded-[20px] shadow-sm py-5 px-8 flex items-center justify-between">
        <h2 className="text-[28px] font-extrabold text-[#053245]">Manage Content Items</h2>
        <span className="text-[#0B7A8A] font-medium text-sm">admin</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[30px] shadow-sm p-8 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-[22px] font-bold text-[#053245] invisible">Manage Content Items</h3>
          <button
            onClick={showAddForm ? () => setShowAddForm(false) : handleOpenAdd}
            className="px-6 py-2.5 bg-[#0B7A8A] text-white font-semibold rounded-full hover:bg-[#09626e] transition-colors shadow-sm text-sm"
          >
            {showAddForm ? "Cancel" : "Add Item"}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-[#EAF5F8] p-6 rounded-2xl mb-8 border border-[#BDE0E8]">
            <h4 className="font-bold text-[#053245] mb-4">{isEditing ? "Edit Item" : "Add New Item"}</h4>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-0 focus:ring-2 focus:ring-[#0B7A8A] rounded-xl px-4 py-2.5 shadow-sm text-sm"
                  placeholder="e.g. The Creation of the Earth"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Subtitle / Scripture Reference</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full border-0 focus:ring-2 focus:ring-[#0B7A8A] rounded-xl px-4 py-2.5 shadow-sm text-sm"
                  placeholder="e.g. Genesis 1-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full border-0 focus:ring-2 focus:ring-[#0B7A8A] rounded-xl px-4 py-2.5 shadow-sm text-sm bg-white"
                >
                  {sectionsList.filter(s => s !== "All Sections").map(s => (
                    <option key={s} value={s}>{sectionsMap[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0B7A8A] mb-1">PDF Link (URL)</label>
                <input
                  type="text"
                  value={pdfLink}
                  onChange={(e) => setPdfLink(e.target.value)}
                  className="w-full border-0 focus:ring-2 focus:ring-[#0B7A8A] rounded-xl px-4 py-2.5 shadow-sm text-sm"
                  placeholder="e.g. /wp-content/uploads/file.pdf"
                />
              </div>
              <div className="md:col-span-2">
                 <label className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition w-max">
                   <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-5 h-5 accent-[#0B7A8A] cursor-pointer" />
                   <span className="text-sm font-bold text-gray-700">Active</span>
                 </label>
              </div>
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-[#871936] text-white font-semibold rounded-full hover:bg-[#6c142b] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                >
                  {uploading ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {sectionsList.map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSectionFilter(sec)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                activeSectionFilter === sec
                  ? "bg-[#871936] text-white shadow-sm"
                  : "bg-[#EAF5F8] text-[#0B7A8A] hover:bg-[#D5EBEF]"
              }`}
            >
              {sectionsMap[sec]}
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
              value={activeSectionFilter}
              onChange={(e) => setActiveSectionFilter(e.target.value)}
              className="appearance-none px-5 py-2.5 pr-10 rounded-full border border-gray-200 focus:outline-none focus:border-[#0B7A8A] text-sm text-gray-700 bg-white min-w-[200px] cursor-pointer"
            >
              {sectionsList.map(sec => (
                <option key={sec} value={sec}>{sectionsMap[sec]}</option>
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
          <div className="py-12 text-center text-[#0B7A8A] font-medium">Loading items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-medium">No items found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider pl-2 w-12">#</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Title</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Section</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Links</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Status</th>
                  <th className="pb-4 text-[11px] font-bold text-[#053245] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredItems.map((item, i) => {
                  let pdfLinkStr = "";
                  if (item.links && Array.isArray(item.links) && item.links.length > 0) {
                    pdfLinkStr = item.links[0].url || "";
                  } else if (item.link) {
                    pdfLinkStr = item.link; // fallback for older data
                  }

                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 pl-2 text-gray-500 font-medium text-[14px]">{(i + 1) * 10}</td>
                      <td className="py-5 text-[#053245] font-bold text-[14px] max-w-[300px] pr-4">{item.title}</td>
                      <td className="py-5 text-gray-600 font-medium text-[13px]">{sectionsMap[item.section] || item.section}</td>
                      <td className="py-5">
                        {pdfLinkStr ? (
                          <a href={pdfLinkStr} target="_blank" rel="noreferrer" className="text-[#053245] underline font-medium text-[13px] hover:text-[#0B7A8A]">
                            PDF
                          </a>
                        ) : (
                          <span className="text-gray-400 text-[13px]">-</span>
                        )}
                      </td>
                      <td className="py-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.is_active ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]'}`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-5 space-x-2 whitespace-nowrap">
                        <button onClick={() => handleOpenEdit(item)} className="px-4 py-1.5 bg-[#0B7A8A] text-white text-xs font-bold rounded-full hover:bg-[#09626e] transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleToggleStatus(item)} className="px-4 py-1.5 bg-[#EAF5F8] text-[#0B7A8A] text-xs font-bold rounded-full hover:bg-[#D5EBEF] transition-colors">
                          {item.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="px-4 py-1.5 bg-[#B32625] text-white text-xs font-bold rounded-full hover:bg-[#921f1e] transition-colors shadow-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Item"
        message="Are you sure you want to permanently delete this item? This action cannot be undone."
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

export default function ContentItemsPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-[#0B7A8A] font-medium">Loading content...</div>}>
      <ContentItemsPageInner />
    </Suspense>
  );
}

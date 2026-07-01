"use client";

import React, { useState, useEffect } from "react";
import ConfirmModal from '../../../components/ConfirmModal';
import AlertModal from '../../../components/AlertModal';

export default function BibleResourceCardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });

  // Form states
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Token ${token}`;
      const res = await fetch("http://127.0.0.1:8000/api/bible-resources/", { headers });
      if (res.ok) {
        const data = await res.json();
        setCards(Array.isArray(data) ? data : (data?.results || []));
      }
    } catch (err) {
      console.error("Error fetching cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleOpenEdit = (card: any) => {
    setIsEditing(true);
    setEditId(card.id);
    setTitle(card.title || "");
    setLink(card.link || "");
    setImage(card.image || "");
    setOrder(card.order || 0);
    setShowAddForm(true);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle("");
    setLink("");
    setImage("");
    setOrder(0);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = { title, link, image, order };

    try {
      const token = localStorage.getItem('admin_token');
      const url = isEditing 
        ? `http://127.0.0.1:8000/api/bible-resources/${editId}/` 
        : "http://127.0.0.1:8000/api/bible-resources/";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddForm(false);
        fetchCards();
        setAlertConfig({ isOpen: true, title: 'Success', message: isEditing ? 'Card updated successfully!' : 'Card created successfully!', type: 'success' });
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to save card. Check console.', type: 'error' });
        console.error(await res.text());
      }
    } catch (err) {
      console.error(err);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Error saving card.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://127.0.0.1:8000/api/bible-resources/${deleteId}/`, {
        method: "DELETE",
        headers: {
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        }
      });
      if (res.ok) {
        setCards(cards.filter(c => c.id !== deleteId));
        setAlertConfig({ isOpen: true, title: 'Deleted', message: 'Card deleted successfully!', type: 'success' });
      } else {
        setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to delete card.', type: 'error' });
      }
    } catch (err) {
      console.error("Error deleting card:", err);
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Error deleting card.', type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      <AlertModal 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Card"
        message="Are you sure you want to delete this resource card? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bible Resource Cards</h1>
          <p className="text-gray-500 mt-1">Manage the large cards shown on the Bible Resources frontend page.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-[12px] font-medium shadow-sm shadow-primary/20 transition-all active:scale-[0.98] flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Card
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Order</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Title</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Link URL</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.sort((a, b) => a.order - b.order).map((card) => (
                <tr key={card.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                      {card.order}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{card.title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-500 font-mono text-sm">{card.link}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleOpenEdit(card)}
                        className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(card.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cards.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    <p className="text-base font-medium">No resource cards found</p>
                    <p className="text-sm mt-1">Add a new card to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{isEditing ? "Edit Resource Card" : "Add Resource Card"}</h3>
                <p className="text-sm text-gray-500 mt-1">Fill in the details for the frontend card</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BIBLE INFOGRAPHICS"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link URL <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /bible-resources/infographics"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image Path (Optional)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. /wp-content/uploads/2026/..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-gray-900"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
                  ) : (
                    <>{isEditing ? 'Save Changes' : 'Create Card'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

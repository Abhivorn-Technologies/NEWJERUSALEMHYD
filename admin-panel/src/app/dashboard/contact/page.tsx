'use client';
import { useState, useEffect } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import AlertModal from '../../../components/AlertModal';

export default function ContactInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });

  const fetchMessages = () => {
    const token = localStorage.getItem('admin_token');
    fetch('http://127.0.0.1:8000/api/contact-submissions/', {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : (data?.results || []));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/contact-submissions/${deleteId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (res.ok) {
      fetchMessages();
      setDeleteId(null);
    } else {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to delete message. Are you logged in?', type: 'error' });
      setDeleteId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Inbox</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No messages found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map(msg => (
              <div key={msg.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{msg.name}</h3>
                    <p className="text-sm text-gray-500">{msg.email} | {msg.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-2">
                      {new Date(msg.submitted_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => confirmDelete(msg.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {msg.subject && (
                  <h4 className="text-md font-semibold text-gray-800 mt-2">Subject: {msg.subject}</h4>
                )}
                <div className="mt-2 text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-100">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to permanently delete this message? This action cannot be undone."
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

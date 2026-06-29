'use client';
import { useState, useEffect } from 'react';

export default function ContactInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    fetch('http://127.0.0.1:8000/api/contact-submissions/')
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/contact-submissions/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (res.ok) {
      fetchMessages();
    } else {
      alert('Failed to delete message. Are you logged in?');
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
                      onClick={() => handleDelete(msg.id)}
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
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import AlertModal from '../../../components/AlertModal';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    id: 1,
    site_name: '',
    phone1: '',
    phone2: '',
    email: '',
    address: '',
    footer_tagline: ''
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/site-settings/')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const settings = data[0];
          setFormData({
            id: settings.id,
            site_name: settings.site_name || '',
            phone1: settings.phone1 || '',
            phone2: settings.phone2 || '',
            email: settings.email || '',
            address: settings.address || '',
            footer_tagline: settings.footer_tagline || ''
          });
        }
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Not logged in', type: 'error' });
      setSaving(false);
      return;
    }

    const res = await fetch(`http://127.0.0.1:8000/api/site-settings/${formData.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(formData)
    });

    setSaving(false);

    if (res.ok) {
      setAlertConfig({ isOpen: true, title: 'Success', message: 'Settings saved successfully!', type: 'success' });
    } else {
      setAlertConfig({ isOpen: true, title: 'Error', message: 'Failed to save settings.', type: 'error' });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Site Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Site Name</label>
            <input 
              required 
              type="text" 
              value={formData.site_name} 
              onChange={e => setFormData({...formData, site_name: e.target.value})} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Primary Phone</label>
              <input 
                type="text" 
                value={formData.phone1} 
                onChange={e => setFormData({...formData, phone1: e.target.value})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Secondary Phone</label>
              <input 
                type="text" 
                value={formData.phone2} 
                onChange={e => setFormData({...formData, phone2: e.target.value})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Public Contact Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Physical Address</label>
            <textarea 
              rows={3} 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Footer Tagline</label>
            <textarea 
              rows={2} 
              value={formData.footer_tagline} 
              onChange={e => setFormData({...formData, footer_tagline: e.target.value})} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            ></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
          
        </form>
      </div>

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

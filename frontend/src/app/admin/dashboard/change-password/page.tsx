'use client';

import { useState } from 'react';
import { Lock, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Password changed successfully! You can now use your new password.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to change password. Please check your current password.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
          <Lock className="w-6 h-6 text-[#D04A73]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-[#1a3845] leading-tight">Change Password</h1>
          <p className="text-gray-500">Update your admin account security credentials</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[18px] font-bold text-[#1a3845]">Account Security</h2>
          <p className="text-[14px] text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-[14px] text-green-700">{success}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[13px] text-gray-700 uppercase tracking-wide">Current Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-gray-400 group-focus-within:text-[#D04A73] transition-colors" />
              </div>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D04A73]/20 focus:border-[#D04A73] transition-all text-[15px]"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-6">
            <div className="space-y-2">
              <label className="block text-[13px] text-gray-700 uppercase tracking-wide">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-[#D04A73] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D04A73]/20 focus:border-[#D04A73] transition-all text-[15px]"
                  placeholder="At least 8 characters"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] text-gray-700 uppercase tracking-wide">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <CheckCircle2 className="h-4 w-4 text-gray-400 group-focus-within:text-[#D04A73] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D04A73]/20 focus:border-[#D04A73] transition-all text-[15px]"
                  placeholder="Must match new password"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D04A73] hover:bg-[#b03a5d] text-white rounded-xl transition-colors shadow-md shadow-[#D04A73]/20 disabled:opacity-70 disabled:cursor-not-allowed text-[15px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

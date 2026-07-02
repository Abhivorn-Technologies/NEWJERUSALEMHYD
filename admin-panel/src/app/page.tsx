"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, KeyRound, ChevronRight, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.token);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Please check your username and password.");
      }
    } catch (err) {
      setError("Network error. Could not connect to the authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f4f6] relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#FADADD]/40 to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-md px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="pt-8 pb-4 px-8 flex flex-col items-center border-b border-gray-50 bg-gray-50/50">
            {/* Logo */}
            <div className="w-40 h-16 relative mb-4">
              <Image 
                src="/images/logo.png" 
                alt="New Jerusalem Ministries Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-[#4D1C2C]">Admin Portal</h1>
            <p className="text-gray-500 text-xs mt-1 font-medium">Secure Access Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400 group-focus-within:text-[#D04A73] transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D04A73]/20 focus:border-[#D04A73] transition-all text-sm font-medium"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-gray-400 group-focus-within:text-[#D04A73] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D04A73]/20 focus:border-[#D04A73] transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 group relative flex items-center justify-center gap-2 px-4 py-3 bg-[#D04A73] hover:bg-[#b03a5d] text-white rounded-lg transition-colors font-semibold shadow-md shadow-[#D04A73]/20 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="bg-gray-50 py-3 text-center border-t border-gray-100">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 font-medium uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure Connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

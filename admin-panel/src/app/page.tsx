"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

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
      const res = await fetch("http://127.0.0.1:8000/api-token-auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.token);
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Access</h1>
          <p className={styles.subtitle}>Sign in to access your dashboard</p>
        </div>
        
        <form className={styles.formGroup} onSubmit={handleLogin}>
          {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Email / Username</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input} 
              placeholder="Enter your admin credentials" 
              required 
            />
          </div>
          
          <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input} 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn} style={{ marginTop: '1.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? "Authenticating..." : "Secure Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

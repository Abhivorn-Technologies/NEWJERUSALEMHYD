"use client";

import React, { useState, useEffect } from "react";

export default function MagazinesAdminPage() {
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [language, setLanguage] = useState("Telugu");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
        // Reset file inputs (simple hack)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Manage Magazines</h2>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload New Magazine</h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Chinnaarula Jaalaree"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month & Year</label>
            <input
              type="text"
              required
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="May 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="Telugu">Telugu</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (JPEG/PNG)</label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Magazine PDF</label>
              <input
                type="file"
                required
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload Magazine"}
            </button>
          </div>
        </form>
      </div>

      {/* Magazines List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Uploaded Magazines</h3>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : magazines.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No magazines uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="px-6 py-3">Cover</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Month & Year</th>
                  <th className="px-6 py-3">Language</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {magazines.map((mag) => (
                  <tr key={mag.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <img src={mag.cover_image} alt={mag.title} className="h-12 w-9 object-cover rounded shadow-sm" />
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-800">{mag.title}</td>
                    <td className="px-6 py-3 text-gray-600">{mag.month_year}</td>
                    <td className="px-6 py-3 text-gray-600">{mag.language}</td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <a
                        href={mag.file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        View PDF
                      </a>
                      <button
                        onClick={() => handleDelete(mag.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
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

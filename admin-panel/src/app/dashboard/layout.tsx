import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400">NJM Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Dashboard
          </Link>
          <Link href="/dashboard/songs" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Manage Songs
          </Link>
          <Link href="/dashboard/pages" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Static Pages
          </Link>
          <Link href="/dashboard/contact" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Contact Inbox
          </Link>
          <Link href="/dashboard/reviews" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Reviews
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

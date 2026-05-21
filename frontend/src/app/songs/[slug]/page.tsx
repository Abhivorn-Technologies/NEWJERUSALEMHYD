import SongTabs from '@/components/SongTabs';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getSong(slug: string) {
  // We use the slug to filter, since our API supports ?slug= or we can build an endpoint for detail.
  // Wait, DRF DefaultRouter uses ID by default, let's fetch all and filter for now, or just assume ID is slug.
  // Actually, I should update the DRF ViewSet to use lookup_field = 'slug'.
  // For now we fetch all and find the match (inefficient but works for a quick demo)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const res = await fetch(`${baseUrl}/songs/`, { cache: 'no-store' });
  if (!res.ok) return null;
  const songs = await res.json();
  return songs.find((s: any) => s.slug === slug);
}

export default async function SongPage({ params }: { params: { slug: string } }) {
  const song = await getSong(params.slug);

  if (!song) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Index
        </Link>
        
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
          <header className="mb-6 pb-6 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{song.title}</h1>
            <div className="flex gap-2 flex-wrap">
              {song.categories?.map((cat: any) => (
                <span key={cat.id} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  {cat.name}
                </span>
              ))}
            </div>
          </header>
          
          <SongTabs song={song} />
        </article>
      </div>
    </main>
  );
}

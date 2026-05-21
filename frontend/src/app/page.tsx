import HeroBanner from '@/components/HeroBanner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getHomePage() {
  try {
    const res = await fetch(`${BASE_URL}/pages/home/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function Home() {
  const page = await getHomePage();
  const content = page?.content ?? '';

  return (
    <main>
      <HeroBanner />

      {/* Mission Content */}
      <section className="bg-[#015C61]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-3/4 px-6 py-12 md:py-16 md:pl-[5%]">
              <div className="bg-[#173C4E] text-white py-3 px-8 inline-block font-bold text-2xl mb-8" style={{ fontFamily: 'var(--font-roboto)' }}>
                Our Mission
              </div>
              <div
                className="space-y-5 mission-content"
                style={{ fontFamily: 'var(--font-ramabhadra)', fontSize: 'clamp(14px, 1.2vw, 20px)', color: '#E2E2E2' }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            <div className="hidden md:block w-1/4" />
          </div>
        </div>
      </section>
    </main>
  );
}

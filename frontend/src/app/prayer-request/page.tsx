'use client';

export default function PrayerRequestPage() {
  return (
    <div className="min-h-screen bg-[#f0f6f9]" style={{ fontFamily: 'var(--font-poppins)' }}>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">

        {/* Page Header */}
        <div className="text-center mb-10 reveal">
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4 tracking-tight">
            Prayer Request
          </h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full" />
          <p className="mt-5 text-gray-600 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            We believe in the power of prayer. Share your heart with us and our dedicated
            prayer team will intercede faithfully on your behalf.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left Column ──────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

            {/* Scripture Card */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow border border-gray-100 group hover:shadow-md transition-shadow duration-300">
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-to-r from-[#8b1e15] to-[#c0392b]" />

              {/* Background watermark cross */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span className="text-[140px] font-black text-gray-50 leading-none opacity-60">✝</span>
              </div>

              <div className="relative z-10 p-8">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">📖</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#8b1e15]">Daily Scripture</p>
                    <p className="text-xs text-gray-400 font-medium">కొలొస్సయులకు 4:2</p>
                  </div>
                </div>

                <blockquote
                  className="text-lg md:text-xl text-gray-800 leading-relaxed font-normal italic border-l-4 border-[#8b1e15] pl-4"
                  style={{ fontFamily: 'var(--font-ramabhadra)' }}
                >
                  "ప్రార్థన చేయుటయందు నిత్యము నిలకడగా ఉండుడి, ప్రార్థనయందు కృతజ్ఞత గలవారై మెలకువగా ఉండుడి."
                </blockquote>

                <p className="mt-4 text-xs text-gray-400 text-right font-semibold">— Colossians 4:2</p>
              </div>
            </div>

            {/* How We Pray Card */}
            <div className="bg-[#1f4251] text-white rounded-3xl p-8 shadow border border-[#173C4E]">
              <h3 className="text-lg font-bold tracking-tight border-b border-white/10 pb-3 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#8b1e15] flex items-center justify-center text-xs">✦</span>
                How We Pray For You
              </h3>

              <div className="space-y-5">
                {[
                  {
                    icon: '🔒',
                    title: 'Strictly Confidential',
                    desc: 'Your prayer requests are handled with absolute privacy and care by our dedicated prayer team.',
                  },
                  {
                    icon: '🙏',
                    title: 'Daily Intercession',
                    desc: 'Our pastors and prayer partners gather every day to bring your request before the Lord.',
                  },
                  {
                    icon: '✨',
                    title: 'Faithful & Hopeful',
                    desc: 'We trust in a God who hears, cares, and answers prayers according to His perfect will.',
                  },
                  {
                    icon: '📞',
                    title: 'Follow-Up Support',
                    desc: 'If you need further counsel or encouragement, our team is always here to support you.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-lg">
                      {icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{title}</h4>
                      <p className="text-xs text-white/70 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouragement strip */}
            <div className="rounded-2xl bg-gradient-to-br from-[#8b1e15]/10 to-[#1f4251]/10 border border-[#8b1e15]/20 p-5 flex gap-3 items-start">
              <span className="text-2xl mt-0.5">💌</span>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-[#1f4251]">You are not alone.</span> Whatever you're
                going through, our church family stands with you in prayer and love.
              </p>
            </div>
          </div>

          {/* ── Right Column — Google Form ─────────────────── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100">
              {/* Colorful top bar */}
              <div className="h-2 bg-gradient-to-r from-[#1f4251] via-[#8b1e15] to-[#1f4251]" />

              {/* Form header */}
              <div className="px-6 pt-5 pb-2 flex items-center gap-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-[#8b1e15]/10 flex items-center justify-center text-base flex-shrink-0">
                  📝
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1f4251]">Submit Your Prayer Request</h2>
                  <p className="text-xs text-gray-400">Fill in the form below — we'll pray for you.</p>
                </div>
                <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                  Secure
                </span>
              </div>

              {/* iframe wrapper */}
              <div className="bg-gray-50/60 px-4 py-4">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSc0mNx0e_dMFTu8guF-G3olGg6w43XOoHmOtHcdFkBwZxxY0g/viewform?embedded=true"
                  width="100%"
                  height="900"
                  frameBorder={0}
                  marginHeight={0}
                  marginWidth={0}
                  className="w-full rounded-2xl bg-white border border-gray-100 shadow-sm"
                  title="Prayer Request Form"
                >
                  Loading…
                </iframe>
              </div>

              {/* Privacy footer */}
              <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-2">
                <span className="text-gray-400 text-xs">🔐</span>
                <p className="text-[11px] text-gray-400">
                  Your response is private and only shared with our prayer team.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

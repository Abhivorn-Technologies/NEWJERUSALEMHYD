import Link from 'next/link';

export default function SundaySchoolPage() {
  const sections = [
    {
      title: "Sunday School Songs",
      link: "/sunday-school/songs",
      icon: "🎵",
      desc: "Sunday School songs in Telugu, English, and Hindi."
    },
    {
      title: "Stories from Bible",
      link: "/stories",
      icon: "📖",
      desc: "Explore wonderful Old and New Testament stories."
    },
    {
      title: "Activities",
      link: "/activities",
      icon: "🎨",
      desc: "Coloring pages, Bible quizzes, and word puzzles."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center mb-16 reveal">
          <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4">Sunday School</h1>
          <div className="h-1 w-24 bg-[#FF99BE] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Resources, songs, and activities designed to nurture the faith of our children.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {sections.map((section, idx) => (
            <Link key={idx} href={section.link} className="group block w-full sm:w-72 md:w-80">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#4D1C2C] mb-2 group-hover:text-[#FF99BE] transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{section.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

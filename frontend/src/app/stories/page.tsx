import Link from 'next/link';

export default function StoriesPage() {
  const categoriesList = [
    {
      title: "Old Testaments",
      link: "/stories/old-testament",
      icon: "📜",
      desc: "Explore stories from Creation through the Prophets."
    },
    {
      title: "New Testaments",
      link: "/stories/new-testament",
      icon: "📖",
      desc: "Read stories about the life of Jesus and the early Church."
    },
    {
      title: "Topical",
      link: "/stories/topical",
      icon: "🏷️",
      desc: "Stories categorized by important biblical themes."
    },
    {
      title: "Biographical",
      link: "/stories/biographical",
      icon: "👤",
      desc: "Learn about key faithful figures throughout scripture."
    },
    {
      title: "Pre School",
      link: "/stories/pre-school",
      icon: "🧸",
      desc: "Simple, visual stories tailored for young children."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center mb-16 reveal">
          <Link href="/sunday-school" className="inline-flex items-center text-[#4D1C2C]/80 hover:text-[#D81B60] font-semibold transition-colors duration-200 mb-6">
            <span className="mr-2">&larr;</span> Back to Sunday School
          </Link>
          <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4">Bible Stories</h1>
          <div className="h-1 w-24 bg-[#FF99BE] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Explore wonderful stories from the Bible categorized for easy reading.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {categoriesList.map((category, idx) => (
            <Link key={idx} href={category.link} className="group block w-full sm:w-72 md:w-80">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#4D1C2C] mb-2 group-hover:text-[#D81B60] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{category.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

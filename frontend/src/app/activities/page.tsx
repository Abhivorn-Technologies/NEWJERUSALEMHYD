import Link from 'next/link';

export default function ActivitiesPage() {
  const activitiesList = [
    {
      title: "Coloring Pages",
      link: "/activities/coloring",
      icon: "🎨",
      desc: "Beautiful printable coloring pages of Bible scenes."
    },
    {
      title: "Bible Quizzes",
      link: "/activities/quizzes",
      icon: "🧠",
      desc: "Fun trivia quizzes about scripture and Bible stories."
    },
    {
      title: "Bible Puzzles",
      link: "/activities/puzzles",
      icon: "🧩",
      desc: "Crosswords, word searches, and jigsaw puzzles."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center mb-16 reveal">
          <Link href="/sunday-school" className="inline-flex items-center text-[#4D1C2C]/80 hover:text-[#D81B60] font-semibold transition-colors duration-200 mb-6">
            <span className="mr-2">&larr;</span> Back to Sunday School
          </Link>
          <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4">Activities</h1>
          <div className="h-1 w-24 bg-[#FF99BE] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Fun and engaging activities for children to learn about the Bible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {activitiesList.map((activity, idx) => (
            <Link key={idx} href={activity.link} className="group block">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                    {activity.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#4D1C2C] mb-2 group-hover:text-[#D81B60] transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{activity.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

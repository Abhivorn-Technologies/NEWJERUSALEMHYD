import Link from 'next/link';

export default function OldTestamentStoriesPage() {
  const storiesList = [
    { scripture: 'Genesis 1–2; Moses 1–3; Abraham 3–5', title: 'The Creation of the Earth' },
    { scripture: 'Genesis 2–3; Moses 3–5; Abraham 5', title: 'Adam and Eve' },
    { scripture: 'Genesis 4; Moses 5–6', title: 'Adam and Eve’s Family' },
    { scripture: 'Genesis 5; Moses 6–7', title: 'Enoch the Prophet' },
    { scripture: 'Genesis 6–9; Moses 8', title: 'Noah and His Family' },
    { scripture: 'Genesis 11', title: 'The Tower of Babel' },
    { scripture: 'Genesis 11–15; 17; Abraham 1–2', title: 'Abraham and Sarah' },
    { scripture: 'Genesis 16', title: 'Hagar' },
    { scripture: 'Genesis 17; 21–22', title: 'Abraham and Isaac' },
    { scripture: 'Genesis 25–27', title: 'Jacob and Esau' },
    { scripture: 'Genesis 27–33', title: 'Jacob and His Family' },
    { scripture: 'Genesis 30; 37', title: 'Joseph’s Inspired Dreams' },
    { scripture: 'Genesis 39–41', title: 'Joseph in Egypt' },
    { scripture: 'Genesis 42–46', title: 'Joseph and the Famine' },
    { scripture: 'Exodus 1–2', title: 'Baby Moses' },
    { scripture: 'Exodus 2–3', title: 'Moses the Prophet' },
    { scripture: 'Exodus 4–5; 7–12', title: 'The Plagues of Egypt' },
    { scripture: 'Exodus 11–12; 14–15', title: 'The Passover' },
    { scripture: 'Exodus 16', title: 'The Israelites in the Wilderness' },
    { scripture: 'Exodus 19–20; 24; 31–34; Deuteronomy 4–7', title: 'Moses on Mount Sinai' },
    { scripture: 'Numbers 21', title: 'Moses and the Brass Serpent' },
    { scripture: 'Deuteronomy 10; 31; 34; Joshua 1; 3–6; 10–11; 21; 24', title: 'Joshua the Prophet' },
    { scripture: 'Joshua 2; 6', title: 'Rahab and the Spies' },
    { scripture: 'Judges 4–5', title: 'Deborah the Prophetess' },
    { scripture: 'Judges 6–7', title: 'The Army of Gideon' },
    { scripture: 'Ruth 1–4', title: 'Ruth and Naomi' },
    { scripture: '1 Samuel 1–2', title: 'Hannah' },
    { scripture: '1 Samuel 2–3', title: 'Samuel the Prophet' },
    { scripture: '1 Samuel 16', title: 'Young David' },
    { scripture: '1 Samuel 17', title: 'David and Goliath' },
    { scripture: '1 Samuel 18–19; 31; 2 Samuel 1; 5; 11–12', title: 'King David' },
    { scripture: '1 Kings 16–18', title: 'Elijah the Prophet' },
    { scripture: '1 Kings 18', title: 'Elijah and the Priests of Baal' },
    { scripture: '1 Kings 19', title: 'The Lord Speaks to Elijah' },
    { scripture: '2 Kings 2; 4', title: 'Elisha the Prophet' },
    { scripture: '2 Kings 5', title: 'Elisha Heals Naaman' },
    { scripture: '2 Kings 6', title: 'Elisha and the Lord’s Army' },
    { scripture: 'Jonah 1–4', title: 'Jonah the Prophet' },
    { scripture: 'Job 1–3; 19; 38–42', title: 'Job' },
    { scripture: '2 Kings 22; 2 Chronicles 34–35', title: 'King Josiah' },
    { scripture: 'Isaiah 6–7; 9; 53–54', title: 'Isaiah the Prophet' },
    { scripture: 'Jeremiah 1–52', title: 'Jeremiah the Prophet' },
    { scripture: 'Daniel 1', title: 'Daniel and His Friends' },
    { scripture: 'Daniel 2', title: 'Daniel and the King’s Dream' },
    { scripture: 'Daniel 1; 3', title: 'Shadrach, Meshach, and Abed-nego' },
    { scripture: 'Daniel 6', title: 'Daniel and the Lions’ Den' },
    { scripture: 'Esther 2–5; 7–9', title: 'Queen Esther' },
    { scripture: 'Malachi 1; 3', title: 'Malachi the Prophet' },
    { scripture: 'Nehemiah 1–2; 4; 6', title: 'Nehemiah' }
  ];

  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-2xl mx-auto space-y-10">
        <div>
          <Link 
            href="/stories" 
            className="inline-flex items-center text-[#4D1C2C]/85 hover:text-[#D81B60] font-semibold transition-colors duration-200 mb-6"
          >
            <span className="mr-2">&larr;</span> Back to Stories
          </Link>
        </div>

        {/* Contents Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#C2185B] to-[#E91E8C] px-4 sm:px-8 py-6 text-white flex flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Old Testament Stories</h1>
              <p className="text-white/80 text-sm mt-1 max-w-md">Review the contents, scriptures, and chapters detailing stories from the Old Testament.</p>
            </div>
            <img 
              src="/images/stories/old-testament/image1.jpeg" 
              alt="About the Old Testament" 
              className="w-28 h-18 object-cover rounded-lg border border-white/20 shadow-sm"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-pink-50 border-b border-pink-100">
                  <th className="px-2 py-3 sm:px-8 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-[#4D1C2C] uppercase tracking-wider w-16 sm:w-28">
                    Illustration
                  </th>

                  <th className="px-2 py-3 sm:pl-16 sm:pr-6 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-[#4D1C2C] uppercase tracking-wider w-full">
                    Story Title
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {storiesList.map((story, index) => {
                  const imageNum = index + 2;
                  const imagePath = `/images/stories/old-testament/image${imageNum}.jpeg`;
                  return (
                    <tr key={index} className="hover:bg-pink-50/50 transition-colors">
                      <td className="px-2 py-3 sm:px-8 sm:py-4">
                        <img 
                          src={imagePath} 
                          alt={story.title} 
                          className="w-14 h-10 sm:w-20 sm:h-14 object-cover rounded-lg shadow-sm border border-gray-100" 
                        />
                      </td>
                      <td className="px-2 py-3 sm:pl-16 sm:pr-6 sm:py-4 break-words">
                        <a
                          href="/wp-content/uploads/2026/03/logo.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm sm:text-lg text-gray-800 font-semibold hover:text-[#D81B60] hover:underline transition-colors duration-200 cursor-pointer"
                        >
                          {story.title}
                        </a>
                        <span className="block text-[10px] sm:text-xs text-gray-400 font-normal mt-0.5 line-clamp-2">{story.scripture}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

const otStories = [
  { title: 'The Creation of the Earth', scripture: 'Genesis 1\u20132; Moses 1\u20133; Abraham 3\u20135' },
  { title: 'Adam and Eve', scripture: 'Genesis 2\u20133; Moses 3\u20135; Abraham 5' },
  { title: 'Adam and Eve\u2019s Family', scripture: 'Genesis 4; Moses 5\u20136' },
  { title: 'Enoch the Prophet', scripture: 'Genesis 5; Moses 6\u20137' },
  { title: 'Noah and His Family', scripture: 'Genesis 6\u20139; Moses 8' },
  { title: 'The Tower of Babel', scripture: 'Genesis 11' },
  { title: 'Abraham and Sarah', scripture: 'Genesis 11\u201315; 17; Abraham 1\u20132' },
  { title: 'Hagar', scripture: 'Genesis 16' },
  { title: 'Abraham and Isaac', scripture: 'Genesis 17; 21\u201322' },
  { title: 'Jacob and Esau', scripture: 'Genesis 25\u201327' },
  { title: 'Jacob and His Family', scripture: 'Genesis 27\u201333' },
  { title: 'Joseph\u2019s Inspired Dreams', scripture: 'Genesis 30; 37' },
  { title: 'Joseph in Egypt', scripture: 'Genesis 39\u201341' },
  { title: 'Joseph and the Famine', scripture: 'Genesis 42\u201346' },
  { title: 'Baby Moses', scripture: 'Exodus 1\u20132' },
  { title: 'Moses the Prophet', scripture: 'Exodus 2\u20133' },
  { title: 'The Plagues of Egypt', scripture: 'Exodus 4\u20135; 7\u201312' },
  { title: 'The Passover', scripture: 'Exodus 11\u201312; 14\u201315' },
  { title: 'The Israelites in the Wilderness', scripture: 'Exodus 16' },
  { title: 'Moses on Mount Sinai', scripture: 'Exodus 19\u201320; 24; 31\u201334; Deuteronomy 4\u20137' },
  { title: 'Moses and the Brass Serpent', scripture: 'Numbers 21' },
  { title: 'Joshua the Prophet', scripture: 'Deuteronomy 10; 31; 34; Joshua 1; 3\u20136; 10\u201311; 21; 24' },
  { title: 'Rahab and the Spies', scripture: 'Joshua 2; 6' },
  { title: 'Deborah the Prophetess', scripture: 'Judges 4\u20135' },
  { title: 'The Army of Gideon', scripture: 'Judges 6\u20137' },
  { title: 'Ruth and Naomi', scripture: 'Ruth 1\u20134' },
  { title: 'Hannah', scripture: '1 Samuel 1\u20132' },
  { title: 'Samuel the Prophet', scripture: '1 Samuel 2\u20133' },
  { title: 'Young David', scripture: '1 Samuel 16' },
  { title: 'David and Goliath', scripture: '1 Samuel 17' },
  { title: 'King David', scripture: '1 Samuel 18\u201319; 31; 2 Samuel 1; 5; 11\u201312' },
  { title: 'Elijah the Prophet', scripture: '1 Kings 16\u201318' },
  { title: 'Elijah and the Priests of Baal', scripture: '1 Kings 18' },
  { title: 'The Lord Speaks to Elijah', scripture: '1 Kings 19' },
  { title: 'Elisha the Prophet', scripture: '2 Kings 2; 4' },
  { title: 'Elisha Heals Naaman', scripture: '2 Kings 5' },
  { title: 'Elisha and the Lord\u2019s Army', scripture: '2 Kings 6' },
  { title: 'Jonah the Prophet', scripture: 'Jonah 1\u20134' },
  { title: 'Job', scripture: 'Job 1\u20133; 19; 38\u201342' },
  { title: 'King Josiah', scripture: '2 Kings 22; 2 Chronicles 34\u201335' },
  { title: 'Isaiah the Prophet', scripture: 'Isaiah 6\u20137; 9; 53\u201354' },
  { title: 'Jeremiah the Prophet', scripture: 'Jeremiah 1\u201352' },
  { title: 'Daniel and His Friends', scripture: 'Daniel 1' },
  { title: 'Daniel and the King\u2019s Dream', scripture: 'Daniel 2' },
  { title: 'Shadrach, Meshach, and Abed-nego', scripture: 'Daniel 1; 3' },
  { title: 'Daniel and the Lions\u2019 Den', scripture: 'Daniel 6' },
  { title: 'Queen Esther', scripture: 'Esther 2\u20135; 7\u20139' },
  { title: 'Malachi the Prophet', scripture: 'Malachi 1; 3' },
  { title: 'Nehemiah', scripture: 'Nehemiah 1\u20132; 4; 6' },
];

const ntStories = [
  { title: 'John the Baptist Is Born', scripture: 'Luke 1:5\u201325, 57\u201380' },
  { title: 'Angels Visit Mary and Joseph', scripture: 'Matthew 1; Luke 1' },
  { title: 'The Savior Is Born', scripture: 'Luke 2; Matthew 2:1\u201315' },
  { title: 'The Boy Jesus', scripture: 'Luke 2:39\u201352' },
  { title: 'Jesus Is Baptized', scripture: 'Matthew 3' },
  { title: 'Come and See', scripture: 'John 1:43\u201351' },
  { title: 'Satan Tempts Jesus', scripture: 'Matthew 4:1\u201310' },
  { title: 'Jesus, a Woman, and a Well', scripture: 'John 4' },
  { title: 'Jesus Testifies of His Mission', scripture: 'Luke 4:16\u201331' },
  { title: 'Jesus Chooses His Apostles', scripture: 'Matthew 10; Luke 5:1\u201311; 6:12\u201316' },
  { title: 'Jesus Teaches the Sermon on the Mount', scripture: 'Matthew 5\u20137' },
  { title: 'Jesus Heals a Man Who Could Not Walk', scripture: 'Mark 2:1\u201312' },
  { title: 'Jesus Calms the Storm', scripture: 'Matthew 8:23\u201327; Mark 4:36\u201341' },
  { title: 'Jesus Heals a Woman and Raises Jairus\u2019s Daughter', scripture: 'Mark 5:21\u201343' },
  { title: 'Jesus Heals a Centurion\u2019s Servant', scripture: 'Luke 7:1\u201310' },
  { title: 'Jesus Forgives a Woman', scripture: 'Luke 7:36\u201350' },
  { title: 'Jesus Heals a Woman on the Sabbath', scripture: 'Matthew 12:1\u201312; Luke 13:10\u201317' },
  { title: 'Jesus Teaches about Soil, Seeds, Bread, and Pearls', scripture: 'Matthew 13' },
  { title: 'Jesus at the Pool of Bethesda', scripture: 'John 5:1\u201317' },
  { title: 'Jesus Feeds Thousands of People', scripture: 'Matthew 14:13\u201321; John 6' },
  { title: 'Walking on the Water', scripture: 'Matthew 14:22\u201333' },
  { title: 'Jesus Gives His Apostles Priesthood Keys', scripture: 'Matthew 16\u201317' },
  { title: 'Jesus Heals a Blind Man', scripture: 'Mark 8:22\u201325' },
  { title: 'The Parable of the Servant Who Would Not Forgive', scripture: 'Matthew 18:21\u201334' },
  { title: 'People Want to Punish a Woman Who Sinned', scripture: 'John 8:1\u201311' },
  { title: 'Jesus Is the Good Shepherd', scripture: 'John 10:1\u201318' },
  { title: 'The Parable of the Good Samaritan', scripture: 'Luke 10:25\u201337' },
  { title: 'Martha and Mary', scripture: 'Luke 10:38\u201342' },
  { title: 'A Lost Sheep, a Lost Coin, and a Lost Son', scripture: 'Luke 15' },
  { title: 'Jesus Heals Ten Men Who Had Leprosy', scripture: 'Luke 17:11\u201319' },
  { title: 'The Parable of the Workers in the Vineyard', scripture: 'Matthew 20:1\u201316' },
  { title: 'Jesus Blesses Little Children', scripture: 'Mark 10:13\u201316' },
  { title: 'Jesus and the Rich Young Man', scripture: 'Mark 10:17\u201331' },
  { title: 'Jesus Brings Lazarus Back to Life', scripture: 'John 11:1\u201346' },
  { title: 'Zacchaeus the Tax Collector', scripture: 'Luke 19:1\u201310' },
  { title: 'Jesus Rides into Jerusalem', scripture: 'Matthew 21:1\u201316' },
  { title: 'A Widow and Two Small Coins', scripture: 'Mark 12:41\u201344' },
  { title: 'The Parable of the Ten Virgins', scripture: 'Matthew 25:1\u201313' },
  { title: 'The Parable of the Talents', scripture: 'Matthew 25:14\u201330' },
  { title: '\u201cYe Have Done It unto Me\u201d', scripture: 'Matthew 25:31\u201346' },
  { title: 'The Last Supper', scripture: 'Matthew 26; Luke 22; John 13\u201314' },
  { title: 'Jesus in Gethsemane', scripture: 'Matthew 26:36\u201346; Luke 22:39\u201346' },
  { title: 'Jesus Is Arrested', scripture: 'Mark 14\u201315; Luke 22\u201323; John 18\u201319' },
  { title: 'Jesus Gives His Life for Us', scripture: 'Matthew 27; Luke 23; John 19' },
  { title: 'He Is Risen', scripture: 'Luke 24:1\u201312, 36\u201349; John 20' },
  { title: 'Jesus Comforts Two Disciples', scripture: 'Luke 24:13\u201325' },
  { title: 'Jesus Asks the Apostles to Feed His Sheep', scripture: 'John 21; Matthew 28:16\u201320; Mark 16:15\u201319' },
  { title: 'Jesus\u2019s Apostles Lead His Church', scripture: 'Acts 1\u20134' },
  { title: 'Stephen Testifies of Jesus Christ', scripture: 'Acts 6\u20137' },
  { title: 'Simon and the Power of God', scripture: 'Acts 8:5\u201324' },
  { title: 'Jesus Appears to Saul', scripture: 'Acts 9:1\u201331' },
  { title: 'Tabitha, a Woman \u201cFull of Good Works\u201d', scripture: 'Acts 9:36\u201342' },
  { title: 'Cornelius and His Friends Receive the Holy Ghost', scripture: 'Acts 10' },
  { title: 'An Angel Frees Peter from Prison', scripture: 'Acts 12:1\u201317' },
  { title: 'Paul and Silas', scripture: 'Acts 16:9\u201340' },
  { title: 'Miracles during Paul\u2019s Journey to Rome', scripture: 'Acts 21\u201322; 26\u201328' },
  { title: 'Relying on Jesus Christ for Salvation', scripture: 'Romans 3:21\u201328, 5:1\u201311; 6:3\u20136' },
  { title: 'Nothing Can Separate Us from the Love of Christ', scripture: 'Romans 8:18\u201339' },
  { title: 'Paul Compares Our Bodies to the Temple', scripture: '1 Corinthians 6:16\u201320' },
  { title: 'Paul Compares the Church to the Body of Christ', scripture: '1 Corinthians 12\u201313' },
  { title: 'In Christ All Shall Be Made Alive', scripture: '1 Corinthians 15' },
  { title: 'Jesus Can Make Weak Things Strong', scripture: '2 Corinthians 12:7\u201310' },
  { title: 'In the Unity of the Faith', scripture: 'Ephesians 2:19\u201320; 4:11\u201314' },
  { title: 'The Whole Armor of God', scripture: 'Ephesians 6:11\u201317' },
  { title: 'Children of Light', scripture: '1 and 2 Thessalonians' },
  { title: 'Letters to Timothy', scripture: '1 and 2 Timothy' },
  { title: 'Living by Faith in Jesus Christ', scripture: 'Hebrews 11\u201312' },
  { title: 'A Letter from James', scripture: 'James 1\u20133' },
  { title: 'Jesus Christ Will Come Again', scripture: 'Revelation' },
];

const PDF_URL = '/wp-content/uploads/2026/03/logo.pdf';

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-[#FADADD] py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <Link
            href="/activities"
            className="inline-flex items-center text-[#4D1C2C]/85 hover:text-[#D81B60] font-semibold transition-colors duration-200 mb-6"
          >
            <span className="mr-2">&larr;</span> Back to Activities
          </Link>
          <h1 className="text-4xl font-extrabold text-[#4D1C2C] mb-4">Bible Quizzes</h1>
          <div className="h-1 w-24 bg-[#FF99BE] rounded-full"></div>
        </div>

        {/* Single combined card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#C2185B] to-[#E91E8C] text-white grid grid-cols-2 divide-x divide-white/20">
            <div className="px-6 py-5">
              <h2 className="text-xl font-bold">OT List</h2>
              <p className="text-white/70 text-xs mt-0.5">Old Testament stories</p>
            </div>
            <div className="px-6 py-5">
              <h2 className="text-xl font-bold">NT List</h2>
              <p className="text-white/70 text-xs mt-0.5">New Testament stories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

            {/* OT List */}
            <div>
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-bold text-[#4D1C2C] uppercase tracking-wider">OT List</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {otStories.map((story, i) => (
                  <li key={i}>
                    <a
                      href={PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-5 py-3 hover:bg-[#FFF0F5] transition-colors group"
                    >
                      <span className="text-xs font-bold text-[#8b1e15] w-6 shrink-0 pt-0.5">{i + 1}</span>
                      <div>
                        <span className="block text-sm text-gray-800 font-semibold group-hover:text-[#8b1e15] transition-colors line-clamp-1">
                          {story.title}
                        </span>
                        <span className="block text-[11px] text-gray-400 font-normal mt-0.5 line-clamp-2">
                          {story.scripture}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* NT List */}
            <div>
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xs font-bold text-[#D81B60] uppercase tracking-wider">NT List</h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {ntStories.map((story, i) => (
                  <li key={i}>
                    <a
                      href={PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-5 py-3 hover:bg-[#fdf2f2] transition-colors group"
                    >
                      <span className="text-xs font-bold text-[#8b1e15] w-6 shrink-0 pt-0.5">{i + 1}</span>
                      <div>
                        <span className="block text-sm text-gray-800 font-semibold group-hover:text-[#8b1e15] transition-colors line-clamp-1">
                          {story.title}
                        </span>
                        <span className="block text-[11px] text-gray-400 font-normal mt-0.5 line-clamp-2">
                          {story.scripture}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


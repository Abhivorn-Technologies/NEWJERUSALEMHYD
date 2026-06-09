import Link from 'next/link';

export default function NewTestamentStoriesPage() {
  const storiesList = [
    { scripture: 'Luke 1:5–25, 57–80', title: 'John the Baptist Is Born' },
    { scripture: 'Matthew 1; Luke 1', title: 'Angels Visit Mary and Joseph' },
    { scripture: 'Luke 2; Matthew 2:1–15', title: 'The Savior Is Born' },
    { scripture: 'Luke 2:39–52', title: 'The Boy Jesus' },
    { scripture: 'Matthew 3', title: 'Jesus Is Baptized' },
    { scripture: 'John 1:43–51', title: 'Come and See' },
    { scripture: 'Matthew 4:1–10', title: 'Satan Tempts Jesus' },
    { scripture: 'John 4', title: 'Jesus, a Woman, and a Well' },
    { scripture: 'Luke 4:16–31', title: 'Jesus Testifies of His Mission' },
    { scripture: 'Matthew 10; Luke 5:1–11; 6:12–16', title: 'Jesus Chooses His Apostles' },
    { scripture: 'Matthew 5–7', title: 'Jesus Teaches the Sermon on the Mount' },
    { scripture: 'Mark 2:1–12', title: 'Jesus Heals a Man Who Could Not Walk' },
    { scripture: 'Matthew 8:23–27; Mark 4:36–41', title: 'Jesus Calms the Storm' },
    { scripture: 'Mark 5:21–43', title: 'Jesus Heals a Woman and Raises Jairus\u2019s Daughter' },
    { scripture: 'Luke 7:1–10', title: 'Jesus Heals a Centurion\u2019s Servant' },
    { scripture: 'Luke 7:36–50', title: 'Jesus Forgives a Woman' },
    { scripture: 'Matthew 12:1–12; Luke 13:10–17', title: 'Jesus Heals a Woman on the Sabbath' },
    { scripture: 'Matthew 13', title: 'Jesus Teaches about Soil, Seeds, Bread, and Pearls' },
    { scripture: 'John 5:1–17', title: 'Jesus at the Pool of Bethesda' },
    { scripture: 'Matthew 14:13–21; John 6', title: 'Jesus Feeds Thousands of People' },
    { scripture: 'Matthew 14:22–33', title: 'Walking on the Water' },
    { scripture: 'Matthew 16–17', title: 'Jesus Gives His Apostles Priesthood Keys' },
    { scripture: 'Mark 8:22–25', title: 'Jesus Heals a Blind Man' },
    { scripture: 'Matthew 18: 21–34', title: 'The Parable of the Servant Who Would Not Forgive' },
    { scripture: 'John 8:1–11', title: 'People Want to Punish a Woman Who Sinned' },
    { scripture: 'John 10:1–18', title: 'Jesus Is the Good Shepherd' },
    { scripture: 'Luke 10:25–37', title: 'The Parable of the Good Samaritan' },
    { scripture: 'Luke 10:38–42', title: 'Martha and Mary' },
    { scripture: 'Luke 15', title: 'A Lost Sheep, a Lost Coin, and a Lost Son' },
    { scripture: 'Luke 17:11–19', title: 'Jesus Heals Ten Men Who Had Leprosy' },
    { scripture: 'Matthew 20:1–16', title: 'The Parable of the Workers in the Vineyard' },
    { scripture: 'Mark 10:13–16', title: 'Jesus Blesses Little Children' },
    { scripture: 'Mark 10:17–31', title: 'Jesus and the Rich Young Man' },
    { scripture: 'John 11:1–46', title: 'Jesus Brings Lazarus Back to Life' },
    { scripture: 'Luke 19:1–10', title: 'Zacchaeus the Tax Collector' },
    { scripture: 'Matthew 21:1–16', title: 'Jesus Rides into Jerusalem' },
    { scripture: 'Mark 12:41–44', title: 'A Widow and Two Small Coins' },
    { scripture: 'Matthew 25:1–13', title: 'The Parable of the Ten Virgins' },
    { scripture: 'Matthew 25:14–30', title: 'The Parable of the Talents' },
    { scripture: 'Matthew 25:31–46', title: '\u201cYe Have Done It unto Me\u201d' },
    { scripture: 'Matthew 26; Luke 22; John 13–14', title: 'The Last Supper' },
    { scripture: 'Matthew 26:36–46; Luke 22:39–46', title: 'Jesus in Gethsemane' },
    { scripture: 'Mark 14–15; Luke 22–23; John 18–19', title: 'Jesus Is Arrested' },
    { scripture: 'Matthew 27; Luke 23; John 19', title: 'Jesus Gives His Life for Us' },
    { scripture: 'Luke 24:1–12, 36–49; John 20', title: 'He Is Risen' },
    { scripture: 'Luke 24:13–25', title: 'Jesus Comforts Two Disciples' },
    { scripture: 'John 21; Matthew 28:16–20; Mark 16:15–19', title: 'Jesus Asks the Apostles to Feed His Sheep' },
    { scripture: 'Acts 1–4', title: 'Jesus\u2019s Apostles Lead His Church' },
    { scripture: 'Acts 6–7', title: 'Stephen Testifies of Jesus Christ' },
    { scripture: 'Acts 8:5–24', title: 'Simon and the Power of God' },
    { scripture: 'Acts 9:1–31', title: 'Jesus Appears to Saul' },
    { scripture: 'Acts 9:36–42', title: 'Tabitha, a Woman \u201cFull of Good Works\u201d' },
    { scripture: 'Acts 10', title: 'Cornelius and His Friends Receive the Holy Ghost' },
    { scripture: 'Acts 12:1–17', title: 'An Angel Frees Peter from Prison' },
    { scripture: 'Acts 16:9–40', title: 'Paul and Silas' },
    { scripture: 'Acts 21–22; 26–28', title: 'Miracles during Paul\u2019s Journey to Rome' },
    { scripture: 'Romans 3:21–28, 5:1–11; 6:3–6', title: 'Relying on Jesus Christ for Salvation' },
    { scripture: 'Romans 8:18–39', title: 'Nothing Can Separate Us from the Love of Christ' },
    { scripture: '1 Corinthians 6:16–20', title: 'Paul Compares Our Bodies to the Temple' },
    { scripture: '1 Corinthians 12–13', title: 'Paul Compares the Church to the Body of Christ' },
    { scripture: '1 Corinthians 15', title: 'In Christ All Shall Be Made Alive' },
    { scripture: '2 Corinthians 12:7–10', title: 'Jesus Can Make Weak Things Strong' },
    { scripture: 'Ephesians 2:19–20; 4:11–14', title: 'In the Unity of the Faith' },
    { scripture: 'Ephesians 6:11–17', title: 'The Whole Armor of God' },
    { scripture: '1 and 2 Thessalonians', title: 'Children of Light' },
    { scripture: '1 and 2 Timothy', title: 'Letters to Timothy' },
    { scripture: 'Hebrews 11–12', title: 'Living by Faith in Jesus Christ' },
    { scripture: 'James 1–3', title: 'A Letter from James' },
    { scripture: 'Revelation', title: 'Jesus Christ Will Come Again' },
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
              <h1 className="text-2xl font-bold">New Testament Stories</h1>
              <p className="text-white/80 text-sm mt-1 max-w-md">
                Review the contents, scriptures, and chapters detailing stories from the New Testament.
              </p>
            </div>
            <img
              src="/images/stories/old-testament/image1.jpeg"
              alt="About the New Testament"
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
                {storiesList.map((story, index) => (
                  <tr key={index} className="hover:bg-pink-50/50 transition-colors">
                    <td className="px-2 py-3 sm:px-8 sm:py-4">
                      <img
                        src="/images/stories/old-testament/image2.jpeg"
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
                      <span className="block text-[10px] sm:text-xs text-gray-400 font-normal mt-0.5 line-clamp-2">
                        {story.scripture}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

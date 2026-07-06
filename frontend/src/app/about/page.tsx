import React from 'react';
import ScrollToHash from '@/components/ScrollToHash';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getAboutPage() {
  try {
    const res = await fetch(`${BASE_URL}/pages/about/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

const beliefs = [
  {
    id: 1,
    icon: "📖",
    title: "THE HOLY BIBLE",
    content: "We believe that the Holy Bible in its entirety is the written Word of God verbally inspired by the Holy Spirit and therefore it is infallible authoritative and the basis for all Christian faith, practice, correction and instruction in righteousness. We believe the Word of God is the truth without error. We believe that through the power of the Holy Spirit, God speaks to us in the scriptures today to accomplish His purpose of Salvation in Jesus Christ."
  },
  {
    id: 2,
    icon: "👑",
    title: "THE TRUE GOD",
    content: "We believe in the one and the only one living, loving, holy, righteous, infinite, eternal and true God; the Creator and the Sovereign ruler of heaven and earth worthy of worship in all honor and glory, manifested in the unity of the God-head as God the Father, God the Son, and the Holy Spirit accomplishing His purposes distinctly but harmoniously in the great work of Salvation."
  },
  {
    id: 3,
    icon: "✝️",
    title: "JESUS CHRIST",
    content: "We believe that Jesus Christ, the eternal Son of God in His incarnation united to His divine nature a true human nature, yet without sin and continues to be both God and man in two distinct natures but one person forever. He was conceived of the Holy Spirit, born of the virgin Mary, lived in perfect obedience to the Father's will, suffered and died on the cross vicariously for the atonement of our sin and victoriously rose from the dead bodily, on the third day for our justification. He ascended into heaven and enthroned at the right hand of the father, interceding for His people."
  },
  {
    id: 4,
    icon: "🕊️",
    title: "THE HOLY SPIRIT",
    content: "We believe that the Lord Holy Spirit is a divine person, equal to God the Father, God the Son and of the same nature. He is convicted of sin, judgment and righteousness. He confirms the truth of the Gospel in preaching and testimony. He is the agent of new birth and new creation. He enables believers to confess Jesus Christ as the Lord and Savior. He seals, guides, teaches, witnesses, sanctifies, comforts and strengthens the believers. He equips the believers with spiritual gifts and fruit of the Spirit for the edification of the Church."
  },
  {
    id: 5,
    icon: "💧",
    title: "THE BAPTISM",
    content: "We believe in the believer's baptism on public confession of faith in Jesus Christ followed by immersion in water in the name of the Father, of the Son and of the Holy Spirit to symbolize our solemn faith in the crucified, buried and risen Savior with its effects in our death to sin and resurrection to a new life."
  },
  {
    id: 6,
    icon: "🍞",
    title: "THE LORD'S SUPPER",
    content: "We believe that baptism is a prerequisite to the privileges of membership in a local church and to the Lord's Supper, in which the members of the church celebrate with thanksgiving; the new life as the people of the new covenant by the sacred use of bread and wine as the symbols of body and blood of Jesus to commemorate together the sacrificial love of Christ preceding always by solemn self-examination. Thus, pledging to proclaim the crucified Christ till he comes."
  }
];

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6" style={{ fontFamily: 'var(--font-poppins)' }}>
      <ScrollToHash />
      <div className="max-w-[90%] md:max-w-7xl lg:px-[85px] mx-auto space-y-12">
        <div id="mission-vision" className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">About Us</h1>
            <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full"></div>
          </div>
          <div
            className="about-content grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200/80 [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:font-normal [&_p]:text-base [&_p]:md:text-lg [&_p]:text-justify [&_div]:text-justify text-justify [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-extrabold [&_h2]:text-[#1f4251] [&_h2]:mb-5 [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-[#1f4251] [&_h3]:mb-4"
            dangerouslySetInnerHTML={{ __html: page?.content ?? '' }}
          />
        </div>

        {/* What We Believe Section */}
        <div id="what-we-believe" className="scroll-mt-24 pt-12 border-t border-gray-300/40">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#1f4251] mb-4">What We Believe</h2>
            <div className="h-1.5 w-16 bg-[#AB2423] mx-auto rounded-full"></div>
          </div>
          <div className="space-y-8 max-w-6xl mx-auto">
            {beliefs.map(belief => (
              <div 
                key={belief.id} 
                className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200/80 border-l-4 border-l-[#AB2423] transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-[1.01] hover:border-[#AB2423]/30"
              >
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f4251] mb-5 flex items-center gap-4">
                  <span className="text-3xl md:text-4xl">{belief.icon}</span> <span className="text-[#B25C31] tracking-wide">{belief.title}</span>
                </h3>
                <p className="text-gray-600 leading-relaxed font-normal text-base md:text-lg text-justify">
                  {belief.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

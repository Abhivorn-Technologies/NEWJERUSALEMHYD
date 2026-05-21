import { missionaryData } from './data';
import Link from 'next/link';

export default function MissionaryStoryPage() {
  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="text-center mb-16">
          <Link href="/bible-resources" className="text-sm text-[#8b1e15] font-semibold hover:underline mb-4 inline-block">
            &larr; Back to Bible Resources
          </Link>
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Missionary Stories</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            Read inspiring stories of missionaries and their faithful journey in spreading the Gospel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {missionaryData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              <div className="relative h-64 bg-gray-100 p-4 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt="Missionary Story" 
                  className="max-h-full max-w-full object-contain drop-shadow-md rounded"
                />
              </div>
              {item.link && (
                <div className="p-6 text-center border-t border-gray-50 mt-auto">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-[#1f4251] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#16303b] transition-colors"
                  >
                    Download Document
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

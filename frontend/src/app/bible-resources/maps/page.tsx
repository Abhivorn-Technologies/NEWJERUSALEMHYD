import { bibleMapsData } from './data';

export default function BibleMapsPage() {
  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1f4251] mb-4">BIBLE MAPS</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-14">
          {bibleMapsData.map((section, si) => (
            <div key={si}>
              <h2 className="text-2xl font-bold text-[#1f4251] mb-6 pb-3 border-b border-gray-300">
                {section.title}
              </h2>
              <div className="space-y-0">
                {section.items.map((item, ii) => (
                  <div key={ii} className="py-5 border-b border-gray-200 last:border-b-0 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="font-semibold text-[#1f4251] sm:w-1/2 md:w-2/5 text-base">
                      {item.title}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.links.map((link, li) => {
                        const isDownloadAll = link.text.includes('Download All');
                        return (
                          <a
                            key={li}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-bold py-1.5 px-3.5 rounded transition-colors ${
                              isDownloadAll
                                ? 'bg-[#8b1e15] text-white hover:bg-red-800'
                                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {link.text.replace(/\u200b/g, '')}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

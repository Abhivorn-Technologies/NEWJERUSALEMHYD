import React from 'react';

const ScrollDivider = () => (
  <div className="flex justify-center py-6 select-none pointer-events-none">
    <svg width="220" height="24" viewBox="0 0 220 24" fill="none" className="text-[#FFEBB3] opacity-60">
      {/* Decorative center scroll curls */}
      <path d="M110 12 C115 8, 118 4, 120 4 C123 4, 125 8, 122 12 C119 16, 115 16, 110 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M110 12 C105 8, 102 4, 100 4 C97 4, 95 8, 98 12 C101 16, 105 16, 110 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="110" cy="12" r="2.5" fill="currentColor" />
      {/* Scroll flourishes extending left and right */}
      <path d="M90 12 C75 12, 65 8, 50 12 C35 16, 20 12, 10 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M130 12 C145 12, 155 8, 170 12 C185 16, 195 12, 210 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Accents dots */}
      <circle cx="70" cy="12" r="1.5" fill="currentColor" />
      <circle cx="150" cy="12" r="1.5" fill="currentColor" />
    </svg>
  </div>
);


export default function MinistryDetails() {
  return (
    <div className="w-full select-none">
      

      <section className="bg-[#003138] pt-12 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          

          {/* Bible Verse Section */}
          <div className="text-center space-y-1.5 max-w-4xl mx-auto">
            <p 
              className="text-[#FFEBB3] italic font-normal text-sm sm:text-base md:text-lg lg:text-[22px] tracking-wide"
              style={{ fontFamily: 'var(--font-ramabhadra)' }}
            >
              1 కొరింథి 4 : 20 , రోమా 14 : 17
            </p>
            <div 
              className="space-y-0.5 text-white/95 text-[13px] sm:text-base md:text-[17px] lg:text-[19px] leading-relaxed font-[500]"
              style={{ fontFamily: 'var(--font-mandali)' }}
            >
              <p>“దేవుని రాజ్యము మాటలతో కాదు శక్తి తోనే యున్నది.</p>
              <p>దేవుని రాజ్యము భోజనమును పానమును కాదు గాని, నీతియు సమాధానమును, పరిశుద్ధాత్మయందలి ఆనందమునై యున్నది.”</p>
            </div>
          </div>

          <ScrollDivider />

          {/* Ministry History Paragraphs */}
          <div 
            className="text-[13px] sm:text-base md:text-lg lg:text-[21px] leading-relaxed font-[400] text-gray-200 text-justify"
            style={{ fontFamily: 'var(--font-mandali)' }}
          >
            <p>
              నిత్యజీవప్రధాతయైన దేవుని వాక్యం యొక్క శక్తి నిరంతరము గొప్పది మరియు ఘనమైనది. ఆ ఘనమైన దేవుని వాక్యమును ప్రబలముగా నమ్మి, యేసుక్రీస్తు నందు ఒకరినొకరు అపోస్తులుల బోధ, ప్రార్థన, ప్రేమ, విశ్వాసం, విధేయత మరియు కరుణతో కొనసాగించుచున్నాము.
              {" "}ఈ పరిచర్యకు ప్రజలు యేసుక్రీస్తు ప్రభులవారి సువార్త యొక్క శుభవార్త వినడానికి స్వచ్ఛందంగా వస్తారు, వారి పాపాలను ఒప్పుకొని మరియు నీతియు సమాధానమును, పరిశుద్ధాత్మయందలి ఆనందమును అనుభవించి కొత్త జీవితాన్ని ప్రారంభిస్తారు. ఈ పరిచర్య చాలా కొద్ది మంది ఆత్మలతో ప్రారంభించబడి, దేవుని దయతో మరియు ఆయన మీద ప్రగాఢమైన విశ్వాసముతో నడపబడుతున్న ఈ పరిచర్యకు ప్రతి ఆదివారం ప్రజలు సర్వశక్తిమంతుడైన యేసుక్రీస్తు ప్రభులవారిని ఆరాధించడానికి మందిరమునకు వేగిరపడుచున్నారు.
              {" "}ఈ పరిచర్యకు (FCRA ఫారిన్ కంట్రిబ్యూషన్ రెగ్యులేషన్ యాక్ట్ లేదు) విదేశీ నిధులు లేవు. ఇది పూర్తిగా 100% భారతీయ మరియు స్వదేశీ పరిచర్య.
            </p>
          </div>

          <ScrollDivider />

          {/* Invitation Rounded White Card */}
          <div className="pt-2">
            <div 
              className="bg-[#F9F9F9] text-gray-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-gray-200/50 text-center space-y-5 max-w-7xl mx-auto"
              style={{ fontFamily: 'var(--font-mandali)' }}
            >
              <p className="text-[13px] sm:text-base md:text-lg lg:text-[21px] leading-relaxed font-[400] text-gray-700 text-justify">
                నిశ్చయముగా ఈ పరిచర్య మీకు నిశ్చలత్వమును, నిర్భయమును, నిగూఢమైన దైవిక క్రమమును, నిరంతరమైన ధైర్యమును, నిలకడైన ఆత్మీయతను పంచగలదని ప్రగాఢమైన విశ్వాసముతో..... మరియు ధనదాహముతో కాక నిస్వార్థమైన ఆత్మలదాహముతో కొనసాగే ఈ నిబంధన పరిచర్యలో మీరు నిజమైన పాలిభాగస్థులు కాగలరని నిండు మనస్సుతో ఆహ్వానిస్తున్నాము.
              </p>
              <p 
                className="text-gray-900 font-normal text-[14px] sm:text-lg md:text-xl lg:text-[22px] tracking-wide"
                style={{ fontFamily: 'var(--font-ramabhadra)' }}
              >
                మీకొరకు ప్రార్థించే మీ సంఘం, మీ దైవజనులు ఎల్లప్పుడు మీకు తోడుగా ఉన్నారని మరచిపోవద్దు.
              </p>
            </div>
          </div>

          {/* Section divider after Nishchayamuga card - no padding/margin */}
          <div className="flex justify-center py-0 mb-0 select-none pointer-events-none">
            <svg width="220" height="24" viewBox="0 0 220 24" fill="none" className="text-[#FFEBB3] opacity-60">
              <path d="M110 12 C115 8, 118 4, 120 4 C123 4, 125 8, 122 12 C119 16, 115 16, 110 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M110 12 C105 8, 102 4, 100 4 C97 4, 95 8, 98 12 C101 16, 105 16, 110 12 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <circle cx="110" cy="12" r="2.5" fill="currentColor" />
              <path d="M90 12 C75 12, 65 8, 50 12 C35 16, 20 12, 10 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M130 12 C145 12, 155 8, 170 12 C185 16, 195 12, 210 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="70" cy="12" r="1.5" fill="currentColor" />
              <circle cx="150" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}

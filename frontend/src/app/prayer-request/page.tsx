export default function PrayerRequestPage() {
  return (
    <div className="min-h-screen bg-[#e8f4f8] py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center mb-12 reveal">
          <h1 className="text-4xl font-extrabold text-[#1f4251] mb-4">Prayer Request</h1>
          <div className="h-1 w-24 bg-[#8b1e15] mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-700 font-medium max-w-2xl mx-auto">
            We believe in the power of prayer. Please fill out the form below and our prayer team will intercede on your behalf.
          </p>
        </div>

        <div className="flex justify-center w-full reveal-scale reveal-delay-100">
          {/* We are embedding the exact Google Form from the original website */}
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSc0mNx0e_dMFTu8guF-G3olGg6w43XOoHmOtHcdFkBwZxxY0g/viewform?embedded=true" 
            width="100%" 
            height="1000" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0}
            className="w-full max-w-[640px]"
          >
            Loading…
          </iframe>
        </div>

      </div>
    </div>
  );
}

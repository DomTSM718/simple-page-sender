
import React from 'react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-0 bg-gray-50 min-h-screen flex">
      {/* Left half - Image */}
      <div className="w-1/2">
        <div 
          className="h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/a08a428c-2709-42c5-9ebb-9dbef4f9a02b.png')`
          }}
        />
      </div>
      
      {/* Right half - Text content with black background */}
      <div className="w-1/2 bg-black flex items-center justify-center">
        <div className="px-12 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-wide">
            WHY CHOOSE US
          </h2>
          <p className="text-2xl text-white mb-8 leading-relaxed">
            Innovative Technology, Transformative Results
          </p>
          <p className="text-2xl text-white leading-relaxed">
            We empower businesses to unlock their full potential by seamlessly integrating innovative technology solutions that solve real-world problems and drive sustainable growth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;


import React from 'react';

const ApproachSection = () => {
  return (
    <section className="py-0 bg-gray-50 min-h-screen flex">
      {/* Left half - Text content with black background */}
      <div className="w-1/2 bg-black flex items-center justify-center">
        <div className="px-12 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-wide">
            OUR APPROACH
          </h2>
          <p className="text-2xl text-white mb-8 leading-relaxed">
            Let us help strengthen your innovation muscle with a fresh approach to solution development.
          </p>
          <p className="text-2xl text-white leading-relaxed">
            We work with your team to develop solutions that enhance productivity and increase efficiency while helping navigate digital innovation.
          </p>
        </div>
      </div>
      
      {/* Right half - Image */}
      <div className="w-1/2">
        <div 
          className="h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/2d6d2b55-3970-4e73-ab2d-5bf62e569378.png')`
          }}
        />
      </div>
    </section>
  );
};

export default ApproachSection;

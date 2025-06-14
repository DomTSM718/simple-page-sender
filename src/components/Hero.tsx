
import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/36ee9b71-d0f4-404b-8850-08bd3d9624e4.png')`
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            We are dedicated to enabling business
            <span className="text-blue-400"> growth by connecting the dots between </span>
            challenges and solutions.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;

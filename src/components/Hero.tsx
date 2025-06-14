
import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white">
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            We are dedicated to enabling business
            <span className="text-blue-600"> growth by connecting the dots between </span>
            challenges and solutions.
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;

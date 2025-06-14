
import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=2000&q=80')`
        }}
      />
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


import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

const ServiceCard = ({ title, description, image, reverse = false }: ServiceCardProps) => {
  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 py-20 border-b border-gray-200 last:border-b-0`}>
      <div className="flex-1">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-wide">
          {title}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
      <div className="flex-1">
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;


import React from 'react';
import ServiceCard from '@/components/ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      title: "INNOVATION",
      description: "We help businesses come up with fresh, practical ideas that drive growth. Whether it's launching a new product, improving an existing service, or trying something different to stay ahead of the competition, we're here to support you every step of the way. We'll work closely with your team to brainstorm, plan, and bring new ideas to life that fit your business goals and budget, so you can keep growing in today's fast-paced market.",
      image: "/lovable-uploads/034bf7a4-99db-427c-9e19-b4838d7c6f67.png",
      reverse: false
    },
    {
      title: "BUSINESS OPTIMIZATION AND AUTOMATION",
      description: "Efficiency is the cornerstone of any successful business. The Solution Mob focuses on streamlining operations and automating processes to reduce costs and improve productivity. We analyse existing workflows and systems, identifying areas for optimization and introducing tailored automation tools to free up your time and resources. By refining your operational structure, we help you achieve more with less effort.",
      image: "/lovable-uploads/a08a428c-2709-42c5-9ebb-9dbef4f9a02b.png",
      reverse: true
    },
    {
      title: "CUSTOMER EXPERIENCE",
      description: "Delivering exceptional customer experiences is key to building loyalty and long-term success. The Solution Mob helps businesses understand their customers better, from mapping out the customer journey to improving every touchpoint. We design and implement strategies that enhance customer interactions, ensuring that your business not only meets but exceeds expectations. From personalised communication to seamless support, we help you build stronger, lasting relationships with your customers.",
      image: "/lovable-uploads/9c7d25fb-47e7-49a5-a22e-3052bcd5bb23.png",
      reverse: false
    },
    {
      title: "DATA ANALYTICS",
      description: "In a data-driven world, making informed decisions is critical to success. The Solution Mob provides data analytics services that empower businesses with actionable insights. We help you harness the power of data by collecting, analysing, and interpreting it to uncover trends, optimise performance, and identify opportunities for growth. Our data-driven approach enables you to make smarter decisions, backed by accurate and meaningful information.",
      image: "/lovable-uploads/396a6e25-27b3-41c1-88ca-a6f01c152fec.png",
      reverse: true
    },
    {
      title: "ENTREPRENEUR-IN-RESIDENCE",
      description: "A unique offering designed to inject entrepreneurial thinking and leadership into businesses on-demand. This service brings seasoned entrepreneurs into your organisation acting as catalysts for growth, and helping you solve complex business challenges or explore new opportunities for a specified period. Enables you to benefit from the expertise, strategic vision, and innovation-driven mindset without the long-term commitment of a full-time executive hire.",
      image: "/lovable-uploads/eebb2a80-28e9-4968-87a3-0a5e8ae4c324.png",
      reverse: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-wide">
            OUR SERVICES
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Enabling businesses to solve complex problems, build new revenue streams, and deliver exceptional customer experiences.
          </p>
        </div>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            image={service.image}
            reverse={service.reverse}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;

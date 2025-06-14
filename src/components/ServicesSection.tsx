
import React from 'react';
import ServiceCard from '@/components/ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      title: "INNOVATION",
      description: "We help businesses come up with fresh, practical ideas that drive growth. Whether it's launching a new product, improving an existing service, or trying something different to stay ahead of the competition, we're here to support you every step of the way. We'll work closely with your team to brainstorm, plan, and bring new ideas to life that fit your business goals and budget, so you can keep growing in today's fast-paced market.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
      reverse: false
    },
    {
      title: "BUSINESS OPTIMIZATION AND AUTOMATION",
      description: "Efficiency is the cornerstone of any successful business. The Solution Mob focuses on streamlining operations and automating processes to reduce costs and improve productivity. We analyse existing workflows and systems, identifying areas for optimization and introducing tailored automation tools to free up your time and resources. By refining your operational structure, we help you achieve more with less effort.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
      reverse: true
    },
    {
      title: "CUSTOMER EXPERIENCE",
      description: "Delivering exceptional customer experiences is key to building loyalty and long-term success. The Solution Mob helps businesses understand their customers better, from mapping out the customer journey to improving every touchpoint. We design and implement strategies that enhance customer interactions, ensuring that your business not only meets but exceeds expectations. From personalised communication to seamless support, we help you build stronger, lasting relationships with your customers.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80",
      reverse: false
    },
    {
      title: "DATA ANALYTICS",
      description: "In a data-driven world, making informed decisions is critical to success. The Solution Mob provides data analytics services that empower businesses with actionable insights. We help you harness the power of data by collecting, analysing, and interpreting it to uncover trends, optimise performance, and identify opportunities for growth. Our data-driven approach enables you to make smarter decisions, backed by accurate and meaningful information.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      reverse: true
    },
    {
      title: "ENTREPRENEUR-IN-RESIDENCE",
      description: "A unique offering designed to inject entrepreneurial thinking and leadership into businesses on-demand. This service brings seasoned entrepreneurs into your organisation acting as catalysts for growth, and helping you solve complex business challenges or explore new opportunities for a specified period. Enables you to benefit from the expertise, strategic vision, and innovation-driven mindset without the long-term commitment of a full-time executive hire.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      reverse: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-wide">
            OUR SERVICES
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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

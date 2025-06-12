
import React from 'react';
import ServiceCard from '@/components/ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      title: "INNOVATION",
      description: "We believe innovation is the catalyst for creating new market opportunities. Innovation should not just generate new business models, but also create sustainable competitive advantages that transform industries.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
      reverse: false
    },
    {
      title: "BUSINESS OPTIMISATION",
      description: "Business optimization requires a comprehensive understanding of operational efficiency, strategic alignment, and performance metrics. We focus on identifying bottlenecks and implementing solutions that drive sustainable growth.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
      reverse: true
    },
    {
      title: "DATA-DRIVEN DECISIONS",
      description: "In today's digital landscape, data is the foundation of successful business strategies. We help organizations harness the power of analytics to make informed decisions that drive competitive advantage.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      reverse: false
    },
    {
      title: "CUSTOMER EXPERIENCE",
      description: "Exceptional customer experience is the cornerstone of business success. We design and implement strategies that create meaningful connections between brands and customers, driving loyalty and growth.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80",
      reverse: true
    },
    {
      title: "ENTREPRENEUR IN RESIDENCE",
      description: "Our entrepreneur in residence program provides startups and growing businesses with strategic guidance, mentorship, and access to resources that accelerate growth and innovation.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      reverse: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-black">
      <div className="container mx-auto px-6">
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

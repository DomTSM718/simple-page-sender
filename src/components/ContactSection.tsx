
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    try {
      // In a real application, you would send this to your backend
      console.log('Form submitted:', formData);
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl text-gray-900 mb-6">
            LET'S TALK
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Uncover your opportunity. It starts with a conversation.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
              />
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>
            <Input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
            />
            <Textarea
              name="message"
              placeholder="Tell us about your project..."
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 resize-none"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

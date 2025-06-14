
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRateLimit } from '@/hooks/useRateLimit';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Clock } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Rate limiting: 3 requests per 5 minutes
  const { checkRateLimit, isLimited, remainingTime, getRemainingRequests } = useRateLimit({
    maxRequests: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
    key: 'contactForm',
  });

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isLimited && remainingTime > 0) {
      setCountdown(remainingTime);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLimited, remainingTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check client-side rate limit
    if (!checkRateLimit()) {
      toast({
        title: "Rate limit exceeded",
        description: `Please wait ${countdown} seconds before submitting another message.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Insert the form submission into the database
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            message: formData.message
          }
        ]);

      if (error) {
        console.error('Error saving contact form:', error);
        throw error;
      }

      // Call edge function to send email notification
      try {
        const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
          body: formData
        });
        
        if (emailError) {
          console.error('Error sending email:', emailError);
          
          // Check if it's a rate limit error
          if (emailError.message?.includes('Too many requests')) {
            toast({
              title: "Rate limit exceeded",
              description: "You've sent too many messages recently. Please try again later.",
              variant: "destructive",
            });
            return;
          }
          // Don't throw here - form was saved successfully
        }
      } catch (emailErr: any) {
        console.error('Email service error:', emailErr);
        
        // Check if it's a rate limit error
        if (emailErr.message?.includes('429') || emailErr.message?.includes('Too many requests')) {
          toast({
            title: "Rate limit exceeded",
            description: "You've sent too many messages recently. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        // Don't throw here - form was saved successfully
      }
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
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

  const remainingRequests = getRemainingRequests();
  const showRateLimitWarning = remainingRequests <= 1;

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
          {/* Rate limit warning */}
          {showRateLimitWarning && !isLimited && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Rate limit notice</p>
                <p>You have {remainingRequests} message{remainingRequests !== 1 ? 's' : ''} remaining in the next 5 minutes.</p>
              </div>
            </div>
          )}
          
          {/* Rate limit blocked */}
          {isLimited && countdown > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Rate limit exceeded</p>
                <p>Please wait {countdown} seconds before submitting another message.</p>
              </div>
            </div>
          )}
          
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
              disabled={isLoading || (isLimited && countdown > 0)}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 
               isLimited && countdown > 0 ? `Wait ${countdown}s` : 
               'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

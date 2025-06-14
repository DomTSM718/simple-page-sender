
-- Create a table to store contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded'))
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert contact submissions
-- This is appropriate for a contact form that should accept submissions from anyone
CREATE POLICY "Anyone can submit contact forms" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy that only allows authenticated admin users to view submissions
-- You'll need to set up user roles later to make this work fully
CREATE POLICY "Only authenticated users can view submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create an index for better performance when querying by creation date
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Create an index for filtering by status
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);

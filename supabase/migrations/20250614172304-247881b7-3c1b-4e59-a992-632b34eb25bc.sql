
-- Add a policy that allows authenticated users to UPDATE contact submissions
-- This is needed for the admin dashboard to mark submissions as read or responded
CREATE POLICY "Authenticated users can update submission status" 
  ON public.contact_submissions 
  FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Also add a policy to allow authenticated users to DELETE contact submissions if needed
CREATE POLICY "Authenticated users can delete submissions" 
  ON public.contact_submissions 
  FOR DELETE 
  TO authenticated 
  USING (true);


import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string | null;
  created_at: string;
}

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Error",
          description: "Failed to load contact submissions.",
          variant: "destructive",
        });
        return;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'read' | 'responded') => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status.",
          variant: "destructive",
        });
        return;
      }

      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status } : sub)
      );

      toast({
        title: "Updated",
        description: `Status updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading contact submissions...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>
      
      {submissions.length === 0 ? (
        <p className="text-gray-500">No contact submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                    <p className="text-sm text-gray-600">{submission.email}</p>
                    {submission.company && (
                      <p className="text-sm text-gray-500">{submission.company}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={submission.status === 'unread' ? 'destructive' : 
                              submission.status === 'read' ? 'default' : 'secondary'}
                    >
                      {submission.status || 'unread'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap">{submission.message}</p>
                <div className="flex gap-2">
                  {submission.status === 'unread' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateStatus(submission.id, 'read')}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {submission.status !== 'responded' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateStatus(submission.id, 'responded')}
                    >
                      Mark as Responded
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;

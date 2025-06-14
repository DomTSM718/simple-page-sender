
import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import AdminGuard from '@/components/AdminGuard';
import ContactSubmissions from '@/components/ContactSubmissions';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthGuard>
      {(user) => (
        <AdminGuard user={user}>
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Welcome, {user.email}</p>
                </div>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            </div>
            <ContactSubmissions />
          </div>
        </AdminGuard>
      )}
    </AuthGuard>
  );
};

export default AdminDashboard;

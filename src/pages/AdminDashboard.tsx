
import React from 'react';
import EnhancedAuthGuard from '@/components/EnhancedAuthGuard';
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
    <EnhancedAuthGuard
      sessionConfig={{
        timeout: 20 * 60 * 1000, // 20 minutes for admin (shorter than regular users)
        warningTime: 3 * 60 * 1000, // 3 minutes warning
        maxDuration: 4 * 60 * 60 * 1000, // 4 hours max for admin sessions
      }}
    >
      {(user) => (
        <AdminGuard user={user}>
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Welcome, {user.email}</p>
                  <p className="text-xs text-gray-400">Enhanced security session active</p>
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
    </EnhancedAuthGuard>
  );
};

export default AdminDashboard;

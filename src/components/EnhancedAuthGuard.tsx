
import React, { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSessionSecurity } from '@/hooks/useSessionSecurity';
import { useToast } from '@/hooks/use-toast';
import AuthForm from './AuthForm';
import SessionTimeoutWarning from './SessionTimeoutWarning';
import { generateSessionFingerprint, validateSessionFingerprint, SessionFingerprint } from '@/utils/sessionSecurity';

interface EnhancedAuthGuardProps {
  children: React.ReactNode | ((user: User) => React.ReactNode);
  requireAuth?: boolean;
  sessionConfig?: {
    timeout?: number;
    warningTime?: number;
    maxDuration?: number;
  };
}

const EnhancedAuthGuard = ({ 
  children, 
  requireAuth = true,
  sessionConfig = {}
}: EnhancedAuthGuardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionFingerprint, setSessionFingerprint] = useState<SessionFingerprint | null>(null);
  const { toast } = useToast();

  const {
    showTimeoutWarning,
    extendSession,
    getTimeRemaining,
    updateActivity,
  } = useSessionSecurity(user, session, {
    sessionTimeout: sessionConfig.timeout,
    warningTime: sessionConfig.warningTime,
    maxSessionDuration: sessionConfig.maxDuration,
  });

  useEffect(() => {
    let mounted = true;

    // Generate initial fingerprint
    const fingerprint = generateSessionFingerprint();
    setSessionFingerprint(fingerprint);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session) {
          // Validate session fingerprint on sign in
          const currentFingerprint = generateSessionFingerprint();
          const storedFingerprint = localStorage.getItem('session_fingerprint');
          
          if (storedFingerprint) {
            const stored = JSON.parse(storedFingerprint);
            if (!validateSessionFingerprint(stored, currentFingerprint)) {
              console.warn('Session fingerprint mismatch detected');
              toast({
                title: "Security Alert",
                description: "Session security validation failed. Please verify your identity.",
                variant: "destructive",
              });
              
              // Force re-authentication for security
              await supabase.auth.signOut();
              return;
            }
          }
          
          localStorage.setItem('session_fingerprint', JSON.stringify(currentFingerprint));
          setSessionFingerprint(currentFingerprint);
        }

        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('session_fingerprint');
          setSessionFingerprint(null);
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      if (session) {
        // Validate existing session fingerprint
        const currentFingerprint = generateSessionFingerprint();
        const storedFingerprint = localStorage.getItem('session_fingerprint');
        
        if (storedFingerprint) {
          const stored = JSON.parse(storedFingerprint);
          if (!validateSessionFingerprint(stored, currentFingerprint)) {
            console.warn('Existing session fingerprint mismatch');
            supabase.auth.signOut();
            setLoading(false);
            return;
          }
        } else {
          localStorage.setItem('session_fingerprint', JSON.stringify(currentFingerprint));
        }
        
        setSessionFingerprint(currentFingerprint);
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleAuthSuccess = () => {
    updateActivity();
  };

  const handleExtendSession = async () => {
    await extendSession();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out for security reasons.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return (
    <>
      {/* Session timeout warning modal */}
      <SessionTimeoutWarning
        show={showTimeoutWarning}
        timeRemaining={getTimeRemaining()}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
      />

      {/* Main content */}
      {typeof children === 'function' && user ? children(user) : children}
    </>
  );
};

export default EnhancedAuthGuard;

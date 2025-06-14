
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionSecurityState {
  isValid: boolean;
  lastActivity: number;
  sessionStartTime: number;
  ipAddress: string | null;
  userAgent: string;
  isSecure: boolean;
}

interface UseSessionSecurityOptions {
  sessionTimeout: number; // in milliseconds
  warningTime: number; // warning before timeout in milliseconds
  maxSessionDuration: number; // maximum session duration in milliseconds
  enableIpValidation: boolean;
  enableUserAgentValidation: boolean;
}

const DEFAULT_OPTIONS: UseSessionSecurityOptions = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  warningTime: 5 * 60 * 1000, // 5 minutes warning
  maxSessionDuration: 8 * 60 * 60 * 1000, // 8 hours max
  enableIpValidation: true,
  enableUserAgentValidation: true,
};

export const useSessionSecurity = (
  user: User | null,
  session: Session | null,
  options: Partial<UseSessionSecurityOptions> = {}
) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const { toast } = useToast();
  
  const [securityState, setSecurityState] = useState<SessionSecurityState>({
    isValid: true,
    lastActivity: Date.now(),
    sessionStartTime: Date.now(),
    ipAddress: null,
    userAgent: navigator.userAgent,
    isSecure: window.location.protocol === 'https:',
  });

  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // Update last activity
  const updateActivity = useCallback(() => {
    setSecurityState(prev => ({
      ...prev,
      lastActivity: Date.now(),
    }));
    setShowTimeoutWarning(false);
  }, []);

  // Validate session security
  const validateSession = useCallback(async () => {
    if (!session || !user) return true;

    const now = Date.now();
    const timeSinceActivity = now - securityState.lastActivity;
    const totalSessionTime = now - securityState.sessionStartTime;

    // Check session timeout
    if (timeSinceActivity > config.sessionTimeout) {
      toast({
        title: "Session Expired",
        description: "Your session has expired due to inactivity. Please log in again.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      return false;
    }

    // Check maximum session duration
    if (totalSessionTime > config.maxSessionDuration) {
      toast({
        title: "Session Expired",
        description: "Your session has expired for security reasons. Please log in again.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      return false;
    }

    // Show warning before timeout
    if (timeSinceActivity > config.sessionTimeout - config.warningTime && !showTimeoutWarning) {
      setShowTimeoutWarning(true);
      toast({
        title: "Session Warning",
        description: `Your session will expire in ${Math.ceil(config.warningTime / 60000)} minutes due to inactivity.`,
      });
    }

    // Validate User Agent (basic check)
    if (config.enableUserAgentValidation && navigator.userAgent !== securityState.userAgent) {
      console.warn('User agent mismatch detected');
      toast({
        title: "Security Alert",
        description: "Browser environment change detected. Please verify your identity.",
        variant: "destructive",
      });
    }

    return true;
  }, [session, user, securityState, config, showTimeoutWarning, toast]);

  // Monitor session security
  useEffect(() => {
    if (!session || !user) return;

    const interval = setInterval(validateSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session, user, validateSession]);

  // Activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Initialize session security state
  useEffect(() => {
    if (session && user) {
      setSecurityState(prev => ({
        ...prev,
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
      }));
    }
  }, [session, user]);

  const extendSession = useCallback(async () => {
    if (!session) return;
    
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      updateActivity();
      setShowTimeoutWarning(false);
      
      toast({
        title: "Session Extended",
        description: "Your session has been successfully extended.",
      });
    } catch (error) {
      console.error('Failed to extend session:', error);
      toast({
        title: "Error",
        description: "Failed to extend session. Please log in again.",
        variant: "destructive",
      });
    }
  }, [session, updateActivity, toast]);

  const getTimeRemaining = useCallback(() => {
    const timeSinceActivity = Date.now() - securityState.lastActivity;
    return Math.max(0, config.sessionTimeout - timeSinceActivity);
  }, [securityState.lastActivity, config.sessionTimeout]);

  return {
    securityState,
    showTimeoutWarning,
    extendSession,
    updateActivity,
    validateSession,
    getTimeRemaining,
    isSessionValid: securityState.isValid,
  };
};

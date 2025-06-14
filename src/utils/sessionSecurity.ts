
import { Session } from '@supabase/supabase-js';

export interface SessionFingerprint {
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
}

export const generateSessionFingerprint = (): SessionFingerprint => {
  return {
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
  };
};

export const validateSessionFingerprint = (
  stored: SessionFingerprint,
  current: SessionFingerprint
): boolean => {
  // Allow some flexibility for dynamic properties
  const criticalMatch = 
    stored.userAgent === current.userAgent &&
    stored.platform === current.platform &&
    stored.timezone === current.timezone;
    
  return criticalMatch;
};

export const getSessionRisk = (session: Session | null): 'low' | 'medium' | 'high' => {
  if (!session) return 'high';
  
  const now = Date.now();
  // Use expires_at to determine session age since that's what's available
  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).getTime() : now;
  const sessionAge = Math.abs(expiresAt - now);
  
  // High risk: Session expires very soon or is expired
  if (sessionAge < 30 * 60 * 1000) { // Less than 30 minutes remaining
    return 'high';
  }
  
  // Medium risk: Session expires in less than 2 hours
  if (sessionAge < 2 * 60 * 60 * 1000) {
    return 'medium';
  }
  
  return 'low';
};

export const sanitizeSession = (session: Session): Partial<Session> => {
  // Remove sensitive tokens from session object for logging
  return {
    user: session.user,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
  };
};

export const isSessionExpired = (session: Session | null): boolean => {
  if (!session || !session.expires_at) return true;
  
  const expiresAt = new Date(session.expires_at * 1000);
  return Date.now() >= expiresAt.getTime();
};

export const getSessionTimeRemaining = (session: Session | null): number => {
  if (!session || !session.expires_at) return 0;
  
  const expiresAt = new Date(session.expires_at * 1000);
  return Math.max(0, expiresAt.getTime() - Date.now());
};

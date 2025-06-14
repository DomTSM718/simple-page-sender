
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
  const sessionAge = now - new Date(session.created_at).getTime();
  const refreshAge = session.refreshed_at ? 
    now - new Date(session.refreshed_at).getTime() : sessionAge;
  
  // High risk: Very old session or very old refresh
  if (sessionAge > 8 * 60 * 60 * 1000 || refreshAge > 2 * 60 * 60 * 1000) {
    return 'high';
  }
  
  // Medium risk: Moderately old session
  if (sessionAge > 4 * 60 * 60 * 1000 || refreshAge > 1 * 60 * 60 * 1000) {
    return 'medium';
  }
  
  return 'low';
};

export const sanitizeSession = (session: Session): Partial<Session> => {
  // Remove sensitive tokens from session object for logging
  return {
    user: session.user,
    created_at: session.created_at,
    updated_at: session.updated_at,
    expires_at: session.expires_at,
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

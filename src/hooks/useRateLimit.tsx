
import { useState, useCallback } from 'react';

interface RateLimitState {
  isLimited: boolean;
  remainingTime: number;
  lastRequest: number;
}

interface UseRateLimitOptions {
  maxRequests: number;
  windowMs: number;
  key?: string;
}

export const useRateLimit = ({ maxRequests, windowMs, key = 'default' }: UseRateLimitOptions) => {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isLimited: false,
    remainingTime: 0,
    lastRequest: 0,
  });

  const checkRateLimit = useCallback(() => {
    const storageKey = `rateLimit_${key}`;
    const now = Date.now();
    
    try {
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : { requests: [], windowStart: now };
      
      // Clean old requests outside the window
      const validRequests = data.requests.filter((timestamp: number) => 
        now - timestamp < windowMs
      );
      
      if (validRequests.length >= maxRequests) {
        const oldestRequest = Math.min(...validRequests);
        const remainingTime = windowMs - (now - oldestRequest);
        
        setRateLimitState({
          isLimited: true,
          remainingTime: Math.ceil(remainingTime / 1000),
          lastRequest: now,
        });
        
        return false;
      }
      
      // Add current request
      validRequests.push(now);
      localStorage.setItem(storageKey, JSON.stringify({
        requests: validRequests,
        windowStart: data.windowStart,
      }));
      
      setRateLimitState({
        isLimited: false,
        remainingTime: 0,
        lastRequest: now,
      });
      
      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow request if check fails
    }
  }, [maxRequests, windowMs, key]);

  const getRemainingRequests = useCallback(() => {
    const storageKey = `rateLimit_${key}`;
    const now = Date.now();
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return maxRequests;
      
      const data = JSON.parse(stored);
      const validRequests = data.requests.filter((timestamp: number) => 
        now - timestamp < windowMs
      );
      
      return Math.max(0, maxRequests - validRequests.length);
    } catch (error) {
      return maxRequests;
    }
  }, [maxRequests, windowMs, key]);

  return {
    checkRateLimit,
    getRemainingRequests,
    isLimited: rateLimitState.isLimited,
    remainingTime: rateLimitState.remainingTime,
  };
};

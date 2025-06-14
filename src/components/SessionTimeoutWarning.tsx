
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock } from 'lucide-react';

interface SessionTimeoutWarningProps {
  show: boolean;
  timeRemaining: number;
  onExtendSession: () => void;
  onLogout: () => void;
}

const SessionTimeoutWarning = ({ 
  show, 
  timeRemaining, 
  onExtendSession, 
  onLogout 
}: SessionTimeoutWarningProps) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (show && timeRemaining > 0) {
      setCountdown(Math.ceil(timeRemaining / 1000));
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [show, timeRemaining, onLogout]);

  if (!show) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl text-yellow-600">Session Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-2xl font-mono">
            <Clock className="w-5 h-5" />
            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
          
          <p className="text-gray-600">
            Your session will expire due to inactivity. Would you like to continue?
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onExtendSession}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue Session
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
            >
              Logout Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionTimeoutWarning;

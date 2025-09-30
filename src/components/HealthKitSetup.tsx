import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { healthKitService } from '@/services/HealthKitService';

interface HealthKitSetupProps {
  onSetupComplete?: (isConnected: boolean) => void;
}

type SetupStatus = 'idle' | 'checking' | 'connecting' | 'connected' | 'error' | 'unavailable';

const HealthKitSetup: React.FC<HealthKitSetupProps> = ({ onSetupComplete }) => {
  const [status, setStatus] = useState<SetupStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  console.log('HealthKitSetup component rendering with status:', status);

  useEffect(() => {
    checkHealthKitStatus();
  }, []);

  const checkHealthKitStatus = async () => {
    console.log('HealthKitSetup: Checking HealthKit status...');
    setStatus('checking');
    
    try {
      const isAvailable = await healthKitService.isAvailable();
      console.log('HealthKitSetup: HealthKit available:', isAvailable);
      
      if (!isAvailable) {
        setStatus('unavailable');
        onSetupComplete?.(false);
        return;
      }

      const isAuthorized = healthKitService.isAuthorizedForHealthKit() || localStorage.getItem('healthkitAuthorized') === 'true';
      console.log('HealthKitSetup: HealthKit authorized:', isAuthorized);
      
      if (isAuthorized) {
        setStatus('connected');
        onSetupComplete?.(true);
      } else {
        setStatus('idle');
      }
    } catch (error) {
      console.error('HealthKitSetup: Error checking HealthKit status:', error);
      setStatus('error');
      setErrorMessage('Failed to check HealthKit availability');
      onSetupComplete?.(false);
    }
  };

  const handleConnect = async () => {
    setStatus('connecting');
    setErrorMessage('');

    try {
      const success = await healthKitService.requestAuthorization();
      
      if (success) {
        setStatus('connected');
        localStorage.setItem('healthkitAuthorized', 'true');
        onSetupComplete?.(true);
      } else {
        setStatus('error');
        setErrorMessage('HealthKit authorization was denied or failed');
        onSetupComplete?.(false);
      }
    } catch (error) {
      console.error('Error connecting to HealthKit:', error);
      setStatus('error');
      setErrorMessage('Failed to connect to HealthKit');
      onSetupComplete?.(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
      case 'connecting':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
      case 'unavailable':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking Apple Health availability...';
      case 'connecting':
        return 'Connecting to Apple Health...';
      case 'connected':
        return 'Connected to Apple Health';
      case 'error':
        return 'Connection failed';
      case 'unavailable':
        return 'Apple Health not available';
      default:
        return 'Connect to Apple Health';
    }
  };

  const getButtonVariant = () => {
    switch (status) {
      case 'connected':
        return 'default';
      case 'error':
      case 'unavailable':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isButtonDisabled = status === 'checking' || status === 'connecting';

  return (
    <Card className="elevation-1 border-0 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {getStatusText()}
            </h3>
            {errorMessage && (
              <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
            )}
            {status === 'connected' && (
              <p className="text-xs text-green-500 mt-1">
                Track heart rate and calories during workouts
              </p>
            )}
            {status === 'unavailable' && (
              <p className="text-xs text-muted-foreground mt-1">
                HealthKit is only available on iOS devices
              </p>
            )}
            {status === 'idle' && (
              <p className="text-xs text-muted-foreground mt-1">
                Connect to track your workout metrics
              </p>
            )}
          </div>
        </div>
        
        {status !== 'connected' && status !== 'unavailable' && (
          <Button
            onClick={handleConnect}
            disabled={isButtonDisabled}
            variant={getButtonVariant()}
            size="sm"
            className="ripple"
          >
            {status === 'checking' || status === 'connecting' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {status === 'checking' ? 'Checking...' : 'Connecting...'}
              </>
            ) : (
              'Connect'
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default HealthKitSetup;

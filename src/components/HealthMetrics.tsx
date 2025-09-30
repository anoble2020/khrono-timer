import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Flame } from 'lucide-react';
import { healthKitService, HealthMetrics } from '@/services/HealthKitService';

interface HealthMetricsProps {
  isWorkoutActive: boolean;
  onMetricsUpdate?: (metrics: HealthMetrics) => void;
}

const HealthMetricsComponent: React.FC<HealthMetricsProps> = ({
  isWorkoutActive,
  onMetricsUpdate,
}) => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    heartRate: null,
    caloriesBurned: 0,
    isConnected: false,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const pollingTimeoutRef = useRef<number | null>(null);
  const isFetchingRef = useRef(false);
  const renderCountRef = useRef(0);
  const onUpdateRef = useRef<typeof onMetricsUpdate>(onMetricsUpdate);

  // Keep latest callback without causing effect re-runs
  useEffect(() => {
    onUpdateRef.current = onMetricsUpdate;
  }, [onMetricsUpdate]);

  useEffect(() => {
    renderCountRef.current += 1;
    console.debug('[HealthMetrics] render #', renderCountRef.current, 'isWorkoutActive:', isWorkoutActive);
    
    // Cleanup any pending timeout on dependency change/unmount
    return () => {
      console.debug('[HealthMetrics] cleanup effect, clearing timeout');
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
      isFetchingRef.current = false;
    };
  }, []);

  useEffect(() => {
    console.debug('[HealthMetrics] main effect triggered, isWorkoutActive:', isWorkoutActive);
    
    // Stop and reset when workout is not active
    if (!isWorkoutActive) {
      console.debug('[HealthMetrics] workout not active, stopping polling');
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
      isFetchingRef.current = false;
      setMetrics({ heartRate: null, caloriesBurned: 0, isConnected: false });
      return;
    }

    let cancelled = false;
    let pollCount = 0;

    const scheduleNext = () => {
      if (cancelled) {
        console.debug('[HealthMetrics] cancelled, not scheduling next');
        return;
      }
      console.debug('[HealthMetrics] scheduling next poll in 1000ms');
      pollingTimeoutRef.current = window.setTimeout(runOnce, 1000);
    };

    const runOnce = async () => {
      pollCount += 1;
      console.debug('[HealthMetrics] runOnce #', pollCount, 'cancelled:', cancelled, 'isFetching:', isFetchingRef.current);
      
      if (cancelled) {
        console.debug('[HealthMetrics] runOnce cancelled, exiting');
        return;
      }
      
      if (isFetchingRef.current) {
        console.debug('[HealthMetrics] already fetching, rescheduling in 250ms');
        // Skip this tick; try again in 250ms to avoid piling up
        pollingTimeoutRef.current = window.setTimeout(runOnce, 250);
        return;
      }

      console.debug('[HealthMetrics] starting fetch...');
      isFetchingRef.current = true;
      const startTime = performance.now();
      
      try {
        const currentMetrics = await healthKitService.getCurrentMetrics();
        const fetchTime = performance.now() - startTime;
        console.debug('[HealthMetrics] fetch completed in', fetchTime.toFixed(2), 'ms, cancelled:', cancelled);
        
        if (cancelled) {
          console.debug('[HealthMetrics] fetch completed but cancelled, not updating state');
          return;
        }
        
        console.debug('[HealthMetrics] updating state with metrics:', currentMetrics);
        setMetrics(currentMetrics);
        onUpdateRef.current?.(currentMetrics);
        
        if (currentMetrics.heartRate) {
          console.debug('[HealthMetrics] triggering heart rate animation');
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);
        }
      } catch (error) {
        console.error('[HealthMetrics] Error updating health metrics:', error);
      } finally {
        console.debug('[HealthMetrics] fetch finally block, isFetching = false');
        isFetchingRef.current = false;
        scheduleNext();
      }
    };

    // Kick off immediately
    console.debug('[HealthMetrics] starting initial poll');
    runOnce();

    return () => {
      console.debug('[HealthMetrics] cleanup, cancelling polling');
      cancelled = true;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
      isFetchingRef.current = false;
    };
  }, [isWorkoutActive]);

  if (!isWorkoutActive) {
    return null;
  }

  return (
    <Card className="elevation-1 border-0 p-3 animate-fade-in pointer-events-none select-none">
      <div className="flex items-center justify-between">
        {/* HR */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Heart 
              className={`w-6 h-6 text-red-500 transition-transform ${
                isAnimating ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
          <div className="text-sm font-semibold text-foreground min-w-[36px] text-center">
            {metrics.heartRate ? `${metrics.heartRate}` : '--'}
          </div>
          <div className="text-xs text-muted-foreground">BPM</div>
        </div>

        {/* Calories */}
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <div className="text-sm font-semibold text-foreground min-w-[36px] text-center">
            {metrics.caloriesBurned}
          </div>
          <div className="text-xs text-muted-foreground">CAL</div>
        </div>

        {/* Status dot */}
        <div className="text-xs">
          <span className={metrics.isConnected ? 'text-green-500' : 'text-red-500'}>●</span>
        </div>
      </div>
    </Card>
  );
};

export default HealthMetricsComponent;

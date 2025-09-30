import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabataTimer } from '@/components/TabataTimer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { TimerMode, TimerConfig } from './Index';
import HealthMetricsComponent from '@/components/HealthMetrics';
import { healthKitService, HealthMetrics } from '@/services/HealthKitService';
import CSSGradientBackground from '@/components/CSSGradientBackground';

const Workout = () => {
  const { mode } = useParams<{ mode: TimerMode }>();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    heartRate: null,
    caloriesBurned: 0,
    isConnected: false,
  });
  
  const defaultConfigs: Record<TimerMode, TimerConfig> = {
    intervals: { workTime: 20, restTime: 10, rounds: 8, sets: 1, setRest: 60 },
    emom: { workTime: 60, restTime: 0, rounds: 10, sets: 1, setRest: 0 }
  };

  const [timerConfig, setTimerConfig] = useState<TimerConfig>(
    defaultConfigs[mode as TimerMode] || defaultConfigs.intervals
  );

  // Theme toggle removed - defaulting to dark mode

  // Handle workout state changes
  const handleWorkoutStart = () => {
    setIsWorkoutActive(true);
    if (healthKitService.isAuthorizedForHealthKit()) {
      healthKitService.startWorkoutSession();
    }
  };

  const handleWorkoutStop = () => {
    setIsWorkoutActive(false);
    if (healthKitService.isAuthorizedForHealthKit()) {
      const session = healthKitService.endWorkoutSession();
      if (session) {
        console.log('Workout session ended:', session);
      }
    }
  };

  const handleMetricsUpdate = (metrics: HealthMetrics) => {
    setHealthMetrics(metrics);
  };

  const getModeDisplayName = (mode: string) => {
    switch (mode) {
      case 'intervals': return 'Intervals';
      case 'emom': return 'EMOM';
      default: return 'Workout';
    }
  };

  return (
    <div 
      className="min-h-screen h-screen overflow-hidden gradient-background transition-colors duration-300"
      style={{ overscrollBehavior: 'none' }}
    >
      {/* CSS Gradient Background */}
      <CSSGradientBackground />
      
      {/* Safe area padding for iPhone notch */}
      <div className="pt-safe-top">

      <main className="container mx-auto px-4 py-6 space-y-6 h-full overflow-hidden">
        {/* Workout Details (moved above timer) */}
        <Card className="elevation-1 border-0 p-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="text-center space-y-2 flex-1">
              <div className="flex justify-center space-x-6 text-muted-foreground">
                {mode === 'intervals' && (
                  <>
                    <span>Work: {timerConfig.workTime}s</span>
                    <span>Rest: {timerConfig.restTime}s</span>
                  </>
                )}
                {mode === 'emom' && (
                  <span>Duration: {timerConfig.rounds} minutes</span>
                )}
                <span>Rounds: {timerConfig.rounds}</span>
                {timerConfig.sets > 1 && <span>Sets: {timerConfig.sets}</span>}
              </div>
            </div>
            
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="ripple w-10 h-10 rounded-full"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Main Timer */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <TabataTimer 
              config={timerConfig}
              mode={mode as TimerMode}
              onWorkoutStart={handleWorkoutStart}
              onWorkoutStop={handleWorkoutStop}
            />
          </div>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:w-80 animate-slide-up">
              <Card className="elevation-2 border-0 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Timer Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize your {getModeDisplayName(mode || '')} workout
                  </p>
                </div>
                
                <div className="space-y-4">
                  {mode === 'intervals' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Work Time</label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTimerConfig(prev => ({ ...prev, workTime: Math.max(5, prev.workTime - 5) }))}
                            className="ripple h-8 w-8 rounded-full"
                          >
                            -
                          </Button>
                          <div className="flex-1 text-center font-mono">
                            {timerConfig.workTime}s
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTimerConfig(prev => ({ ...prev, workTime: Math.min(300, prev.workTime + 5) }))}
                            className="ripple h-8 w-8 rounded-full"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rest Time</label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTimerConfig(prev => ({ ...prev, restTime: Math.max(5, prev.restTime - 5) }))}
                            className="ripple h-8 w-8 rounded-full"
                          >
                            -
                          </Button>
                          <div className="flex-1 text-center font-mono">
                            {timerConfig.restTime}s
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTimerConfig(prev => ({ ...prev, restTime: Math.min(300, prev.restTime + 5) }))}
                            className="ripple h-8 w-8 rounded-full"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {mode === 'emom' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.max(1, prev.rounds - 1) }))}
                          className="ripple h-8 w-8 rounded-full"
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center font-mono">
                          {timerConfig.rounds} min
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.min(60, prev.rounds + 1) }))}
                          className="ripple h-8 w-8 rounded-full"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Rounds</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.max(1, prev.rounds - 1) }))}
                        className="ripple h-8 w-8 rounded-full"
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center font-mono">
                        {timerConfig.rounds}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.min(50, prev.rounds + 1) }))}
                        className="ripple h-8 w-8 rounded-full"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Health Metrics */}
        <HealthMetricsComponent 
          isWorkoutActive={isWorkoutActive}
          onMetricsUpdate={handleMetricsUpdate}
        />
      </main>

      </div>
    </div>
  );
};

export default Workout;

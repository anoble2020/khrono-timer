import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Timer, Zap, Play, Pause, RotateCcw, Clock, Layers } from 'lucide-react';
import { TabataTimer } from '@/components/TabataTimer';
import HealthKitSetup from '@/components/HealthKitSetup';
import HealthMetricsComponent from '@/components/HealthMetrics';
import { healthKitService, HealthMetrics } from '@/services/HealthKitService';
import CSSGradientBackground from '@/components/CSSGradientBackground';

export type TimerMode = 'intervals' | 'emom';

export interface TimerConfig {
  workTime: number;
  restTime: number;
  rounds: number;
  sets: number;
  setRest: number;
}

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsClosing, setSettingsClosing] = useState(false);
  const [currentMode, setCurrentMode] = useState<TimerMode | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isHealthKitConnected, setIsHealthKitConnected] = useState(false);
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

  const [timerConfig, setTimerConfig] = useState<TimerConfig>(defaultConfigs.intervals);

  // Theme toggle removed - defaulting to dark mode

  // Wake lock to prevent device from sleeping
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const wakeLockSentinel = await navigator.wakeLock.request('screen');
          setWakeLock(wakeLockSentinel);
          
          wakeLockSentinel.addEventListener('release', () => {
            setWakeLock(null);
          });
        }
      } catch (err) {
        console.log('Wake lock request failed:', err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
    setTimerConfig(defaultConfigs[mode]);
  };

  // HealthKit handlers
  const handleHealthKitSetup = (isConnected: boolean) => {
    setIsHealthKitConnected(isConnected);
  };

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

  const handleMetricsUpdate = useCallback((metrics: HealthMetrics) => {
    setHealthMetrics(metrics);
  }, []);

  const handleBackToModeSelection = () => {
    setCurrentMode(null);
    setShowSettings(false);
    setSettingsClosing(false);
  };

  const handleCloseSettings = () => {
    if (showSettings) {
      setSettingsClosing(true);
      setTimeout(() => {
        setShowSettings(false);
        setSettingsClosing(false);
      }, 300); // Match fade-out animation duration
    }
  };

  const handleToggleSettings = () => {
    console.debug('[Settings] toggle clicked, current state:', showSettings);
    if (showSettings) {
      console.debug('[Settings] closing settings');
      handleCloseSettings();
    } else {
      console.debug('[Settings] opening settings');
      setShowSettings(true);
      setSettingsClosing(false);
    }
  };

  // Swipe navigation handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!currentMode || showSettings) return; // only enable swipe-back in workout screen and not over settings
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    console.debug('[Gesture] touchstart', {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      mode: currentMode,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!currentMode || showSettings) return;
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
    if (touchStartX !== null && touchStartY !== null) {
      const dx = e.targetTouches[0].clientX - touchStartX;
      const dy = e.targetTouches[0].clientY - touchStartY;
      // Do not prevent default to avoid interfering with taps/buttons
      // Log small moves rarely to avoid spam
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        console.debug('[Gesture] touchmove', { dx, dy });
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!currentMode || showSettings) return;
    if (touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) return;
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    const isRightSwipe = deltaX > minSwipeDistance && deltaY < 40; // ignore mostly vertical gestures/taps
    console.debug('[Gesture] touchend', { deltaX, deltaY, isRightSwipe });
    if (isRightSwipe) {
      console.debug('[Gesture] triggering back to mode selection');
      // Avoid stopping propagation for normal taps
      handleBackToModeSelection();
    }
  };

  const modes = [
    {
      id: 'intervals' as TimerMode,
      name: 'INTERVALS',
      description: 'Intervals of work and rest',
      icon: Timer,
      color: 'bg-primary'
    },
    {
      id: 'emom' as TimerMode,
      name: 'EMOM',
      description: 'Every minute on the minute',
      icon: Zap,
      color: 'bg-secondary'
    }
  ];

  // Feature flag to quickly disable metrics for debugging freezes
  const DISABLE_HEALTH_METRICS = false;

  return (
    <div
      className="min-h-screen h-screen overflow-hidden transition-colors duration-300"
      style={{ overscrollBehavior: 'none' }}
    >
      {/* CSS Gradient Background */}
      <CSSGradientBackground />
      
      {/* Safe area padding for iPhone notch */}
      <div className="pt-safe-top">

      <main 
        className="container mx-auto px-4 py-6 space-y-6 h-full overflow-hidden"
        onTouchStart={currentMode && !showSettings ? onTouchStart : undefined}
        onTouchMove={currentMode && !showSettings ? onTouchMove : undefined}
        onTouchEnd={currentMode && !showSettings ? onTouchEnd : undefined}
      >
        {!currentMode ? (
          /* Mode Selection */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-lg font-medium">
                Select a workout mode to get started
              </p>
            </div>

            {/* HealthKit Setup */}
            <HealthKitSetup onSetupComplete={handleHealthKitSetup} />

            <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 justify-center items-center md:px-6">
                {modes.map((mode) => {
                  const descriptions = {
                    intervals: "Intervals of work and rest, such as Tabata or timed workouts",
                    emom: "Every minute on the minute, with a set amount of work performed at the top of every minute."
                  };
                  
                  return (
                    <div
                      key={mode.id}
                      className={`mode-card ${mode.id}`}
                      onClick={() => handleModeChange(mode.id)}
                    >
                      <div className="mode-card-body">
                        <h3 className="mode-card-title">{mode.name}</h3>
                        <p className="mode-card-description">{descriptions[mode.id]}</p>
                      </div>
                      <div className="mode-card-footer">
                        <button className="mode-card-button">
                          <span className="mode-card-button-text">START</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Workout Mode */
          <>
          {/* Swipe navigation temporarily disabled for debugging */}

          {/* Workout Details */}
            <Card className="card-modern p-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="text-center space-y-3 flex-1">
                  <div className="flex justify-center space-x-8 text-muted-foreground">
                     {currentMode === 'intervals' && (
                       <>
                         <div className="flex flex-col items-center">
                           <div className="flex items-center space-x-1 mb-1">
                             <Play className="w-4 h-4" />
                             <span className="text-sm font-medium">Work</span>
                           </div>
                           <span className="text-lg font-bold text-foreground">{timerConfig.workTime}s</span>
                         </div>
                         <div className="flex flex-col items-center">
                           <div className="flex items-center space-x-1 mb-1">
                             <Pause className="w-4 h-4" />
                             <span className="text-sm font-medium">Rest</span>
                           </div>
                           <span className="text-lg font-bold text-foreground">{timerConfig.restTime}s</span>
                         </div>
                       </>
                     )}
                     {currentMode === 'emom' && (
                       <div className="flex flex-col items-center">
                         <div className="flex items-center space-x-1 mb-1">
                           <Clock className="w-4 h-4" />
                           <span className="text-sm font-medium">Duration</span>
                         </div>
                         <span className="text-lg font-bold text-foreground">{timerConfig.rounds} min</span>
                       </div>
                     )}
                     <div className="flex flex-col items-center">
                       <div className="flex items-center space-x-1 mb-1">
                         <RotateCcw className="w-4 h-4" />
                         <span className="text-sm font-medium">Rounds</span>
                       </div>
                       <span className="text-lg font-bold text-foreground">{timerConfig.rounds}</span>
                     </div>
                     {timerConfig.sets > 1 && (
                       <div className="flex flex-col items-center">
                         <div className="flex items-center space-x-1 mb-1">
                           <Layers className="w-4 h-4" />
                           <span className="text-sm font-medium">Sets</span>
                         </div>
                         <span className="text-lg font-bold text-foreground">{timerConfig.sets}</span>
                       </div>
                     )}
            </div>
                </div>
                
                {/* Settings Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleSettings}
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
              mode={currentMode}
              onWorkoutStart={handleWorkoutStart}
              onWorkoutStop={handleWorkoutStop}
            />
          </div>
          
          {/* Settings Modal */}
          {showSettings && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={handleCloseSettings}
            >
              {/* Backdrop with blur - appears immediately */}
              <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${settingsClosing ? 'animate-fade-out' : 'animate-fade-in'}`} />
              
              {/* Modal Content */}
              <div 
                className={`relative w-full max-w-md mx-4 ${settingsClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="glass-dark p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Timer Settings</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Customize your {currentMode.toUpperCase()} workout
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {currentMode === 'intervals' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Work Time</label>
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setTimerConfig(prev => ({ ...prev, workTime: Math.max(5, prev.workTime - 5) }))}
                              className="btn-modern h-10 w-10 rounded-xl"
                            >
                              -
                            </Button>
                            <div className="flex-1 text-center font-mono text-lg font-bold bg-card rounded-xl py-2 text-foreground">
                              {timerConfig.workTime}s
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setTimerConfig(prev => ({ ...prev, workTime: Math.min(300, prev.workTime + 5) }))}
                              className="btn-modern h-10 w-10 rounded-xl"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Rest Time</label>
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setTimerConfig(prev => ({ ...prev, restTime: Math.max(5, prev.restTime - 5) }))}
                              className="btn-modern h-10 w-10 rounded-xl"
                            >
                              -
                            </Button>
                            <div className="flex-1 text-center font-mono text-lg font-bold bg-card rounded-xl py-2 text-foreground">
                              {timerConfig.restTime}s
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setTimerConfig(prev => ({ ...prev, restTime: Math.min(300, prev.restTime + 5) }))}
                              className="btn-modern h-10 w-10 rounded-xl"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {currentMode === 'emom' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.max(1, prev.rounds - 1) }))}
                            className="btn-modern h-10 w-10 rounded-xl"
                          >
                            -
                          </Button>
                          <div className="flex-1 text-center font-mono text-lg font-bold bg-card rounded-xl py-2 text-foreground">
                            {timerConfig.rounds} min
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.min(60, prev.rounds + 1) }))}
                            className="btn-modern h-10 w-10 rounded-xl"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Rounds</label>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.max(1, prev.rounds - 1) }))}
                          className="btn-modern h-10 w-10 rounded-xl"
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center font-mono text-lg font-bold bg-card rounded-xl py-2 text-foreground">
                          {timerConfig.rounds}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setTimerConfig(prev => ({ ...prev, rounds: Math.min(50, prev.rounds + 1) }))}
                          className="btn-modern h-10 w-10 rounded-xl"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

                {/* Health Metrics */}
                {!DISABLE_HEALTH_METRICS && (
                  <HealthMetricsComponent
                    isWorkoutActive={isWorkoutActive}
                    onMetricsUpdate={handleMetricsUpdate}
                  />
                )}
          </>
        )}
      </main>

      </div>
    </div>
  );
};

export default Index;
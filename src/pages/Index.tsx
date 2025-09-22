import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Home, Timer, Zap } from 'lucide-react';
import logo from '/src/assets/logo.png';
import { TabataTimer } from '@/components/TabataTimer';

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
  const [currentMode, setCurrentMode] = useState<TimerMode | null>(null);
  
  const defaultConfigs: Record<TimerMode, TimerConfig> = {
    intervals: { workTime: 20, restTime: 10, rounds: 8, sets: 1, setRest: 60 },
    emom: { workTime: 60, restTime: 0, rounds: 10, sets: 1, setRest: 0 }
  };

  const [timerConfig, setTimerConfig] = useState<TimerConfig>(defaultConfigs.intervals);

  // Theme toggle removed - defaulting to dark mode

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
    setTimerConfig(defaultConfigs[mode]);
  };

  const handleBackToModeSelection = () => {
    setCurrentMode(null);
    setShowSettings(false);
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

  return (
    <div className="min-h-screen gradient-background transition-colors duration-300">
      {/* Header */}
      <header className="glass-dark sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="khrono timer" className="w-8 h-8" />
            <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">khrono</h1>
            <div className="text-xs text-muted-foreground">a simple workout timer</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToModeSelection}
                className="ripple"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </Button>
            )}
            {currentMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="ripple"
            >
              <Settings className="w-5 h-5" />
            </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {!currentMode ? (
          /* Mode Selection */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-lg font-medium">
                Select a workout mode to get started
              </p>
            </div>

            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
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
        {/* Main Timer */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <TabataTimer 
              config={timerConfig}
              mode={currentMode}
            />
          </div>
          
          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:w-80 animate-slide-up">
                  <Card className="card-modern p-6 space-y-6">
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
          )}
        </div>

            {/* Workout Details */}
            <Card className="card-modern p-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="text-center space-y-3 flex-1">
                  <h3 className="text-xl font-bold text-foreground">
              {currentMode.toUpperCase()} WORKOUT
            </h3>
                  <div className="flex justify-center space-x-8 text-muted-foreground">
                    {currentMode === 'intervals' && (
                      <>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">Work</span>
                          <span className="text-lg font-bold text-foreground">{timerConfig.workTime}s</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">Rest</span>
                          <span className="text-lg font-bold text-foreground">{timerConfig.restTime}s</span>
                        </div>
                      </>
                    )}
                    {currentMode === 'emom' && (
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">Duration</span>
                        <span className="text-lg font-bold text-foreground">{timerConfig.rounds} min</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">Rounds</span>
                      <span className="text-lg font-bold text-foreground">{timerConfig.rounds}</span>
                    </div>
                    {timerConfig.sets > 1 && (
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">Sets</span>
                        <span className="text-lg font-bold text-foreground">{timerConfig.sets}</span>
                      </div>
                    )}
            </div>
                </div>
                
          </div>
        </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
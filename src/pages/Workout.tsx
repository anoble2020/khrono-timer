import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabataTimer } from '@/components/TabataTimer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Sun, Moon, Home } from 'lucide-react';
import logo from '/src/assets/kanji_clock_black.png';
import { TimerMode, TimerConfig } from './Index';

const Workout = () => {
  const { mode } = useParams<{ mode: TimerMode }>();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const defaultConfigs: Record<TimerMode, TimerConfig> = {
    intervals: { workTime: 20, restTime: 10, rounds: 8, sets: 1, setRest: 60 },
    emom: { workTime: 60, restTime: 0, rounds: 10, sets: 1, setRest: 0 }
  };

  const [timerConfig, setTimerConfig] = useState<TimerConfig>(
    defaultConfigs[mode as TimerMode] || defaultConfigs.intervals
  );

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const getModeDisplayName = (mode: string) => {
    switch (mode) {
      case 'intervals': return 'Intervals';
      case 'emom': return 'EMOM';
      default: return 'Workout';
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="elevation-1 border-b border-border/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ugoku timer" className="w-8 h-8" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">ugoku</h1>
              <div className="text-xs text-foreground">a simple workout timer</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="ripple"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ripple"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Timer */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <TabataTimer 
              config={timerConfig}
              mode={mode as TimerMode}
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

        {/* Workout Details */}
        <Card className="elevation-1 border-0 p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="text-center space-y-2 flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {getModeDisplayName(mode || '')} Workout
              </h3>
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
            
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Workout;

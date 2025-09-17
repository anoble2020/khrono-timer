import React, { useState } from 'react';
import { TabataTimer } from '@/components/TabataTimer';
import { TimerSettings } from '@/components/TimerSettings';
import { ModeSelector } from '@/components/ModeSelector';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Sun, Moon } from 'lucide-react';
import logo from '/src/assets/kanji_clock_black.png'

export type TimerMode = 'tabata' | 'hiit' | 'custom';

export interface TimerConfig {
  workTime: number;
  restTime: number;
  rounds: number;
  sets: number;
  setRest: number;
}

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState<TimerMode>('tabata');
  
  const defaultConfigs: Record<TimerMode, TimerConfig> = {
    tabata: { workTime: 20, restTime: 10, rounds: 8, sets: 1, setRest: 60 },
    hiit: { workTime: 45, restTime: 15, rounds: 12, sets: 3, setRest: 120 },
    custom: { workTime: 30, restTime: 30, rounds: 6, sets: 1, setRest: 60 }
  };

  const [timerConfig, setTimerConfig] = useState<TimerConfig>(defaultConfigs.tabata);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
    setTimerConfig(defaultConfigs[mode]);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="elevation-1 border-b border-border/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
              onClick={toggleTheme}
              className="ripple"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="ripple"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Mode Selector */}
        <Card className="elevation-2 border-0 animate-fade-in">
          <ModeSelector 
            currentMode={currentMode} 
            onModeChange={handleModeChange}
          />
        </Card>

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
              <TimerSettings
                config={timerConfig}
                onConfigChange={setTimerConfig}
                mode={currentMode}
              />
            </div>
          )}
        </div>

        {/* Quick Info */}
        <Card className="elevation-1 border-0 p-4 animate-fade-in">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {currentMode.toUpperCase()} Workout
            </h3>
            <div className="flex justify-center space-x-6 text-muted-foreground">
              <span>Work: {timerConfig.workTime}s</span>
              <span>Rest: {timerConfig.restTime}s</span>
              <span>Rounds: {timerConfig.rounds}</span>
              {timerConfig.sets > 1 && <span>Sets: {timerConfig.sets}</span>}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Index;
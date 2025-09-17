import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Timer, Zap } from 'lucide-react';
import logo from '/src/assets/kanji_clock_black.png';

export type TimerMode = 'intervals' | 'emom';

const modes = [
  {
    id: 'intervals' as TimerMode,
    name: 'Intervals',
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

const ModeSelection = () => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleModeSelect = (mode: TimerMode) => {
    navigate(`/workout/${mode}`);
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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg">
              Select a workout mode to get started
            </p>
          </div>

          {/* Mode Selection */}
          <Card className="elevation-2 border-0 p-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modes.map((mode) => {
                const Icon = mode.icon;
                
                return (
                  <Button
                    key={mode.id}
                    variant="outline"
                    onClick={() => handleModeSelect(mode.id)}
                    className={`ripple h-auto p-8 flex-col space-y-4 hover:bg-muted border-2 hover:border-primary/30 transition-all duration-200 backdrop-blur-sm ${mode.color} text-white`}
                  >
                    <Icon className="w-16 h-16 text-white" />
                    
                    <div className="text-center space-y-2">
                      <div className="font-bold text-xl text-white">{mode.name}</div>
                      <div className="text-white/80">
                        {mode.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ModeSelection;

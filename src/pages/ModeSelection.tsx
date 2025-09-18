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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {modes.map((mode) => {
              const Icon = mode.icon;
              
              return (
                <div
                  key={mode.id}
                  onClick={() => handleModeSelect(mode.id)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full min-h-[160px] justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">
                          WORKOUT
                        </div>
                        <div className="font-bold text-2xl text-white mb-2">
                          {mode.name}
                        </div>
                        <div className="text-white/80 text-sm leading-relaxed">
                          {mode.description}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className="flex justify-end mt-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModeSelection;

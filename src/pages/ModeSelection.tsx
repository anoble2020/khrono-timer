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
              const cardBg = mode.id === 'intervals' ? 'bg-card-intervals' : 'bg-card-emom';
              
              return (
                <div
                  key={mode.id}
                  className={`flex flex-col justify-center items-center p-0 relative w-full h-56 ${cardBg} rounded-[20px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-md`}
                  onClick={() => handleModeSelect(mode.id)}
                >
                  {/* Main Content */}
                  <div className="flex flex-col items-center justify-center text-center px-8 mb-8">
                    <h2 className="text-2xl font-bold text-black mb-4 tracking-normal">
                      {mode.name.toUpperCase()}
                    </h2>
                    <p className="text-sm text-black/80 leading-relaxed max-w-[280px]">
                      {mode.id === 'intervals' 
                        ? 'Intervals of work and rest, such as Tabata or timed workouts'
                        : 'Every minute on the minute, with a set amount of work performed at the top of every minute'
                      }
                    </p>
                  </div>
                  
                  {/* Start Button */}
                  <div className="px-6 py-2 border-2 border-black bg-transparent text-black font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-colors duration-200">
                    START
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

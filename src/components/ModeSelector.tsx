import React from 'react';
import { Button } from '@/components/ui/button';
import { Timer, Zap, Settings2 } from 'lucide-react';
import { TimerMode } from '@/pages/Index';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

const modes = [
  {
    id: 'tabata' as TimerMode,
    name: 'Tabata',
    description: '20s work, 10s rest',
    icon: Timer,
    color: 'bg-timer-work'
  },
  {
    id: 'hiit' as TimerMode,
    name: 'HIIT',
    description: '45s work, 15s rest',
    icon: Zap,
    color: 'bg-timer-rest'
  },
  {
    id: 'custom' as TimerMode,
    name: 'Custom',
    description: 'Your intervals',
    icon: Settings2,
    color: 'bg-timer-complete'
  }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange
}) => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Workout Mode</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <Button
              key={mode.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onModeChange(mode.id)}
              className={`ripple h-auto p-4 flex-col space-y-2 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-material-md' 
                  : 'hover:bg-muted border-2 hover:border-primary/20'
              }`}
            >
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                isActive ? 'bg-primary-foreground/20' : mode.color
              }`}>
                <Icon className={`w-16 h-16 ${isActive ? 'text-primary-foreground' : 'text-white'}`} />
              </div>
              
              <div className="text-center space-y-1">
                <div className="font-semibold text-sm">{mode.name}</div>
                <div className={`text-xs ${
                  isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {mode.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
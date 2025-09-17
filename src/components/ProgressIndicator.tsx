import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TimerState } from './TabataTimer';

interface ProgressIndicatorProps {
  progress: number;
  timerState: TimerState;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  timerState
}) => {
  const getProgressColor = () => {
    switch (timerState) {
      case 'work':
        return 'bg-timer-work';
      case 'rest':
      case 'setRest':
        return 'bg-timer-rest';
      case 'complete':
        return 'bg-timer-complete';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Workout Progress</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-out rounded-full ${getProgressColor()}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
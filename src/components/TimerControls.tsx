import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerState } from './TabataTimer';

interface TimerControlsProps {
  isRunning: boolean;
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  timerState,
  onStart,
  onPause,
  onReset
}) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      {/* Play/Pause Button */}
      <Button
        size="lg"
        onClick={isRunning ? onPause : onStart}
        className="ripple h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-material-lg"
        disabled={timerState === 'complete'}
      >
        {isRunning ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </Button>

      {/* Reset Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={onReset}
        className="ripple h-12 w-12 rounded-full border-2 hover:bg-muted shadow-material-sm"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
    </div>
  );
};
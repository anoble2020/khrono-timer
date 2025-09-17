import React from 'react';
import { TimerState } from './TabataTimer';

interface TimerDisplayProps {
  timeLeft: number;
  timerState: TimerState;
  currentRound: number;
  currentSet: number;
  totalRounds: number;
  totalSets: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  timerState,
  currentRound,
  currentSet,
  totalRounds,
  totalSets
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateColor = () => {
    switch (timerState) {
      case 'work':
        return 'timer-work';
      case 'rest':
        return 'timer-rest';
      case 'setRest':
        return 'timer-rest';
      case 'complete':
        return 'timer-complete';
      default:
        return 'bg-muted';
    }
  };

  const getStateText = () => {
    switch (timerState) {
      case 'work':
        return 'WORK';
      case 'rest':
        return 'REST';
      case 'setRest':
        return 'SET BREAK';
      case 'complete':
        return 'COMPLETE';
      default:
        return 'READY';
    }
  };

  const shouldPulse = timerState === 'work' && timeLeft <= 3;

  return (
    <div className="text-center space-y-6">
      {/* Timer State */}
      <div className={`inline-flex px-6 py-2 rounded-full text-white font-bold tracking-wider ${getStateColor()}`}>
        {getStateText()}
      </div>

      {/* Main Timer Display */}
      <div className={`${shouldPulse ? 'timer-pulse' : ''} transition-transform duration-200`}>
        <div className="text-8xl md:text-9xl font-bold font-mono text-foreground leading-none">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Round and Set Info */}
      <div className="flex justify-center space-x-8 text-muted-foreground">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{currentRound}</div>
          <div className="text-sm uppercase tracking-wider">Round</div>
          <div className="text-xs">of {totalRounds}</div>
        </div>
        
        {totalSets > 1 && (
          <div className="w-px bg-border"></div>
        )}
        
        {totalSets > 1 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{currentSet}</div>
            <div className="text-sm uppercase tracking-wider">Set</div>
            <div className="text-xs">of {totalSets}</div>
          </div>
        )}
      </div>

      {/* Completion Message */}
      {timerState === 'complete' && (
        <div className="animate-fade-in">
          <div className="text-2xl font-bold text-timer-complete mb-2">
            🎉 Workout Complete!
          </div>
          <div className="text-muted-foreground">
            Great job finishing your {totalSets > 1 ? `${totalSets} sets of ` : ''}{totalRounds} rounds!
          </div>
        </div>
      )}
    </div>
  );
};
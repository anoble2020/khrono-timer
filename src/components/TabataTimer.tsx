import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';
import { ProgressIndicator } from './ProgressIndicator';
import { TimerConfig, TimerMode } from '@/pages/Workout';

export type TimerState = 'idle' | 'work' | 'rest' | 'setRest' | 'complete';

interface TabataTimerProps {
  config: TimerConfig;
  mode: TimerMode;
}

export const TabataTimer: React.FC<TabataTimerProps> = ({ config, mode }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.workTime);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [totalTime, setTotalTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext>();

  // Audio cues
  const createBeep = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio not supported');
        return;
      }
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  const playStartBeep = useCallback(() => createBeep(880, 0.2), [createBeep]);
  const playEndBeep = useCallback(() => createBeep(440, 0.5), [createBeep]);
  const playCountdownBeep = useCallback(() => createBeep(660, 0.1), [createBeep]);

  // Calculate total workout time
  useEffect(() => {
    if (mode === 'emom') {
      // EMOM: each round is 60 seconds, no rest between rounds
      setTotalTime(config.rounds * 60);
    } else {
      // Intervals: work + rest time calculation
      const singleSetTime = (config.workTime + config.restTime) * config.rounds - config.restTime;
      const totalSetRest = config.sets > 1 ? (config.sets - 1) * config.setRest : 0;
      setTotalTime(singleSetTime * config.sets + totalSetRest);
    }
  }, [config, mode]);

  // Reset timer when config changes
  useEffect(() => {
    reset();
  }, [config, mode]);

  // Main timer logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 1) {
          // Countdown beeps for last 3 seconds
          if (prev <= 4 && prev > 1) {
            playCountdownBeep();
          }
          return prev - 1;
        }

        // Time's up - transition to next state
        if (timerState === 'work') {
          playEndBeep();
          if (mode === 'emom') {
            // EMOM: move to next round immediately (60 seconds each)
            if (currentRound < config.rounds) {
              setCurrentRound(prev => prev + 1);
              return 60; // Reset to 60 seconds for next round
            } else {
              setTimerState('complete');
              setIsRunning(false);
              return 0;
            }
          } else {
            // Intervals: normal work/rest cycle
            if (currentRound < config.rounds) {
              setTimerState('rest');
              return config.restTime;
            } else if (currentSet < config.sets) {
              setTimerState('setRest');
              setCurrentRound(1);
              setCurrentSet(prev => prev + 1);
              return config.setRest;
            } else {
              setTimerState('complete');
              setIsRunning(false);
              return 0;
            }
          }
        } else if (timerState === 'rest') {
          playStartBeep();
          setTimerState('work');
          setCurrentRound(prev => prev + 1);
          return config.workTime;
        } else if (timerState === 'setRest') {
          playStartBeep();
          setTimerState('work');
          return config.workTime;
        }

        return prev;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerState, currentRound, currentSet, config, mode, playStartBeep, playEndBeep, playCountdownBeep]);

  const start = () => {
    if (timerState === 'idle') {
      setTimerState('work');
      setTimeLeft(mode === 'emom' ? 60 : config.workTime);
      playStartBeep();
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'emom' ? 60 : config.workTime);
    setCurrentRound(1);
    setCurrentSet(1);
    setTimerState('idle');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getProgress = () => {
    if (timerState === 'idle') return 0;
    
    if (mode === 'emom') {
      // EMOM: simple progress based on rounds
      const roundProgress = (60 - timeLeft) / 60;
      return (currentRound - 1 + roundProgress) / config.rounds;
    } else {
      // Intervals: complex progress calculation
      const completedRounds = (currentSet - 1) * config.rounds + (currentRound - 1);
      const totalRounds = config.rounds * config.sets;
      
      if (timerState === 'work') {
        const roundProgress = (config.workTime - timeLeft) / config.workTime;
        return (completedRounds + roundProgress) / totalRounds;
      } else if (timerState === 'rest') {
        const roundProgress = (config.restTime - timeLeft) / config.restTime;
        return (completedRounds + 0.5 + roundProgress * 0.5) / totalRounds;
      } else if (timerState === 'setRest') {
        return completedRounds / totalRounds;
      }
    }
    
    return 1;
  };

  return (
    <Card className="elevation-3 border-0 p-8 space-y-8 bg-card/80 backdrop-blur-sm">
      <ProgressIndicator 
        progress={getProgress()}
        timerState={timerState}
      />
      
      <TimerDisplay
        timeLeft={timeLeft}
        timerState={timerState}
        currentRound={currentRound}
        currentSet={currentSet}
        totalRounds={config.rounds}
        totalSets={config.sets}
      />
      
      <TimerControls
        isRunning={isRunning}
        timerState={timerState}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
    </Card>
  );
};
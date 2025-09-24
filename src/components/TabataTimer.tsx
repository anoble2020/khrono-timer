import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';
import { ProgressIndicator } from './ProgressIndicator';
import { TimerConfig, TimerMode } from '@/pages/Index';
import { NativeAudio } from '@capacitor-community/native-audio';

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
  const audioInitialized = useRef(false);
  const useNativeAudio = useRef(true);

  // Initialize native audio
  const initializeAudio = useCallback(async () => {
    if (audioInitialized.current) return;
    
    try {
      // Try multiple approaches for loading the audio file
      let success = false;
      
      // Approach 1: Try with just the filename
      try {
        await NativeAudio.preload({
          assetId: 'beep',
          assetPath: 'beep.wav',
          audioChannelNum: 1,
          isUrl: false
        });
        success = true;
      } catch (e) {
        console.log('Approach 1 failed:', e);
      }
      
      // Approach 2: Try with sounds/ prefix
      if (!success) {
        try {
          await NativeAudio.preload({
            assetId: 'beep',
            assetPath: 'sounds/beep.wav',
            audioChannelNum: 1,
            isUrl: false
          });
          success = true;
        } catch (e) {
          console.log('Approach 2 failed:', e);
        }
      }
      
      // Approach 3: Try with web URL
      if (!success) {
        try {
          const audioPath = window.location.origin + '/beep.wav';
          await NativeAudio.preload({
            assetId: 'beep',
            assetPath: audioPath,
            audioChannelNum: 1,
            isUrl: true
          });
          success = true;
        } catch (e) {
          console.log('Approach 3 failed:', e);
        }
      }
      
      if (!success) {
        console.warn('Native audio failed, falling back to Web Audio API');
        useNativeAudio.current = false;
      }
      
      audioInitialized.current = true;
    } catch (error) {
      console.warn('Native audio initialization failed:', error);
      useNativeAudio.current = false;
      audioInitialized.current = true;
    }
  }, []);

  // Web Audio API fallback
  const audioContextRef = useRef<AudioContext>();
  
  const createBeep = useCallback((frequency: number, duration: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      // Resume audio context if suspended (required for mobile)
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('Audio context resumed');
        }).catch(console.warn);
      }
      
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
      
      console.log('Web Audio beep played:', frequency, 'Hz');
    } catch (error) {
      console.warn('Web Audio API beep failed:', error);
    }
  }, []);

  // HTML5 Audio fallback
  const playHTML5Audio = useCallback(() => {
    try {
      const audio = new Audio('/beep.wav');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.warn('HTML5 audio failed:', error);
        // Final fallback to Web Audio
        createBeep(880, 0.2);
      });
      console.log('HTML5 audio played');
    } catch (error) {
      console.warn('HTML5 audio creation failed:', error);
      createBeep(880, 0.2);
    }
  }, [createBeep]);

  // Audio cues with multiple fallbacks
  const playStartBeep = useCallback(async () => {
    if (useNativeAudio.current) {
      try {
        await NativeAudio.play({ assetId: 'beep' });
        return;
      } catch (error) {
        console.warn('Native start beep failed, trying HTML5 audio:', error);
      }
    }
    
    // Try HTML5 audio first, then Web Audio
    try {
      const audio = new Audio('/beep.wav');
      audio.volume = 0.5;
      await audio.play();
      console.log('HTML5 audio played for start');
      return;
    } catch (error) {
      console.warn('HTML5 audio failed, using Web Audio:', error);
    }
    
    createBeep(880, 0.2);
  }, [createBeep]);

  const playEndBeep = useCallback(async () => {
    if (useNativeAudio.current) {
      try {
        await NativeAudio.play({ assetId: 'beep' });
        return;
      } catch (error) {
        console.warn('Native end beep failed, trying HTML5 audio:', error);
      }
    }
    
    // Try HTML5 audio first, then Web Audio
    try {
      const audio = new Audio('/beep.wav');
      audio.volume = 0.5;
      await audio.play();
      console.log('HTML5 audio played for end');
      return;
    } catch (error) {
      console.warn('HTML5 audio failed, using Web Audio:', error);
    }
    
    createBeep(440, 0.5);
  }, [createBeep]);

  const playCountdownBeep = useCallback(async () => {
    if (useNativeAudio.current) {
      try {
        await NativeAudio.play({ assetId: 'beep' });
        return;
      } catch (error) {
        console.warn('Native countdown beep failed, trying HTML5 audio:', error);
      }
    }
    
    // Try HTML5 audio first, then Web Audio
    try {
      const audio = new Audio('/beep.wav');
      audio.volume = 0.5;
      await audio.play();
      console.log('HTML5 audio played for countdown');
      return;
    } catch (error) {
      console.warn('HTML5 audio failed, using Web Audio:', error);
    }
    
    createBeep(660, 0.1);
  }, [createBeep]);

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

  const start = async () => {
    // Initialize audio on first user interaction (required for mobile)
    await initializeAudio();
    
    if (timerState === 'idle') {
      setTimerState('work');
      setTimeLeft(mode === 'emom' ? 60 : config.workTime);
      await playStartBeep();
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
      const progress = (currentRound - 1 + roundProgress) / config.rounds;
      return Math.max(0, Math.min(progress, 1));
    } else {
      // Intervals: use the existing totalTime calculation
      if (!totalTime || totalTime <= 0) {
        console.log('Progress debug - totalTime:', totalTime);
        return 0;
      }
      
      // Calculate elapsed time based on current state
      let elapsedTime = 0;
      
      // Add completed sets (only if currentSet > 1)
      if (currentSet > 1) {
        elapsedTime += (currentSet - 1) * config.rounds * (config.workTime + config.restTime);
        elapsedTime += (currentSet - 1) * config.setRestTime;
      }
      
      // Add completed rounds in current set (only if currentRound > 1)
      if (currentRound > 1) {
        elapsedTime += (currentRound - 1) * (config.workTime + config.restTime);
      }
      
      // Add current round progress
      if (timerState === 'work') {
        elapsedTime += config.workTime - timeLeft;
      } else if (timerState === 'rest') {
        elapsedTime += config.workTime + (config.restTime - timeLeft);
      } else if (timerState === 'setRest') {
        elapsedTime += config.workTime + config.restTime + (config.setRestTime - timeLeft);
      }
      
      const progress = elapsedTime / totalTime;
      console.log('Progress debug:', { 
        elapsedTime, 
        totalTime, 
        progress, 
        timerState, 
        currentRound, 
        currentSet,
        config: { workTime: config.workTime, restTime: config.restTime, setRestTime: config.setRestTime }
      });
      return Math.max(0, Math.min(progress, 1));
    }
  };

  return (
    <Card className="glass-dark p-8 space-y-8 rounded-[20px]">
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
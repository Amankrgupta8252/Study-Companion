import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TimerSettings, TimerState, Subject, SessionLog } from '../types';
import useLocalStorage from './useLocalStorage';
import { playNotificationSound, showNotification } from '../services/notificationService';

interface UseTimerProps {
  subjects: Subject[];
  updateSubjectTime: (subjectId: string, minutesCompleted: number) => void;
}

const useTimer = ({ subjects, updateSubjectTime }: UseTimerProps) => {
  // Timer settings
  const [settings, setSettings] = useLocalStorage<TimerSettings>('studyCompanion_timerSettings', {
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
  });

  // Timer state with localStorage persistence
  const [timerState, setTimerState] = useLocalStorage<TimerState>('studyCompanion_timerState', {
    mode: 'work',
    secondsLeft: settings.workMinutes * 60,
    isPaused: true,
    currentSubjectId: null,
    sessionsCompleted: 0,
  });

  // Session logs
  const [sessionLogs, setSessionLogs] = useLocalStorage<SessionLog[]>('studyCompanion_sessionLogs', []);

  // Interval reference for cleanup
  const timerRef = useRef<number | null>(null);

  // Reset timer with new mode
  const resetTimer = (mode: 'work' | 'break' | 'longBreak') => {
    let seconds;
    
    switch (mode) {
      case 'work':
        seconds = settings.workMinutes * 60;
        break;
      case 'break':
        seconds = settings.breakMinutes * 60;
        break;
      case 'longBreak':
        seconds = settings.longBreakMinutes * 60;
        break;
      default:
        seconds = settings.workMinutes * 60;
    }
    
    setTimerState(prev => ({
      ...prev,
      mode,
      secondsLeft: seconds,
      isPaused: true,
    }));
  };

  // Toggle timer pause state
  const toggleTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  // Set current subject for timer
  const setCurrentSubject = (subjectId: string | null) => {
    setTimerState(prev => ({
      ...prev,
      currentSubjectId: subjectId,
    }));
  };

  // Update timer settings
  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Reset timer if we're changing settings
    resetTimer(timerState.mode);
  };

  // Skip to next timer (work -> break or break -> work)
  const skipToNext = () => {
    const { mode, sessionsCompleted } = timerState;
    
    // Log completed session if we're in work mode
    if (mode === 'work' && timerState.currentSubjectId) {
      // Calculate minutes completed (total - remaining)
      const minutesCompleted = (settings.workMinutes * 60 - timerState.secondsLeft) / 60;
      
      if (minutesCompleted > 0) {
        // Update subject stats
        updateSubjectTime(timerState.currentSubjectId, minutesCompleted);
        
        // Log session
        const newLog: SessionLog = {
          id: uuidv4(),
          subjectId: timerState.currentSubjectId,
          date: new Date().toISOString(),
          duration: minutesCompleted,
          type: 'work',
        };
        
        setSessionLogs(prev => [...prev, newLog]);
      }
    }
    
    // Determine next mode
    if (mode === 'work') {
      // After work session, increment completed sessions
      const newSessionsCompleted = sessionsCompleted + 1;
      const needsLongBreak = newSessionsCompleted % settings.sessionsBeforeLongBreak === 0;
      
      setTimerState(prev => ({
        ...prev,
        mode: needsLongBreak ? 'longBreak' : 'break',
        secondsLeft: needsLongBreak ? settings.longBreakMinutes * 60 : settings.breakMinutes * 60,
        sessionsCompleted: newSessionsCompleted,
        isPaused: true,
      }));
    } else {
      // After any break, go back to work
      setTimerState(prev => ({
        ...prev,
        mode: 'work',
        secondsLeft: settings.workMinutes * 60,
        isPaused: true,
      }));
    }
  };

  // Timer effect
  useEffect(() => {
    const tick = () => {
      setTimerState(prev => {
        // If paused or no time left, don't update
        if (prev.isPaused || prev.secondsLeft <= 0) return prev;
        
        return {
          ...prev,
          secondsLeft: prev.secondsLeft - 1,
        };
      });
    };
    
    // Start/stop timer based on pause state
    if (!timerState.isPaused) {
      timerRef.current = window.setInterval(tick, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerState.isPaused, setTimerState]);

  // Handle timer completion
  useEffect(() => {
    if (timerState.secondsLeft <= 0 && !timerState.isPaused) {
      // Stop the timer
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Play notification sound based on current mode
      playNotificationSound(timerState.mode);
      
      // Show notification
      const title = timerState.mode === 'work' 
        ? 'Work session completed!' 
        : 'Break time is over!';
      
      showNotification(title, {
        body: timerState.mode === 'work' 
          ? 'Take a break now!' 
          : 'Ready to get back to work?',
        icon: '/favicon.ico',
      });
      
      // Log completed session if we're in work mode
      if (timerState.mode === 'work' && timerState.currentSubjectId) {
        // Update subject stats with completed time
        updateSubjectTime(timerState.currentSubjectId, settings.workMinutes);
        
        // Log session
        const newLog: SessionLog = {
          id: uuidv4(),
          subjectId: timerState.currentSubjectId,
          date: new Date().toISOString(),
          duration: settings.workMinutes,
          type: 'work',
        };
        
        setSessionLogs(prev => [...prev, newLog]);
      }
      
      // Auto transition to next mode
      skipToNext();
    }
  }, [timerState.secondsLeft, timerState.isPaused, timerState.mode, timerState.currentSubjectId]);

  // Formatted time for display
  const formatTime = (): string => {
    const minutes = Math.floor(timerState.secondsLeft / 60);
    const seconds = timerState.secondsLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get current subject name
  const currentSubject = subjects.find(s => s.id === timerState.currentSubjectId);

  return {
    timerState,
    settings,
    currentSubject,
    formattedTime: formatTime(),
    sessionLogs,
    resetTimer,
    toggleTimer,
    setCurrentSubject,
    updateSettings,
    skipToNext,
  };
};

export default useTimer;
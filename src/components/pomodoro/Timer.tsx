import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, Settings } from 'lucide-react';
import { Subject } from '../../types';
import useTimer from '../../hooks/useTimer';
import { initAudio } from '../../services/notificationService';
import TimerSettings from './TimerSettings';

interface TimerProps {
  subjects: Subject[];
  updateSubjectTime: (subjectId: string, minutesCompleted: number) => void;
}

const Timer: React.FC<TimerProps> = ({ subjects, updateSubjectTime }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    timerState,
    settings,
    currentSubject,
    formattedTime,
    toggleTimer,
    setCurrentSubject,
    updateSettings,
    skipToNext,
  } = useTimer({ subjects, updateSubjectTime });

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      initAudio();
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Determine background color based on timer mode
  const getBgColor = () => {
    switch (timerState.mode) {
      case 'work':
        return 'bg-indigo-600';
      case 'break':
        return 'bg-emerald-500';
      case 'longBreak':
        return 'bg-sky-500';
      default:
        return 'bg-indigo-600';
    }
  };

  // Get timer mode display text
  const getModeText = () => {
    switch (timerState.mode) {
      case 'work':
        return 'Work Session';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Work Session';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${getBgColor()} transition-colors duration-700 w-full max-w-sm p-8 rounded-2xl shadow-lg text-white text-center`}>
        <h2 className="text-xl font-semibold mb-1">{getModeText()}</h2>
        
        {timerState.mode === 'work' && currentSubject && (
          <p className="text-white/80 text-sm mb-4">
            Studying: {currentSubject.name}
          </p>
        )}
        
        {timerState.mode === 'work' && !currentSubject && (
          <p className="text-white/80 text-sm mb-4">
            Select a subject below
          </p>
        )}
        
        {timerState.mode !== 'work' && (
          <p className="text-white/80 text-sm mb-4">
            Time to recharge
          </p>
        )}
        
        <div className="text-6xl font-bold my-8 font-mono">
          {formattedTime}
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            disabled={timerState.mode === 'work' && !currentSubject}
            className={`p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={timerState.isPaused ? "Start timer" : "Pause timer"}
          >
            {timerState.isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>
          
          <button
            onClick={skipToNext}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Skip to next"
          >
            <SkipForward size={24} />
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Timer settings"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>
      
      {timerState.mode === 'work' && (
        <div className="mt-6 w-full max-w-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Select Subject</h3>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setCurrentSubject(subject.id)}
                className={`p-3 rounded-lg transition-all ${
                  timerState.currentSubjectId === subject.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-800 hover:bg-slate-100'
                } border border-slate-200 shadow-sm`}
              >
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: subject.color }}
                  ></div>
                  <span className="font-medium truncate">{subject.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showSettings && (
        <TimerSettings
          settings={settings}
          updateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default Timer;
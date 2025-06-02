export interface Subject {
  id: string;
  name: string;
  color: string;
  goalMinutes: number;
  completedMinutes: number;
  sessionLogs?: number[]; // ← New: session durations
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subjectId: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  lastUpdated: string;
}

export interface TimerSettings {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}

export interface TimerState {
  mode: 'work' | 'break' | 'longBreak';
  secondsLeft: number;
  isPaused: boolean;
  currentSubjectId: string | null;
  sessionsCompleted: number;
}

export interface SessionLog {
  id: string;
  subjectId: string;
  date: string;
  duration: number;
  type: 'work' | 'break' | 'longBreak';
}
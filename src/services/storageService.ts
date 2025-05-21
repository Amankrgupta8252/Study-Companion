// Local storage keys
const SUBJECTS_KEY = 'studyCompanion_subjects';
const TASKS_KEY = 'studyCompanion_tasks';
const NOTES_KEY = 'studyCompanion_notes';
const TIMER_SETTINGS_KEY = 'studyCompanion_timerSettings';
const TIMER_STATE_KEY = 'studyCompanion_timerState';
const SESSION_LOGS_KEY = 'studyCompanion_sessionLogs';

// Generic get item from localStorage
export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return defaultValue;
  }
};

// Generic set item to localStorage
export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item to localStorage: ${error}`);
  }
};

// Subject storage
export const getSubjects = () => getItem(SUBJECTS_KEY, []);
export const setSubjects = (subjects: any[]) => setItem(SUBJECTS_KEY, subjects);

// Task storage
export const getTasks = () => getItem(TASKS_KEY, []);
export const setTasks = (tasks: any[]) => setItem(TASKS_KEY, tasks);

// Note storage
export const getNotes = () => getItem(NOTES_KEY, []);
export const setNotes = (notes: any[]) => setItem(NOTES_KEY, notes);

// Timer settings storage
export const getTimerSettings = () => 
  getItem(TIMER_SETTINGS_KEY, {
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
  });

export const setTimerSettings = (settings: any) => 
  setItem(TIMER_SETTINGS_KEY, settings);

// Timer state storage
export const getTimerState = () => 
  getItem(TIMER_STATE_KEY, {
    mode: 'work',
    secondsLeft: 25 * 60,
    isPaused: true,
    currentSubjectId: null,
    sessionsCompleted: 0,
  });

export const setTimerState = (state: any) => 
  setItem(TIMER_STATE_KEY, state);

// Session logs storage
export const getSessionLogs = () => getItem(SESSION_LOGS_KEY, []);
export const setSessionLogs = (logs: any[]) => setItem(SESSION_LOGS_KEY, logs);
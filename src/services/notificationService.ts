let audioContext: AudioContext | null = null;

// Initialize audio context on user interaction
export const initAudio = (): void => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

// Play a gentle notification sound
export const playNotificationSound = async (type: 'work' | 'break'): Promise<void> => {
  if (!audioContext) {
    initAudio();
  }
  
  if (!audioContext) return;
  
  try {
    // Create oscillator for gentle notification
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure sound based on type
    if (type === 'work') {
      // Higher pitch for work end
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    } else {
      // Lower pitch for break end
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
    }
    
    // Gentle volume
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.5);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Show browser notification
export const showNotification = (title: string, options: NotificationOptions = {}): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
};
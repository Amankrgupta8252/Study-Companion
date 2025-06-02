import { useEffect } from 'react';
import { Subject } from '../../types';

interface SubjectTimerProps {
  subject: Subject;
  isRunning: boolean;
  elapsedMinutes: number;
  onComplete: (subjectId: string, minutes: number) => void;
}

const SubjectTimer: React.FC<SubjectTimerProps> = ({
  subject,
  isRunning,
  elapsedMinutes,
  onComplete,
}) => {
  useEffect(() => {
    if (isRunning && elapsedMinutes > 0) {
      // Update subject time when timer completes or is stopped
      onComplete(subject.id, elapsedMinutes);
    }
  }, [isRunning, elapsedMinutes, subject.id, onComplete]);

  return null; // This component has no UI
};

export default SubjectTimer;

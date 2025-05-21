import React from 'react';
import { Subject, SessionLog } from '../../types';
import { Clock, Calendar } from 'lucide-react';

interface SessionHistoryProps {
  subjects: Subject[];
  sessionLogs: SessionLog[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ subjects, sessionLogs }) => {
  // Sort session logs by date (newest first)
  const sortedLogs = [...sessionLogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Group logs by date
  const groupedLogs: Record<string, SessionLog[]> = {};
  
  sortedLogs.forEach(log => {
    const date = new Date(log.date);
    const dateString = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (!groupedLogs[dateString]) {
      groupedLogs[dateString] = [];
    }
    
    groupedLogs[dateString].push(log);
  });
  
  // Format time
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    });
  };
  
  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  // Get subject color by ID
  const getSubjectColor = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.color : '#CBD5E1';
  };
  
  // Get session type label
  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'work':
        return 'Work Session';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Session';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Session History</h3>
      
      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-400 mb-2" size={40} />
          <p className="text-gray-500">No sessions recorded yet. Start the timer to log your study sessions!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([date, logs]) => {
            // Calculate total study time for this date
            const totalTime = logs
              .filter(log => log.type === 'work')
              .reduce((sum, log) => sum + log.duration, 0);
            
            return (
              <div key={date} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    {date}
                  </h4>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Total study time: <span className="font-medium ml-1">{Math.round(totalTime)} min</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {logs.filter(log => log.type === 'work').map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: getSubjectColor(log.subjectId) }}
                        ></div>
                        <span className="font-medium text-gray-800">{getSubjectName(log.subjectId)}</span>
                        <span className="text-gray-500 text-sm ml-3">{getSessionTypeLabel(log.type)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-4">{formatTime(log.date)}</span>
                        <span className="font-medium text-indigo-600">
                          {log.duration.toFixed(1)} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
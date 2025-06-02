import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Subject } from '../../types';


interface SubjectListProps {
  subjects: Subject[];
  onAddSubject: () => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
}) => {
  // Calculate percentage completion for each subject
  const getCompletionPercentage = (subject: Subject) => {
    if (subject.goalMinutes <= 0) return 0;
    const percentage = (subject.completedMinutes / subject.goalMinutes) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Your Subjects</h2>
        <button
          onClick={onAddSubject}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          <span>Add Subject</span>
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
          <p className="text-gray-500">No subjects added yet. Create your first subject to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((subject) => {
            const completionPercentage = getCompletionPercentage(subject);
            
            return (
              <div 
                key={subject.id} 
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <h3 className="font-semibold text-slate-800 text-lg">{subject.name}</h3>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => onEditSubject(subject)}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-100"
                      aria-label={`Edit ${subject.name}`}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDeleteSubject(subject.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                      aria-label={`Delete ${subject.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-slate-700">
                      {subject.completedMinutes} / {subject.goalMinutes} min
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${completionPercentage}%`,
                        backgroundColor: subject.color 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {completionPercentage < 100 ? (
                    <p>{Math.round(subject.goalMinutes - subject.completedMinutes)} minutes left to reach goal</p>
                  ) : (
                    <p className="text-emerald-600 font-medium">Goal completed! 🎉</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectList;
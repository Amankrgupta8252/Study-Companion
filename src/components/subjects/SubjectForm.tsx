import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Subject } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface SubjectFormProps {
  subject?: Subject;
  onSave: (subject: Subject) => void;
  onCancel: () => void;
}

// Predefined colors for subjects
const SUBJECT_COLORS = [
  '#4F46E5', // indigo
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#EF4444', // red
  '#06B6D4', // cyan
  '#F97316', // orange
];

const SubjectForm: React.FC<SubjectFormProps> = ({ 
  subject, 
  onSave, 
  onCancel 
}) => {
  const [name, setName] = useState(subject?.name || '');
  const [color, setColor] = useState(subject?.color || SUBJECT_COLORS[0]);
  const [goalMinutes, setGoalMinutes] = useState(subject?.goalMinutes || 120);
  const [error, setError] = useState('');

  // Reset form when subject prop changes
  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setColor(subject.color);
      setGoalMinutes(subject.goalMinutes);
    } else {
      setName('');
      setColor(SUBJECT_COLORS[0]);
      setGoalMinutes(120);
    }
    setError('');
  }, [subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }
    
    if (goalMinutes <= 0) {
      setError('Goal minutes must be greater than zero');
      return;
    }
    
    const newSubject: Subject = {
      id: subject?.id || uuidv4(),
      name: name.trim(),
      color,
      goalMinutes,
      completedMinutes: subject?.completedMinutes || 0,
    };
    
    onSave(newSubject);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-6 text-slate-800">
          {subject ? 'Edit Subject' : 'Add New Subject'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Mathematics"
                maxLength={30}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Color
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_COLORS.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={`w-8 h-8 rounded-full ${
                      color === colorOption ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                    }`}
                    style={{ backgroundColor: colorOption }}
                    aria-label={`Select color ${colorOption}`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="goalMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Goal (minutes)
              </label>
              <input
                type="number"
                id="goalMinutes"
                value={goalMinutes}
                onChange={(e) => setGoalMinutes(Math.max(1, parseInt(e.target.value, 10) || 0))}
                min="1"
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {subject ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
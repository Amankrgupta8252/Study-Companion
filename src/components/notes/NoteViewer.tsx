import React from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Note, Subject } from '../../types';

interface NoteViewerProps {
  note: Note;
  subjects: Subject[];
  onClose: () => void;
  onEdit: (note: Note) => void;
}

const NoteViewer: React.FC<NoteViewerProps> = ({
  note,
  subjects,
  onClose,
  onEdit,
}) => {
  // Get subject by ID
  const subject = subjects.find(s => s.id === note.subjectId);
  
  // Format date from ISO string
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full h-[90vh] p-6 relative flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {subject && (
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: subject.color }}
              ></div>
            )}
            <h3 className="text-sm font-medium text-gray-500">
              {subject ? subject.name : 'Unknown Subject'} / Note
            </h3>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">{note.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {formatDate(note.lastUpdated)}
          </p>
        </div>
        
        <div className="flex-1 overflow-auto border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onEdit(note)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteViewer;
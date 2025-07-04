import React from 'react';
import { Book, Plus, Edit, Trash2 } from 'lucide-react';
import { Note, Subject } from '../../types';
import ReactMarkdown from 'react-markdown';

interface NoteListProps {
  notes: Note[];
  subjects: Subject[];
  onAddNote: () => void;
  onViewNote: (note: Note) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  subjects,
  onAddNote,
  onViewNote,
  onEditNote,
  onDeleteNote,
}) => {
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getSubjectColor = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.color : '#CBD5E1';
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const notesBySubject = subjects.map(subject => {
    const subjectNotes = notes.filter(note => note.subjectId === subject.id);
    return {
      subject,
      notes: subjectNotes,
    };
  }).filter(group => group.notes.length > 0);

  return (
    <div className="w-full bg-black min-h-screen p-4 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Study Notes</h2>
        <button
          onClick={onAddNote}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          <span>Create Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="bg-slate-900 border border-gray-700 rounded-xl p-6 text-center text-white">
          <Book size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-300">No notes created yet. Start by adding your first study note!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {notesBySubject.map(({ subject, notes }) => (
            <div key={subject.id} className="space-y-4">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: subject.color }}
                ></div>
                <h3 className="text-lg font-medium text-white">{subject.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-slate-900 border border-gray-700 text-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-64 flex flex-col"
                  >
                    <div 
                      className="h-1" 
                      style={{ backgroundColor: getSubjectColor(note.subjectId) }}
                    ></div>
                    
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <h4 
                          className="font-semibold text-white text-lg cursor-pointer hover:text-indigo-400 transition-colors"
                          onClick={() => onViewNote(note)}
                        >
                          {note.title}
                        </h4>
                        
                        <div className="flex space-x-1 pt-1">
                          <button 
                            onClick={() => onEditNote(note)}
                            className="p-1.5 text-gray-400 hover:text-indigo-400 rounded-md hover:bg-gray-800"
                            aria-label={`Edit ${note.title}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-800"
                            aria-label={`Delete ${note.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div 
                        className="flex-1 overflow-hidden text-sm text-gray-300 cursor-pointer"
                        onClick={() => onViewNote(note)}
                      >
                        <div className="prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 max-h-32 overflow-hidden relative text-gray-300">
                          <ReactMarkdown>{note.content}</ReactMarkdown>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent"></div>
                        </div>
                      </div>
                      
                      <div className="pt-3 text-xs text-gray-400 flex justify-between items-center border-t border-gray-700 mt-2">
                        <span>Last updated: {formatDate(note.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;

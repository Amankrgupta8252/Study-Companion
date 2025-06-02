import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Note, Subject } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface NoteEditorProps {
  note?: Note;
  subjects: Subject[];
  onSave: (note: Note) => void;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  subjects,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [subjectId, setSubjectId] = useState(note?.subjectId || '');
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState('');

  // Reset form when note prop changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSubjectId(note.subjectId);
    } else {
      setTitle('');
      setContent('');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
    }
    setError('');
  }, [note, subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Note title is required');
      return;
    }
    
    if (!subjectId) {
      setError('Please select a subject');
      return;
    }
    
    const newNote: Note = {
      id: note?.id || uuidv4(),
      title: title.trim(),
      content,
      subjectId,
      lastUpdated: new Date().toISOString(),
    };
    
    onSave(newNote);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full h-[90vh] p-6 relative flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                isPreview
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button 
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Note Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Chapter 5 Summary"
                disabled={isPreview}
              />
            </div>
            
            <div className="w-1/3">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isPreview}
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isPreview ? 'Preview' : 'Content (Markdown Supported)'}
            </label>
            {isPreview ? (
              <div className="flex-1 overflow-auto p-4 border border-gray-300 rounded-md bg-gray-50">
                <div className="prose prose-sm prose-slate max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
                placeholder="# Markdown formatting supported
- You can create lists
- **Bold text** and *italic text*
                
## Headings work too
                
> Quote blocks

```
Code blocks
```"
              />
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPreview}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save size={16} className="mr-1" />
              {note ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;
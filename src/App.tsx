import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Subject, Task, Note, SessionLog } from './types';
import Header from './components/layout/Header';
import Timer from './components/pomodoro/Timer';
import SubjectList from './components/subjects/SubjectList';
import SubjectForm from './components/subjects/SubjectForm';
import TaskList from './components/tasks/TaskList';
import NoteList from './components/notes/NoteList';
import NoteEditor from './components/notes/NoteEditor';
import NoteViewer from './components/notes/NoteViewer';
import ProgressChart from './components/analytics/ProgressChart';
import SessionHistory from './components/analytics/SessionHistory';
import { requestNotificationPermission } from './services/notificationService';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('timer');
  
  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Subjects
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('studyCompanion_subjects', [
    {
      id: uuidv4(),
      name: 'Mathematics',
      color: '#4F46E5',
      goalMinutes: 120,
      completedMinutes: 0,
    },
    {
      id: uuidv4(),
      name: 'Physics',
      color: '#10B981',
      goalMinutes: 90,
      completedMinutes: 0,
    },
    {
      id: uuidv4(),
      name: 'Literature',
      color: '#F59E0B',
      goalMinutes: 60,
      completedMinutes: 0,
    },
  ]);
  
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  
  // Tasks
  const [tasks, setTasks] = useLocalStorage<Task[]>('studyCompanion_tasks', []);
  
  // Notes
  const [notes, setNotes] = useLocalStorage<Note[]>('studyCompanion_notes', []);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  
  // Session logs
  const [sessionLogs, setSessionLogs] = useLocalStorage<SessionLog[]>('studyCompanion_sessionLogs', []);

  // Subject handlers
  const handleAddSubject = () => {
    setEditingSubject(null);
    setShowSubjectForm(true);
  };
  
  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowSubjectForm(true);
  };
  
  const handleSaveSubject = (subject: Subject) => {
    if (editingSubject) {
      setSubjects(prev => prev.map(s => s.id === subject.id ? subject : s));
    } else {
      setSubjects(prev => [...prev, subject]);
    }
    setShowSubjectForm(false);
  };
  
  const handleDeleteSubject = (subjectId: string) => {
    if (confirm('Are you sure you want to delete this subject? All associated tasks and notes will remain but may become unlinked.')) {
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    }
  };
  
  // Update subject time when timer completes
  const updateSubjectTime = (subjectId: string, minutesCompleted: number) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { 
              ...subject, 
              completedMinutes: subject.completedMinutes + minutesCompleted 
            } 
          : subject
      )
    );
  };
  
  // Task handlers
  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };
  
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };
  
  // Note handlers
  const handleAddNote = () => {
    setEditingNote(null);
    setShowNoteEditor(true);
  };
  
  const handleViewNote = (note: Note) => {
    setViewingNote(note);
  };
  
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setViewingNote(null);
    setShowNoteEditor(true);
  };
  
  const handleSaveNote = (note: Note) => {
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === note.id ? note : n));
    } else {
      setNotes(prev => [...prev, note]);
    }
    setShowNoteEditor(false);
  };
  
  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <Timer 
            subjects={subjects} 
            updateSubjectTime={updateSubjectTime} 
          />
        )}
        
        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <SubjectList
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}
        
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            subjects={subjects}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
        
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <NoteList
            notes={notes}
            subjects={subjects}
            onAddNote={handleAddNote}
            onViewNote={handleViewNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <ProgressChart 
              subjects={subjects} 
              sessionLogs={sessionLogs} 
            />
            
            <SessionHistory 
              subjects={subjects} 
              sessionLogs={sessionLogs} 
            />
          </div>
        )}
      </main>
      
      {/* Modals */}
      {showSubjectForm && (
        <SubjectForm
          subject={editingSubject || undefined}
          onSave={handleSaveSubject}
          onCancel={() => setShowSubjectForm(false)}
        />
      )}
      
      {showNoteEditor && (
        <NoteEditor
          note={editingNote || undefined}
          subjects={subjects}
          onSave={handleSaveNote}
          onCancel={() => setShowNoteEditor(false)}
        />
      )}
      
      {viewingNote && (
        <NoteViewer
          note={viewingNote}
          subjects={subjects}
          onClose={() => setViewingNote(null)}
          onEdit={handleEditNote}
        />
      )}
    </div>
  );
}

export default App;
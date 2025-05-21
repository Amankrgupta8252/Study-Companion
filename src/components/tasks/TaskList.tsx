import React, { useState } from 'react';
import { Plus, Check, X, Edit, Trash2 } from 'lucide-react';
import { Task, Subject } from '../../types';

interface TaskListProps {
  tasks: Task[];
  subjects: Subject[];
  onAddTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  subjects,
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubjectId, setNewTaskSubjectId] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handle creating a new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim() || !newTaskSubjectId) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      completed: false,
      subjectId: newTaskSubjectId,
      createdAt: new Date().toISOString(),
    };
    
    onAddTask(newTask);
    setNewTaskTitle('');
    setNewTaskSubjectId('');
  };

  // Start editing a task
  const startEditTask = (task: Task) => {
    setEditingTask({ ...task });
  };

  // Save edited task
  const saveEditedTask = () => {
    if (editingTask && editingTask.title.trim()) {
      onEditTask(editingTask);
      setEditingTask(null);
    }
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

  // Group tasks by completion status
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New Task</h2>
        
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <input
              type="text"
              id="taskTitle"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Complete chapter 5 exercises"
              maxLength={100}
            />
          </div>
          
          <div>
            <label htmlFor="taskSubject" className="block text-sm font-medium text-gray-700 mb-1">
              Related Subject
            </label>
            <select
              id="taskSubject"
              value={newTaskSubjectId}
              onChange={(e) => setNewTaskSubjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={!newTaskTitle.trim() || !newTaskSubjectId}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} className="mr-1" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Pending Tasks</h2>
        
        {pendingTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-2">No pending tasks. Great job!</p>
        ) : (
          <ul className="space-y-2">
            {pendingTasks.map((task) => (
              <li 
                key={task.id} 
                className="rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {editingTask && editingTask.id === task.id ? (
                  <div className="p-3 flex items-center">
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={saveEditedTask}
                      className="p-1.5 ml-2 text-emerald-600 hover:bg-emerald-50 rounded-md"
                      aria-label="Save edit"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="p-1.5 ml-1 text-red-600 hover:bg-red-50 rounded-md"
                      aria-label="Cancel edit"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <button 
                        onClick={() => onToggleTask(task.id)}
                        className="p-1.5 mr-2 text-gray-400 hover:text-emerald-600 rounded-full border border-gray-300 hover:border-emerald-600"
                        aria-label="Mark as complete"
                      >
                        <Check size={14} />
                      </button>
                      <span className="text-gray-800">{task.title}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div 
                        className="px-2 py-1 text-xs rounded-md mr-2 font-medium"
                        style={{ 
                          backgroundColor: `${getSubjectColor(task.subjectId)}20`,
                          color: getSubjectColor(task.subjectId)
                        }}
                      >
                        {getSubjectName(task.subjectId)}
                      </div>
                      
                      <button 
                        onClick={() => startEditTask(task)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-md"
                        aria-label="Edit task"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md ml-1"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Completed Tasks</h2>
          
          <ul className="space-y-2">
            {completedTasks.map((task) => (
              <li 
                key={task.id} 
                className="rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      onClick={() => onToggleTask(task.id)}
                      className="p-1.5 mr-2 text-emerald-600 bg-emerald-50 rounded-full border border-emerald-600"
                      aria-label="Mark as incomplete"
                    >
                      <Check size={14} />
                    </button>
                    <span className="text-gray-500 line-through">{task.title}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div 
                      className="px-2 py-1 text-xs rounded-md mr-2 opacity-60 font-medium"
                      style={{ 
                        backgroundColor: `${getSubjectColor(task.subjectId)}20`,
                        color: getSubjectColor(task.subjectId)
                      }}
                    >
                      {getSubjectName(task.subjectId)}
                    </div>
                    
                    <button 
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskList;
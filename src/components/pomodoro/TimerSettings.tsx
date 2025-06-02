import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TimerSettings as TimerSettingsType } from '../../types';

interface TimerSettingsProps {
  settings: TimerSettingsType;
  updateSettings: (settings: Partial<TimerSettingsType>) => void;
  onClose: () => void;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ 
  settings, 
  updateSettings, 
  onClose 
}) => {
  const [localSettings, setLocalSettings] = useState<TimerSettingsType>({
    ...settings
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings({
      ...localSettings,
      [name]: parseInt(value, 10),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-6 text-slate-800">Timer Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="workMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                id="workMinutes"
                name="workMinutes"
                min="1"
                max="120"
                value={localSettings.workMinutes}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="breakMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                Short Break (minutes)
              </label>
              <input
                type="number"
                id="breakMinutes"
                name="breakMinutes"
                min="1"
                max="30"
                value={localSettings.breakMinutes}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="longBreakMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                Long Break (minutes)
              </label>
              <input
                type="number"
                id="longBreakMinutes"
                name="longBreakMinutes"
                min="5"
                max="60"
                value={localSettings.longBreakMinutes}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="sessionsBeforeLongBreak" className="block text-sm font-medium text-gray-700 mb-1">
                Sessions Before Long Break
              </label>
              <input
                type="number"
                id="sessionsBeforeLongBreak"
                name="sessionsBeforeLongBreak"
                min="1"
                max="10"
                value={localSettings.sessionsBeforeLongBreak}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimerSettings;
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Subject, SessionLog } from '../../types';

interface ProgressChartProps {
  subjects: Subject[];
  sessionLogs: SessionLog[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ subjects, sessionLogs }) => {
  // Only show subjects with goal minutes > 0
  const activeSubjects = subjects.filter(subject => subject.goalMinutes > 0);
  
  // Prepare data for bar chart (completion percentage per subject)
  const barChartData = activeSubjects.map(subject => {
    const completionPercentage = Math.min(
      (subject.completedMinutes / subject.goalMinutes) * 100,
      100
    );
    
    return {
      name: subject.name,
      progress: Math.round(completionPercentage),
      color: subject.color,
    };
  });
  
  // Prepare data for pie chart (time distribution)
  const pieChartData = activeSubjects.map(subject => ({
    name: subject.name,
    value: subject.completedMinutes,
    color: subject.color,
  }));
  
  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p>
            Progress: <span className="font-medium">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Get daily stats
  const getDailyStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessionLogs.filter(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime() && log.type === 'work';
    });
    
    const totalMinutes = todaySessions.reduce((sum, log) => sum + log.duration, 0);
    const completedSessions = todaySessions.length;
    
    return { totalMinutes, completedSessions };
  };
  
  const { totalMinutes, completedSessions } = getDailyStats();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Today's Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-700 mb-1">Study Time</p>
              <p className="text-3xl font-bold text-indigo-800">
                {Math.round(totalMinutes)} <span className="text-base font-normal">min</span>
              </p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-emerald-700 mb-1">Sessions</p>
              <p className="text-3xl font-bold text-emerald-800">
                {completedSessions}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Study Distribution</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center">
              <p className="text-gray-500">No study data recorded yet</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Subject Goal Progress</h3>
        
        {barChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                unit="%" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="progress" 
                name="Goal Progress" 
                unit="%"
                radius={[4, 4, 0, 0]}
              >
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Add subjects with goals to see progress tracking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
import React from 'react';
import { Plus, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';
import { TaskStatus, TaskPriority } from '../utils/types';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

const Dashboard: React.FC = () => {
  const { tasks, getCompletionPercentage, addTask } = useTasks();
  
  const completionPercentage = getCompletionPercentage();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length;
  const pendingTasks = totalTasks - completedTasks;
  const urgentTasks = tasks.filter(task => task.priority === TaskPriority.URGENT).length;
  
  // Get tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasksToday = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = task.dueDate.toDate();
    return dueDate >= today && dueDate < tomorrow;
  }).length;
  
  const handleAddTask = () => {
    addTask({
      title: 'New Task',
      description: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: '',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Task Progress</h2>
        <ProgressBar progress={completionPercentage} size="lg" variant="success" />
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Due Today</p>
                <p className="text-2xl font-semibold text-gray-900">{tasksToday}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Urgent</p>
                <p className="text-2xl font-semibold text-gray-900">{urgentTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Recent Tasks</h2>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div 
                key={task.id} 
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === TaskPriority.URGENT 
                      ? 'bg-red-100 text-red-800' 
                      : task.priority === TaskPriority.HIGH 
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
            
            {tasks.length === 0 && (
              <p className="text-gray-500 text-sm">No tasks yet. Add your first task to get started!</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Task Distribution</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingTasks}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalTasks > 0 
                  ? `${Math.round((pendingTasks / totalTasks) * 100)}% of all tasks`
                  : 'No tasks yet'}
              </p>
              {totalTasks > 0 && (
                <div className="mt-2">
                  <ProgressBar 
                    progress={Math.round((pendingTasks / totalTasks) * 100)} 
                    size="sm" 
                    showLabel={false}
                  />
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalTasks > 0 
                  ? `${Math.round((completedTasks / totalTasks) * 100)}% of all tasks`
                  : 'No tasks yet'}
              </p>
              {totalTasks > 0 && (
                <div className="mt-2">
                  <ProgressBar 
                    progress={Math.round((completedTasks / totalTasks) * 100)} 
                    size="sm" 
                    variant="success" 
                    showLabel={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
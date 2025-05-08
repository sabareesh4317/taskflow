import React from 'react';
import { format } from 'date-fns';
import { Trash2, Edit, AlertCircle, Clock } from 'lucide-react';
import { Task, TaskPriority } from '../../utils/types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const priorityClasses = {
    [TaskPriority.LOW]: 'bg-gray-200 text-gray-800',
    [TaskPriority.MEDIUM]: 'bg-blue-200 text-blue-800',
    [TaskPriority.HIGH]: 'bg-amber-200 text-amber-800',
    [TaskPriority.URGENT]: 'bg-red-200 text-red-800'
  };

  const priorityLabels = {
    [TaskPriority.LOW]: 'Low',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.HIGH]: 'High',
    [TaskPriority.URGENT]: 'Urgent'
  };

  return (
    <div
      className={`
        p-4 mb-2 rounded-lg shadow bg-white border-l-4
        ${task.priority === TaskPriority.URGENT ? 'border-l-red-500' : 
          task.priority === TaskPriority.HIGH ? 'border-l-amber-500' :
          task.priority === TaskPriority.MEDIUM ? 'border-l-blue-500' : 'border-l-gray-500'}
        transition-all duration-200 hover:shadow-md
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-base">{task.title}</h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => onEdit(task)} 
            className="text-gray-500 hover:text-blue-600 p-1 rounded transition-colors"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(task.id)} 
            className="text-gray-500 hover:text-red-600 p-1 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className={`text-xs px-2 py-1 rounded-full ${priorityClasses[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        
        {task.dueDate && (
          <span className="text-xs flex items-center text-gray-500">
            <Clock size={12} className="mr-1" />
            {format(task.dueDate.toDate(), 'MMM d')}
          </span>
        )}
        
        {task.priority === TaskPriority.URGENT && (
          <span className="text-xs flex items-center text-red-500">
            <AlertCircle size={12} className="mr-1" />
            Urgent
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
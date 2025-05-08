import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { PlusCircle } from 'lucide-react';
import TaskCard from '../ui/TaskCard';
import { Task, ColumnType } from '../../utils/types';

interface TaskColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg p-2 border border-gray-200">
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="font-medium text-gray-800">
          {column.title} <span className="text-gray-500 text-sm">({tasks.length})</span>
        </h2>
        <button
          onClick={() => onAddTask(column.id)}
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          <PlusCircle size={20} />
        </button>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto min-h-[200px] p-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                No tasks yet
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
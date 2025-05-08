import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../../utils/types';
import TaskCard from '../ui/TaskCard';

interface DraggableTaskProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  index,
  onEdit,
  onDelete
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 transition-shadow ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableTask;
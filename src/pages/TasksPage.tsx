import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';
import { Task, TaskStatus } from '../utils/types';
import TaskColumn from '../components/tasks/TaskColumn';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';

const TasksPage: React.FC = () => {
  const { tasks, columns, addTask, updateTask, deleteTask, handleDragEnd, getCompletionPercentage } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>(TaskStatus.TODO);
  
  const completionPercentage = getCompletionPercentage();
  
  const handleAddClick = (status: string) => {
    setInitialStatus(status as TaskStatus);
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  
  const handleSubmitTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask({
        ...taskData,
        status: initialStatus
      });
    }
    setIsModalOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => handleAddClick(TaskStatus.TODO)}
        >
          Add Task
        </Button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Overall Progress</h2>
          <span className="text-sm text-gray-500">{completionPercentage}% Complete</span>
        </div>
        <ProgressBar progress={completionPercentage} variant="success" />
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(columns).map(column => {
            const columnTasks = column.taskIds.map(
              taskId => tasks.find(task => task.id === taskId)
            ).filter(task => task !== undefined) as Task[];
            
            return (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onAddTask={handleAddClick}
                onEditTask={handleEditTask}
                onDeleteTask={deleteTask}
              />
            );
          })}
        </div>
      </DragDropContext>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          task={editingTask || undefined}
          onSubmit={handleSubmitTask}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;
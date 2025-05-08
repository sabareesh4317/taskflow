import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp, 
  writeBatch
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { Task, TaskStatus, TaskPriority, DragResult, ColumnType } from '../utils/types';

interface TaskContextType {
  tasks: Task[];
  columns: Record<string, ColumnType>;
  addTask: (newTask: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  handleDragEnd: (result: DragResult) => void;
  isLoading: boolean;
  getCompletionPercentage: () => number;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  columns: {},
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  handleDragEnd: () => {},
  isLoading: true,
  getCompletionPercentage: () => 0
});

export const useTasks = () => useContext(TaskContext);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Record<string, ColumnType>>({
    [TaskStatus.TODO]: {
      id: TaskStatus.TODO,
      title: 'To Do',
      taskIds: []
    },
    [TaskStatus.IN_PROGRESS]: {
      id: TaskStatus.IN_PROGRESS,
      title: 'In Progress',
      taskIds: []
    },
    [TaskStatus.REVIEW]: {
      id: TaskStatus.REVIEW,
      title: 'Review',
      taskIds: []
    },
    [TaskStatus.DONE]: {
      id: TaskStatus.DONE,
      title: 'Done',
      taskIds: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from Firestore
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', currentUser.id),
      orderBy('position')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      setTasks(tasksData);
      
      // Set columns with task IDs
      const newColumns = {...columns};
      
      // Reset taskIds
      Object.keys(newColumns).forEach(key => {
        newColumns[key as TaskStatus].taskIds = [];
      });
      
      // Populate taskIds in columns
      tasksData.forEach(task => {
        if (newColumns[task.status]) {
          newColumns[task.status].taskIds.push(task.id);
        } else {
          // Default to TODO if status is invalid
          newColumns[TaskStatus.TODO].taskIds.push(task.id);
        }
      });
      
      setColumns(newColumns);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Add a new task
  const addTask = async (newTask: Partial<Task>) => {
    if (!currentUser) return;
    
    // Get max position for the status
    const statusTasks = tasks.filter(t => t.status === newTask.status);
    const maxPosition = statusTasks.length > 0 
      ? Math.max(...statusTasks.map(t => t.position)) 
      : 0;
    
    const taskData: Task = {
      id: uuidv4(),
      title: newTask.title || '',
      description: newTask.description || '',
      status: newTask.status || TaskStatus.TODO,
      priority: newTask.priority || TaskPriority.MEDIUM,
      dueDate: newTask.dueDate || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      projectId: newTask.projectId || '',
      userId: currentUser.id,
      position: maxPosition + 1,
      completed: false,
    };

    await setDoc(doc(db, 'tasks', taskData.id), taskData);
  };

  // Update an existing task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  // Handle drag and drop
  const handleDragEnd = async (result: DragResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];
    
    // Moving within the same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds
      };
      
      setColumns({
        ...columns,
        [newColumn.id]: newColumn
      });
      
      // Update positions in Firebase
      const batch = writeBatch(db);
      newTaskIds.forEach((taskId, index) => {
        const taskRef = doc(db, 'tasks', taskId);
        batch.update(taskRef, { position: index });
      });
      
      await batch.commit();
      return;
    }
    
    // Moving from one column to another
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds
    };
    
    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
      ...finishColumn,
      taskIds: finishTaskIds
    };
    
    setColumns({
      ...columns,
      [newStartColumn.id]: newStartColumn,
      [newFinishColumn.id]: newFinishColumn
    });
    
    // Update status and positions in Firebase
    const batch = writeBatch(db);
    
    // Update the dragged task status
    const draggedTaskRef = doc(db, 'tasks', draggableId);
    batch.update(draggedTaskRef, { 
      status: destination.droppableId,
      updatedAt: Timestamp.now()
    });
    
    // Update positions for source column
    startTaskIds.forEach((taskId, index) => {
      const taskRef = doc(db, 'tasks', taskId);
      batch.update(taskRef, { position: index });
    });
    
    // Update positions for destination column
    finishTaskIds.forEach((taskId, index) => {
      const taskRef = doc(db, 'tasks', taskId);
      batch.update(taskRef, { position: index });
    });
    
    await batch.commit();
  };

  // Calculate completion percentage
  const getCompletionPercentage = (): number => {
    if (tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const value = {
    tasks,
    columns,
    addTask,
    updateTask,
    deleteTask,
    handleDragEnd,
    isLoading,
    getCompletionPercentage
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
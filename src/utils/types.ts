import { Timestamp } from 'firebase/firestore';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  projectId: string;
  userId: string;
  position: number;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface ColumnType {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}

export interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  draggableId: string;
}
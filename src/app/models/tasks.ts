export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
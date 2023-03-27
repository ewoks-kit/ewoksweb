import type { Task, State } from '../types';
import type { SetState } from 'zustand';

export interface TasksSlice {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const tasks = (set: SetState<State>): TasksSlice => ({
  tasks: [],
  setTasks: (allTasks) => {
    set((state) => ({
      ...state,
      tasks: allTasks,
    }));
  },
});

export default tasks;

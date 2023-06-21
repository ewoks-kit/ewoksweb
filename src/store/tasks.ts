import type { Task, State } from '../types';
import type { SetState } from 'zustand';
import { getTaskName } from '../utils';

export interface TasksSlice {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const tasks = (set: SetState<State>): TasksSlice => ({
  tasks: [],
  setTasks: (allTasks) => {
    set((state) => ({
      ...state,
      tasks: allTasks.sort((a, b) => {
        return getTaskName(a).localeCompare(getTaskName(b));
      }),
    }));
  },
});

export default tasks;

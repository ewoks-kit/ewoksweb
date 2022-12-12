import type { Task } from '../types';

interface Tasks {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const tasks = (set): Tasks => ({
  tasks: [],
  setTasks: (allTasks) => {
    set((state) => ({
      ...state,
      tasks: allTasks,
    }));
  },
});

export default tasks;

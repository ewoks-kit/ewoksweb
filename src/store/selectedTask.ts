import type { Task, State } from '../types';
import type { SetState } from 'zustand';

export interface SelectedTaskSlice {
  selectedTask: Task;
  setSelectedTask: (task: Task) => void;
}
const selectedTask = (set: SetState<State>): SelectedTaskSlice => ({
  selectedTask: {},

  setSelectedTask: (task) => {
    set((state) => ({
      ...state,
      selectedTask: task,
    }));
  },
});

export default selectedTask;

// import { ExecutingEvent } from '../types';

const executedEvents = (set, get) => ({
  executedEvents: [],

  setExecutedEvents: (execEvent) => {
    const prevState = get((prev) => prev);
    console.log(execEvent, prevState.executedEvents);
    // For the event if type=end added to the executed events as history
    if (execEvent.type === 'end') {
      set((state) => ({
        ...state,
        executedEvents: [...prevState.executedEvents, execEvent],
      }));
    }
  },
});

export default executedEvents;

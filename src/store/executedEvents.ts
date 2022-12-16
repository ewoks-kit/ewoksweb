import type { Event, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface ExecutedEventsSlice {
  executedEvents?: Event[];
  setExecutedEvents?: (execEvent: Event) => void;
}

// DOC: All the events that came in during live executions. These events keep
// pilling-up while the app is up front-back. When should that stop;
const executedEvents = (
  set: SetState<State>,
  get: GetState<State>
): ExecutedEventsSlice => ({
  executedEvents: [],

  setExecutedEvents: (execEvent: Event) => {
    // Add all events to keep track of the order they came in
    // calculate the id of the event based on the order of arrival
    const event = {
      ...execEvent,
      id: get().executedEvents.length,
    };
    // send it to executing events to adapt the canvas
    get().setExecutingEvents(event, true);
    set((state) => ({
      ...state,
      executedEvents: [...get().executedEvents, event],
    }));
  },
});

export default executedEvents;

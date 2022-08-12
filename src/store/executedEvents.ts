import type { Event } from '../types';

const executedEvents = (set, get) => ({
  executedEvents: [] as Event[],

  setExecutedEvents: (execEvent: Event) => {
    // Add all events to keep track of the order they came in
    const prevState = get((prev) => prev);
    // calculate the id of the event based on the order of arrival
    const event = {
      ...execEvent,
      id: prevState.executedEvents.length as number,
    };
    // send it to executing events to addapt
    prevState.setExecutingEvents(event, true);
    set((state) => ({
      ...state,
      executedEvents: [...prevState.executedEvents, event],
    }));
  },
});

export default executedEvents;

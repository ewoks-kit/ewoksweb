const currentExecutionEvent = (set) => ({
  currentExecutionEvent: 0,

  setCurrentExecutionEvent: (indexOfEvent) => {
    // console.log(indexOfEvent, get().executingEvents);
    set((state) => ({
      ...state,
      currentExecutionEvent: indexOfEvent,
    }));
  },
});

export default currentExecutionEvent;

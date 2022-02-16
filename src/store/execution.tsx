// const setCurrentExecutionEvent = (set, get) => ({
//   setCurrentExecutionEvent: (indexOfEvent) => {
//     console.log(indexOfEvent, get().executingEvents);
//     set((state) => ({
//       ...state,
//       currentExecutionEvent: indexOfEvent,
//     }));
//   },
// });

// export default execution;

const execution = (set, get) => ({
  currentExecutionEvent: 0,

  setCurrentExecutionEvent: (indexOfEvent) => {
    console.log(indexOfEvent, get().executingEvents);
    set((state) => ({
      ...state,
      currentExecutionEvent: indexOfEvent,
    }));
  },
});

export default execution;

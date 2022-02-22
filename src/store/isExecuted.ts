const isExecuted = (set, get) => ({
  isExecuted: false,

  setIsExecuted: (val: boolean) => {
    const prevState = get((prev) => prev);
    //console.log(val, prevState);

    set((state) => ({
      ...state,
      isExecuted: val,
    }));

    // when execution stops by user the execution nodes are excluded
    if (!val) {
      set((state) => ({
        ...state,
        // only for testing set graphRF
        graphRF: {
          ...prevState.graphRF,
          nodes: prevState.graphRF.nodes.filter(
            (nod) => nod.type !== 'executionSteps'
          ),
        },
        executingEvents: [],
      }));
      // when execution starts
    } else {
      // when execution starts
    }
  },
});

export default isExecuted;

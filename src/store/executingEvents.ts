import type { Event } from '../types';

const executingEvents = (set, get) => ({
  executingEvents: [] as Event[],

  // Executing events receive one event at a time and calculate the executing spinners

  // If user selects to see an executing job then the executed and the executing
  // have to be recalculated to get again in execution mode?
  // If so the events must be replayed up to all the executed and reach the executing
  // in current-time. For that they mush be feeded all together to
  // executed and executing that must accept an array or a feed them using a loop
  // with setExecuting and setExecuted.

  setExecutingEvents: (execEvent: Event, live: boolean) => {
    // console.log(execEvent);
    const prevState = get((prev) => prev);

    if (execEvent.context === 'node') {
      // Do the rest for nodes
      let newExecutingEvents = [];
      if (execEvent.type === 'start') {
        // add to executing events
        newExecutingEvents = [...prevState.executingEvents, execEvent];
      } else if (execEvent.type === 'end') {
        // console.log(
        //   'END event',
        //   execEvent.node_id,
        //   [...prevState.executingEvents].length,
        //   [...prevState.executedEvents]
        // );
        // remove from executing events
        // TODO removing based on node_id may be wrong as
        // there maybe more than one running in parallel: will remove the first-in
        const eventToRemove = [...prevState.executingEvents]
          .map((ev) => ev.node_id)
          .indexOf(execEvent.node_id);
        // console.log(
        //   eventToRemove,
        //   [...prevState.executingEvents],
        //   execEvent.node_id
        // );
        if (eventToRemove > -1) {
          newExecutingEvents = [...prevState.executingEvents];

          newExecutingEvents.splice(eventToRemove, 1);
        }
        // console.log(newExecutingEvents);
        // newExecutingEvents = [...prevState.executingEvents].filter(
        //   (ev) => ev.node_id !== execEvent.node_id
        // );
      }

      // ----if (execEvent.context === 'node') {
      let tempPos = { x: 100, y: 100 };

      const tempNode = prevState.graphRF.nodes.find(
        (nod) =>
          nod.id === execEvent.node_id &&
          nod.task_identifier === execEvent.task_id
      );
      // console.log(tempNode, execEvent, prevState.graphRF.nodes);

      if ([null, undefined, ''].includes(tempNode)) {
        /* eslint-disable no-console */
        console.log('Node not found in current Graph');
        return;
      }

      tempPos = tempNode.position;

      const { withLabel } = tempNode.data;

      if (execEvent.type === 'start') {
        tempPos = { x: tempPos.x - 30, y: tempPos.y + 30 };
      } else if (withLabel) {
        tempPos = { x: tempPos.x + 120, y: tempPos.y + 30 };
      } else {
        tempPos = { x: tempPos.x + 95, y: tempPos.y + 30 };
      }

      // if there are other nodes for the same position we need to to join them with comma
      // only if live-execution else ignore
      let sameEls = [];
      if (live) {
        sameEls = [...prevState.executedEvents]
          .reverse()
          .filter(
            (elem) =>
              elem.node_id === execEvent.node_id &&
              elem.type === execEvent.type &&
              elem.job_id === execEvent.job_id
          );
      }

      const tempLabel: string =
        sameEls.length > 0 ? sameEls.map((elem) => elem.id).join(',') : '';

      let execNodes = [];

      // calculate the executing ones and add the executing param.
      // Not a set beacause maybe it needs a complex id
      const executingIds = newExecutingEvents.map((ev) => ev.node_id);
      console.log(executingIds, tempLabel);

      execNodes = [
        ...prevState.graphRF.nodes
          .filter((nod) => !executingIds.includes(nod.id))
          .map((no) => {
            return { ...no, data: { ...no.data, executing: false } };
          }),
        ...prevState.graphRF.nodes
          .filter((nod) => executingIds.includes(nod.id))
          .map((no) => {
            return { ...no, data: { ...no.data, executing: true } };
          }),
      ];
      // if execution goes back to the same node it needs to delete the previous
      // ExecutionStepNode with the old number before putting the new node

      // If not in execution dont affect the canvas
      if (prevState.inExecutionMode) {
        set((state) => ({
          ...state,
          // only foe testing set graphRF
          graphRF: {
            ...prevState.graphRF,
            nodes: [
              ...execNodes.filter(
                (nod) =>
                  !(
                    nod.data.node_id === execEvent.node_id &&
                    nod.data.type === execEvent.type
                  )
              ),
              {
                data: {
                  label: `${tempLabel},${(execEvent.id as unknown) as string}`,
                  node_id: execEvent.node_id,
                  type: execEvent.type,
                  values: { a: 1, b: 2 },
                },
                id: execEvent.time,
                task_type: 'executionSteps',
                task_identifier: execEvent.id,
                type: 'executionSteps',
                // calculate position based on node_id -> node position + start or stop
                position: tempPos,
              },
            ],
          },
          executingEvents: newExecutingEvents,
        }));
      }
    } else if (execEvent.context === 'workflow') {
      // TODO: Terminate the execution and exit executionMode
      // If tasks still exist in executing raise an error?
    }
  },
});

export default executingEvents;

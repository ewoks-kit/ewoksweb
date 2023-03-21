import type { Event, EwoksRFNode, State } from '../types';
import type { GetState, SetState } from 'zustand';
import type { XYPosition } from 'reactflow';

export interface ExecutingEventsSlice {
  executingEvents: Event[];
  setExecutingEvents: (execEvent: Event, live: boolean) => void;
}

const executingEvents = (
  set: SetState<State>,
  get: GetState<State>
): ExecutingEventsSlice => ({
  executingEvents: [] as Event[],

  // Executing events receive one event at a time and calculate the executing spinners

  // If user selects to see an executing job then the executed and the executing
  // have to be recalculated to get again in execution mode
  // The events must be replayed up to all the executed and reach the executing
  // in current-time. For that they are be feeded using a loop with setExecuting and setExecuted.

  setExecutingEvents: (execEvent: Event, live: boolean) => {
    const prevExecutingEvents: Event[] = [...get().executingEvents];

    if (execEvent.context === 'node') {
      const newExecutingEvents: Event[] = calcNewExecutingEvents(
        execEvent,
        prevExecutingEvents
      );

      // TBD add else
      // if (execEvent.type === 'start') {
      //   // add to executing events
      //   newExecutingEvents = [...prevExecutingEvents, execEvent];
      // } else if (execEvent.type === 'end') {
      //   // remove from executing events
      //   // used event.id to be examined?? Examine if the following for the end event are needed
      //   const eventToRemove = [...prevExecutingEvents]
      //     .map((ev) => ev.id)
      //     .indexOf(execEvent.id);

      //   if (eventToRemove > -1) {
      //     newExecutingEvents = [...prevExecutingEvents];

      //     newExecutingEvents.splice(eventToRemove, 1);
      //   }

      //   newExecutingEvents = [...prevExecutingEvents].filter(
      //     (ev) => ev.node_id !== execEvent.node_id
      //   );
      // }

      // DOC: define the position of the event nodes
      let tempPos: XYPosition = { x: 100, y: 100 };

      // Replace graphRF
      const tempNode: EwoksRFNode | undefined = get().graphRF.nodes.find(
        (nod) =>
          nod.id === execEvent.node_id &&
          // DATAC
          nod.data.task_props.task_identifier === execEvent.task_id
      );

      if (!tempNode) {
        /* eslint-disable no-console */
        console.log('Node not found in current Graph');
        return;
      }

      if (tempNode.position) {
        tempPos = tempNode.position;
      }

      const { withLabel } = tempNode.data.ui_props;

      // TODO: calc the exact pos based on the nodes width which is
      // available and adjustable now
      if (execEvent.type === 'start') {
        tempPos = { x: tempPos.x - 30, y: tempPos.y + 30 };
      } else if (withLabel) {
        tempPos = {
          x: tempPos.x + (tempNode.data.ui_props.nodeWidth ?? 0) + 15,
          y: tempPos.y + 30,
        };
      } else {
        tempPos = { x: tempPos.x + 95, y: tempPos.y + 30 };
      }

      // if there are other nodes for the same position we need to to join them with comma
      // only if live-execution else ignore
      // TODO: test for not live maybe needed since events are fed one-by-one now
      let sameEls: Event[] = [];
      if (live) {
        sameEls = [...get().executedEvents]
          .reverse()
          .filter(
            (elem) =>
              elem.node_id === execEvent.node_id &&
              elem.type === execEvent.type &&
              elem.job_id === execEvent.job_id
          );
      }

      // DOC: calculate the numbers the label will contain
      const tempLabel: string =
        sameEls.length > 0 ? sameEls.map((elem) => elem.id).join(',') : '';

      let execNodes: EwoksRFNode[] = [];

      // calculate the executing ones and add the executing param.
      // TODO: test later when execution accecible for using a Set
      // Not a set because maybe it needs a complex id
      /* eslint-disable unicorn/prefer-set-has */
      const executingIds: (string | undefined)[] = newExecutingEvents.map(
        (ev) => ev.node_id
      );

      execNodes = [
        ...get()
          .graphRF.nodes.filter((nod) => !executingIds.includes(nod.id))
          .map((no) => {
            return { ...no, data: { ...no.data, executing: false } };
          }),
        ...get()
          .graphRF.nodes.filter((nod) => executingIds.includes(nod.id))
          .map((no) => {
            return { ...no, data: { ...no.data, executing: true } };
          }),
      ];
      // if execution goes back to the same node it needs to delete the previous
      // ExecutionStepNode with the old number before putting the new node

      // If not in execution dont affect the canvas
      // TODO: if not the specific job_id dont affect the canvas in case of viewing
      // the same workflow_id but another job while some others are being executed
      const nodess = [
        ...execNodes.filter(
          (nod) =>
            !(
              // todo: changed the node_id and can affect execution
              (
                nod.id === execEvent.node_id &&
                nod.data.ui_props.type === execEvent.type
              )
            )
        ),
        {
          data: {
            ewoks_props: {
              label: `${tempLabel},${(execEvent.id as unknown) as string}`,
            },
            task_props: {
              task_type: 'executionSteps',
              task_identifier: execEvent.id?.toString() || '',
            },
            ui_props: {},
            event: execEvent,
          },
          id: execEvent.time || '',

          type: 'executionSteps',
          // calculate position based on node_id -> node position + start or stop
          position: tempPos,
        }, // TODO: clear this casting when deal with execution
      ];
      // console.log(newExecutingEvents, nodess);
      if (get().inExecutionMode) {
        set((state) => ({
          ...state,
          // only for testing set graphRF
          graphRF: {
            ...get().graphRF,
            nodes: nodess,
          },
          executingEvents: newExecutingEvents,
        }));
      }
    }
    // else if (execEvent.context === 'job') {
    //   // TODO: Terminate the execution and exit executionMode
    //   // If tasks still exist in executing raise an error?
    // }
  },
});

export default executingEvents;

function calcNewExecutingEvents(
  execEvent: Event,
  prevExecutingEvents: Event[]
): Event[] {
  let newExecutingEvents: Event[] = [];

  // TBD add else
  if (execEvent.type === 'start') {
    // add to executing events
    return [...prevExecutingEvents, execEvent];
  }

  // remove from executing events
  // used event.id to be examined?? Examine if the following for the end event are needed
  const eventToRemove = [...prevExecutingEvents]
    .map((ev) => ev.id)
    .indexOf(execEvent.id);

  if (eventToRemove > -1) {
    newExecutingEvents = [...prevExecutingEvents].splice(eventToRemove, 1);
  }

  newExecutingEvents = [...prevExecutingEvents].filter(
    (ev) => ev.node_id !== execEvent.node_id
  );
  return newExecutingEvents;
}

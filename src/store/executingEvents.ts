// import { ExecutingEvent } from '../types';

const executingEvents = (set, get) => ({
  executingEvents: [],

  setExecutingEvents: (execEvent) => {
    const prevState = get((prev) => prev);
    // console.log(execEvent, prevState.executingEvents);

    if (execEvent.context === 'node') {
      // Do the rest for nodes
      console.log('event for node');
    } else if (execEvent.context === 'workflow') {
      // Terminate the execution and exit executionMode
      // If tasks still exist in executing raise an error
      console.log('event for workflow');
    }

    let newExecutingEvents = [];
    if (execEvent.type === 'start') {
      // add to executing events
      newExecutingEvents = [...prevState.executingEvents, execEvent];
    } else if (execEvent.type === 'stop') {
      // remove from executing events
      // TODO removing based on node_id may be wrong as
      // there maybe more than one running in parallel
      newExecutingEvents = [...prevState.executingEvents].filter(
        (ev) => ev.node_id !== execEvent.node_id
      );
    }

    // ----if (execEvent.context === 'node') {
    let tempPos = { x: 100, y: 100 };

    const tempNode = prevState.graphRF.nodes.find(
      (nod) =>
        nod.id === execEvent.node_id &&
        nod.task_identifier === execEvent.task_id
    );
    console.log(tempNode, execEvent, prevState.graphRF.nodes);

    if ([null, undefined, ''].includes(tempNode)) {
      console.log('Node not found in current Graph');
      return;
    }

    tempPos = tempNode.position;

    const { withLabel } = tempNode.data;

    if (execEvent.type === 'start') {
      tempPos = { x: tempPos.x - 30, y: tempPos.y + 30 };
    } else if (withLabel) {
      tempPos = { x: tempPos.x + 140, y: tempPos.y + 30 };
    } else {
      tempPos = { x: tempPos.x + 95, y: tempPos.y + 30 };
    }

    // if there are other nodes for the same position we need to to join them with comma
    const sameEls = [...prevState.executingEvents]
      .reverse()
      .filter(
        (elem) =>
          elem.node_id === execEvent.node_id && elem.type === execEvent.type
      );

    const tempLabel: string =
      sameEls.length > 0 ? sameEls.map((elem) => elem.id).join(',') : '';

    let execNodes = [];

    // calculate the executing ones and add the executing param. No executing
    // executing = prevState.executingEvents
    // Not a set beacause maybe it needs a complex id
    // eslint-disable-next-line unicorn/prefer-set-has
    const executingIds = newExecutingEvents.map((ev) => ev.node_id);
    console.log(executingIds, tempLabel);
    // if (execEvent.executing.length > 0) {
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
    console.log(execNodes);
    // }
    // if execution goes back to the same node it needs to delete the previous
    // ExecutionStepNode with the old number before putting the new node
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
              label: `${tempLabel},${execEvent.node_id as string}`,
              node_id: execEvent.node_id,
              type: execEvent.type,
              values: { a: 1, b: 2 },
            },
            id: execEvent.id,
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
  },
});

export default executingEvents;

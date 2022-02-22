import { ExecutingEvent } from '../types';

const executingEvents = (set, get) => ({
  executingEvents: [],

  setExecutingEvents: (execEvent) => {
    const prevState = get((prev) => prev);
    console.log(execEvent, prevState.executingEvents);

    let tempPos = { x: 100, y: 100 };

    const tempNode = prevState.graphRF.nodes.find(
      (nod) => nod.id === execEvent.nodeId
    );

    tempPos = tempNode.position;

    const withLabel = tempNode.data.withLabel;

    if (execEvent.event_type === 'start')
      tempPos = { x: tempPos.x - 30, y: tempPos.y + 30 };
    else if (withLabel) tempPos = { x: tempPos.x + 140, y: tempPos.y + 30 };
    else tempPos = { x: tempPos.x + 95, y: tempPos.y + 30 };

    // if there are other nodes for the same position we need to to join them with comma
    const sameEls = [...prevState.executingEvents]
      .reverse()
      .filter(
        (elem) =>
          elem.nodeId === execEvent.nodeId &&
          elem.event_type === execEvent.event_type
      );
    console.log(prevState.executingEvents, sameEls);
    const tempLabel =
      sameEls.length > 0 ? sameEls.map((elem) => elem.id).join(',') : '';

    let execNodes = [];
    // calculate the executing ones and add the executing param.
    if (execEvent.executing.length > 0) {
      execNodes = [
        ...prevState.graphRF.nodes
          .filter((nod) => !execEvent.executing.includes(nod.id))
          .map((no) => {
            return { ...no, data: { ...no.data, executing: false } };
          }),
        ...prevState.graphRF.nodes
          .filter((nod) => execEvent.executing.includes(nod.id))
          .map((no) => {
            return { ...no, data: { ...no.data, executing: true } };
          }),
      ];
    }
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
                nod.data.nodeId === execEvent.nodeId &&
                nod.data.event_type === execEvent.event_type
              )
          ),
          {
            data: {
              label: `${tempLabel},${execEvent.id}`,
              nodeId: execEvent.nodeId,
              event_type: execEvent.event_type,
              values: { a: 1, b: 2 },
            },
            id: execEvent.id,
            task_type: 'executionSteps',
            task_identifier: execEvent.id,
            type: 'executionSteps',
            // calculate position based on nodeId -> node position + start or stop
            position: tempPos,
          },
        ],
      },
      executingEvents: [...prevState.executingEvents, execEvent],
    }));
  },
});

export default executingEvents;

export default function isValidLink(connection, graphRF) {
  let isValid = true;
  let reason = '';

  const source = graphRF.nodes.find((nod) => nod.id === connection.source);
  const target = graphRF.nodes.find((nod) => nod.id === connection.target);

  // check if there is already a link using this graph-input
  if (
    ['graphInput'].includes(source.task_type) &&
    graphRF.links.some((link) => link.source === source.id)
  ) {
    isValid = false;
    reason = 'Cannot connect an input with more than one node';
  }
  // check if there is already a link using this graph-output
  if (
    ['graphOutput'].includes(target.task_type) &&
    graphRF.links.some((link) => link.target === target.id)
  ) {
    isValid = false;
    reason = 'Cannot connect an output with more than one node';
  }

  // if two nodes are already connected
  // TODO:have to take into account if one or both nodes that need connection are graphs
  // if graph take into account the exact sourceHandle or targetHandle
  // if not.a.graph dont take into account the Handlers
  if (
    (source.type !== 'graph' &&
      target.type !== 'graph' &&
      graphRF.links.some(
        (link) =>
          link.source === connection.source && link.target === connection.target
      )) ||
    (source.type === 'graph' &&
      target.type !== 'graph' &&
      graphRF.links.some(
        (link) =>
          link.source === connection.source &&
          link.target === connection.target &&
          (link.sourceHandle.slice(0, -5) === connection.sourceHandle ||
            link.sourceHandle === connection.sourceHandle.slice(0, -5) ||
            link.sourceHandle === connection.sourceHandle)
      )) ||
    (source.type !== 'graph' &&
      target.type === 'graph' &&
      graphRF.links.some(
        (link) =>
          link.source === connection.source &&
          link.target === connection.target &&
          (link.targetHandle.slice(0, -6) === connection.targetHandle ||
            link.targetHandle === connection.targetHandle.slice(0, -6) ||
            link.targetHandle === connection.targetHandle)
      ))
  ) {
    isValid = false;
    reason = `Cannot re-connect two nodes. Use data mapping instead in order to
      map different values on the same link!`;
  }

  return { isValid, reason };
}

export default function isValidLink(connection, graphRF) {
  let isValid = true;
  let reason = '';
  // from source and target see
  const source = graphRF.nodes.find((nod) => nod.id === connection.source);
  const target = graphRF.nodes.find((nod) => nod.id === connection.target);
  // if it is Input-Output
  if (
    (['graphOutput', 'graphInput'].includes(source.task_type) ||
      ['graphOutput', 'graphInput'].includes(target.task_type)) &&
    (graphRF.links.some((link) => link.source === source.id) ||
      graphRF.links.some((link) => link.target === target.id))
  ) {
    isValid = false;
    reason = 'Cannot connect an input or an output with more than one node';
  }
  // if two nodes are already connected
  if (
    graphRF.links.some(
      (link) =>
        link.source === connection.source && link.target === connection.target
    )
  ) {
    isValid = false;
    reason =
      'Cannot re-connect two nodes. Use data mapping instead to map different values on the same link!';
  }

  return { isValid, reason };
}

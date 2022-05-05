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
  // console.log(source, target, connection);
  // if (
  //   graphRF.links.some(
  //     (link) => source.type !== 'graph' && target.type !== 'graph'
  //   )
  //   // if (
  //   //   graphRF.links.some((link) => {
  //   //     if (source.type !== 'graph' && target.type !== 'graph') {
  //   //       return (
  //   //         link.source === connection.source && link.target === connection.target
  //   //         // link.sourceHandle === connection.sourceHandle &&
  //   //         // link.targetHandle === connection.targetHandle
  //   //       );
  //   //     } else if (source.type === 'graph' && target.type !== 'graph') {
  //   //       return (
  //   //         link.source === connection.source &&
  //   //         link.target === connection.target &&
  //   //         // link.sourceHandle === connection.sourceHandle &&
  //   //         link.targetHandle === connection.targetHandle
  //   //       );
  //   //     }
  //   //     return false;
  //   //   })
  // ) {
  //   isValid = false;
  //   reason = `Cannot re-connect two nodes. Use data mapping instead in order to
  //     map different values on the same link!`;
  // }
  if (
    graphRF.links.some(
      (link) =>
        link.source === connection.source && link.target === connection.target
    )
  ) {
    isValid = false;
    reason = `Cannot re-connect two nodes. Use data mapping instead in order to
      map different values on the same link!`;
  }

  return { isValid, reason };
}

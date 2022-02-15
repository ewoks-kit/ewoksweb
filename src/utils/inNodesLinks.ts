// calc the input nodes and links that need to be added to the graph from
// the input_nodes
export function inNodesLinks(graph) {
  const inputs = { nodes: [], links: [] };
  if (
    graph.graph &&
    graph.graph.input_nodes &&
    graph.graph.input_nodes.length > 0
  ) {
    const inNodesInputed = [];
    graph.graph.input_nodes.forEach((inNod) => {
      const nodeTarget = graph.nodes.find((no) => no.id === inNod.node);
      if (nodeTarget) {
        const temPosition = (inNod.uiProps && inNod.uiProps.position) || {
          x: 50,
          y: 50,
        };
        if (!inNodesInputed.includes(inNod.id)) {
          inputs.nodes.push({
            id: inNod.id,
            label:
              inNod.uiProps && inNod.uiProps.label
                ? inNod.uiProps.label
                : inNod.id,
            task_type: 'graphInput',
            task_identifier: 'Start-End',
            position: temPosition,
            uiProps: {
              type: 'input',
              position: temPosition,
              icon: 'graphInput',
              withImage: inNod.uiProps && inNod.uiProps.withImage,
              withLabel: inNod.uiProps && inNod.uiProps.withLabel,
              colorBorder: inNod.uiProps && inNod.uiProps.colorBorder,
            },
          });
          inNodesInputed.push(inNod.id);
        }

        inputs.links.push({
          startEnd: true,
          source: inNod.id,
          target: inNod.node,
          sub_target: nodeTarget.task_type !== 'graph' ? '' : inNod.sub_node,
          conditions:
            inNod.link_attributes && inNod.link_attributes.conditions
              ? inNod.link_attributes.conditions
              : [],
          uiProps: {
            label:
              inNod.link_attributes && inNod.link_attributes.label
                ? inNod.link_attributes.label
                : '',
            type: (inNod.uiProps && inNod.uiProps.linkStyle) || 'default',
            arrowHeadType: 'arrowclosed',
            withImage: inNod.uiProps && inNod.uiProps.withImage,
            withLabel: inNod.uiProps && inNod.uiProps.withLabel,
            colorLink: inNod.uiProps && inNod.uiProps.colorLink,
          },
        });
      }
    });
  }
  return inputs;
}

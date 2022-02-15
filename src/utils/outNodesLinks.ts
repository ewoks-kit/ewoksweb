// calc the output nodes and links that need to be added to the graph from the output_nodes
export function outNodesLinks(graph) {
  const outputs = { nodes: [], links: [] };
  if (
    graph.graph &&
    graph.graph.output_nodes &&
    graph.graph.output_nodes.length > 0
  ) {
    const outNodesInputed = [];
    graph.graph.output_nodes.forEach((outNod) => {
      // console.log(outNod);
      // if we need position to control showing in-out as nodes in th graph
      // if (outNod.uiProps && outNod.uiProps.position) {
      const nodeSource = graph.nodes.find((no) => no.id === outNod.node);

      if (!outNodesInputed.includes(outNod.id)) {
        const temPosition = (outNod.uiProps && outNod.uiProps.position) || {
          x: 1250,
          y: 450,
        };
        outputs.nodes.push({
          id: outNod.id,
          label:
            outNod.uiProps && outNod.uiProps.label
              ? outNod.uiProps.label
              : outNod.id,
          task_type: 'graphOutput',
          task_identifier: 'Start-End',
          position: temPosition,
          uiProps: {
            type: 'output',
            position: temPosition,
            icon: 'graphOutput',
            withImage: outNod.uiProps && outNod.uiProps.withImage,
            withLabel: outNod.uiProps && outNod.uiProps.withLabel,
            colorBorder: outNod.uiProps && outNod.uiProps.colorBorder,
          },
        });
        outNodesInputed.push(outNod.id);
      }
      outputs.links.push({
        startEnd: true,
        source: outNod.node,
        target: outNod.id,
        sub_source: nodeSource.task_type !== 'graph' ? '' : outNod.sub_node,
        conditions:
          outNod.link_attributes && outNod.link_attributes.conditions
            ? outNod.link_attributes.conditions
            : [],
        uiProps: {
          label:
            'link_attributes' in outNod && outNod.link_attributes.label
              ? outNod.link_attributes.label
              : '',
          type: (outNod.uiProps && outNod.uiProps.linkStyle) || 'default',
          arrowHeadType: 'arrowclosed',
          withImage: outNod.uiProps && outNod.uiProps.withImage,
          withLabel: outNod.uiProps && outNod.uiProps.withLabel,
          colorBorder: outNod.uiProps && outNod.uiProps.colorBorder,
        },
      });
      // }
    });
  }
  return outputs;
}

import existsOrValue from './existsOrValue';

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
        const temPosition = existsOrValue(inNod.uiProps, 'position', {
          x: 50,
          y: 50,
        });

        if (!inNodesInputed.includes(inNod.id)) {
          inputs.nodes.push({
            id: inNod.id,
            label: existsOrValue(inNod.uiProps, 'label', inNod.id),
            task_type: 'graphInput',
            task_identifier: 'Start-End',
            position: temPosition,
            uiProps: {
              type: 'input',
              position: temPosition,
              icon: 'graphInput',
              withImage: existsOrValue(inNod.uiProps, 'withImage', true),
              withLabel: existsOrValue(inNod.uiProps, 'withLabel', true),
              colorBorder: existsOrValue(inNod.uiProps, 'colorBorder', ''),
            },
          });
          inNodesInputed.push(inNod.id);
        }

        inputs.links.push({
          startEnd: true,
          source: inNod.id,
          target: inNod.node,
          sub_target: nodeTarget.task_type !== 'graph' ? '' : inNod.sub_node,
          conditions: existsOrValue(inNod.link_attributes, 'conditions', []),
          data_mapping: existsOrValue(
            inNod.link_attributes,
            'data_mapping',
            []
          ),
          on_error: existsOrValue(inNod.link_attributes, 'on_error', false),
          map_all_data: existsOrValue(
            inNod.link_attributes,
            'map_all_data',
            false
          ),
          uiProps: {
            label: existsOrValue(inNod.link_attributes, 'label', ''),
            comment: existsOrValue(inNod.link_attributes, 'comment', ''),
            style: {
              stroke: existsOrValue(inNod.uiProps?.style, 'stroke', ''),
            },
            type: existsOrValue(inNod.uiProps, 'linkStyle', 'default'),
            markerEnd: () => {
              let type = {};
              if (inNod.uiProps?.markerEnd?.type) {
                type = { type: inNod.uiProps.markerEnd.type };
              }
              return type;
              // type: existsOrValue(inNod.uiProps?.markerEnd, 'type', 'arrow'),
            },
            animated: existsOrValue(inNod.uiProps, 'animated', false),
            withImage: existsOrValue(inNod.uiProps, 'withImage', true),
            withLabel: existsOrValue(inNod.uiProps, 'withLabel', true),
            colorBorder: existsOrValue(inNod.uiProps, 'colorBorder', ''),
          },
        });
      }
    });
  }
  return inputs;
}

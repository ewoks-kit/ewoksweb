import type { EwoksLink, EwoksNode, GraphEwoks } from '../types';

// TODO: merge with outNodesLinks if possible when stable
// DOC: calc the input nodes and links that need to be added to the graph from
// the input_nodes in the Ewoks graph model
export function inNodesLinks(
  graph: GraphEwoks
): { nodes: EwoksNode[]; links: EwoksLink[] } {
  const inputs: { nodes: EwoksNode[]; links: EwoksLink[] } = {
    nodes: [],
    links: [],
  };
  if (graph.graph.input_nodes && graph.graph.input_nodes.length > 0) {
    const inNodesInputed: string[] = [];
    graph.graph.input_nodes.forEach((inNod) => {
      const nodeTarget = graph.nodes.find((no) => no.id === inNod.node);

      const temPosition = inNod.uiProps?.position ?? {
        x: 50,
        y: 50,
      };

      if (!inNodesInputed.includes(inNod.id)) {
        inputs.nodes.push({
          id: inNod.id,
          label: inNod.uiProps?.label ?? inNod.id,
          task_type: 'graphInput',
          // TODO: This Start-End shouldn't be used to make decisions
          // as it is user-edited in custom Tasks
          task_identifier: 'Start-End',
          uiProps: {
            type: 'input',
            position: temPosition,
            icon: 'graphInput.svg',
            withImage: inNod.uiProps?.withImage ?? true,
            withLabel: inNod.uiProps?.withLabel ?? true,
            colorBorder: inNod.uiProps?.colorBorder ?? '',
            nodeWidth: inNod.uiProps?.nodeWidth ?? 110,
          },
        });
        inNodesInputed.push(inNod.id);
      }

      inputs.links.push({
        startEnd: true,
        source: inNod.id,
        target: inNod.node,
        sub_target: nodeTarget?.task_type !== 'graph' ? '' : inNod.sub_node,
        conditions: inNod.link_attributes?.conditions ?? [],
        data_mapping: inNod.link_attributes?.data_mapping ?? [],
        on_error: inNod.link_attributes?.on_error ?? false,
        map_all_data: inNod.link_attributes?.map_all_data ?? false,
        required: inNod.link_attributes?.required,
        uiProps: {
          label: inNod.link_attributes?.label ?? '',
          comment: inNod.link_attributes?.comment ?? '',
          style: { stroke: inNod.uiProps?.style?.stroke ?? '' },
          type: inNod.uiProps?.linkStyle ?? 'default',
          markerEnd: inNod.uiProps?.markerEnd,
          animated: inNod.uiProps?.animated ?? false,
        },
      });
    });
  }
  return inputs;
}

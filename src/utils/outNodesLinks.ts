import type { EwoksLink, EwoksNode, GraphEwoks } from '../types';

function calcMarkerEnd(inNod) {
  let type = {};
  if (inNod.uiProps?.markerEnd?.type) {
    type = { type: inNod.uiProps.markerEnd.type };
  } else {
    type = '';
  }
  return type;
}

// TODO: when stable compare to inNodesLinks and merge if possible
// DOC: calc the output nodes and links that need to be added to
// the graph from the output_nodes
export function outNodesLinks(
  graph: GraphEwoks
): { nodes: EwoksNode[]; links: EwoksLink[] } {
  const outputs = { nodes: [], links: [] };
  if (graph?.graph?.output_nodes?.length > 0) {
    const outNodesInputed = [];
    graph.graph.output_nodes.forEach((outNod) => {
      const nodeSource = graph.nodes.find((no) => no.id === outNod.node);

      if (!outNodesInputed.includes(outNod.id)) {
        const temPosition = outNod.uiProps?.position ?? {
          x: 1250,
          y: 450,
        };

        outputs.nodes.push({
          id: outNod.id,
          label: outNod.uiProps?.label ?? outNod.id,
          task_type: 'graphOutput',
          task_identifier: 'Start-End',
          position: temPosition,
          uiProps: {
            type: 'output',
            position: temPosition,
            icon: 'graphOutput.svg',
            withImage: outNod.uiProps?.withImage ?? true,
            withLabel: outNod.uiProps?.withLabel ?? true,
            colorBorder: outNod.uiProps?.colorBorder ?? '',
            nodeWidth: outNod.uiProps?.nodeWidth ?? 110,
          },
        });

        outNodesInputed.push(outNod.id);
      }
      outputs.links.push({
        startEnd: true,
        source: outNod.node,
        target: outNod.id,
        sub_source: !nodeSource
          ? ''
          : nodeSource.task_type !== 'graph'
          ? ''
          : outNod.sub_node,
        conditions: outNod.link_attributes?.conditions ?? [],
        data_mapping: outNod.link_attributes?.data_mapping ?? [],
        on_error: outNod.link_attributes?.on_error ?? false,
        map_all_data: outNod.link_attributes?.map_all_data ?? false,
        uiProps: {
          label: outNod.link_attributes?.label ?? '',
          comment: outNod.link_attributes?.comment ?? '',
          style: {
            stroke: outNod.uiProps?.style?.stroke ?? '',
          },
          type: outNod.uiProps?.linkStyle ?? 'default',
          markerEnd: calcMarkerEnd(outNod),
          animated: outNod.uiProps?.animated ?? false,
          withImage: outNod.uiProps?.withImage ?? true,
          withLabel: outNod.uiProps?.withLabel ?? true,
          colorBorder: outNod.uiProps?.colorBorder ?? '',
          nodeWidth: outNod.uiProps?.nodeWidth ?? 110,
        },
      });
      // }
    });
  }
  return outputs;
}

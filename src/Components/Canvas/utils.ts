import type { Connection } from 'reactflow';
import { MarkerType } from 'reactflow';
import type { EwoksRFLink, GraphRF } from '../../types';

export function trimLabel(label: string) {
  if (label.length <= 20) {
    return label;
  }

  return label.split('.').pop();
}

export function addConnectionToGraph(
  connection: Connection,
  graph: GraphRF
): GraphRF {
  const { source, target, sourceHandle, targetHandle } = connection;

  if (!source || !target) {
    return graph;
  }

  const sourceTask = graph.nodes.find((nod) => nod.id === connection.source);
  const targetTask = graph.nodes.find((nod) => nod.id === connection.target);

  if (!sourceTask || !targetTask) {
    return graph;
  }

  const link: EwoksRFLink = {
    data: {
      startEnd:
        sourceTask.data.task_props.task_type === 'graphInput' ||
        targetTask.data.task_props.task_type === 'graphOutput',
      getAroundProps: { x: 0, y: 0 },
      on_error: false,
      comment: '',
      // DOC: node optional_input_names are link's optional_output_names
      links_optional_output_names:
        targetTask.data.task_props.optional_input_names || [],
      // DOC: node required_input_names are link's required_output_names
      links_required_output_names:
        targetTask.data.task_props.required_input_names || [],
      // DOC: node output_names are link's input_names
      links_input_names: sourceTask.data.task_props.output_names || [],
      conditions: [],
      data_mapping: [],
      map_all_data:
        ['ppfmethod', 'ppfport'].includes(
          sourceTask.data.task_props.task_type
        ) ||
        ['ppfmethod', 'ppfport'].includes(targetTask.data.task_props.task_type),
      sub_source:
        sourceTask.data.task_props.task_type === 'graph' && sourceHandle
          ? sourceHandle
          : '',
      sub_target:
        targetTask.data.task_props.task_type === 'graph' && targetHandle
          ? targetHandle
          : '',
    },
    id: `${source}:${sourceHandle || ''}->${target}:${targetHandle || ''}`,
    label: '',
    source,
    target,
    sourceHandle: sourceHandle ?? undefined,
    targetHandle: targetHandle ?? undefined,
    type: 'default',
    animated: false,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#96a5f9', strokeWidth: '2.5' },
    labelBgStyle: {
      fill: 'rgb(223, 226, 247)',
      color: 'rgb(50, 130, 219)',
      fillOpacity: 1,
    },
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelStyle: { fill: 'blue', fontWeight: 500, fontSize: 14 },
  };

  return {
    graph: graph.graph,
    nodes: graph.nodes,
    links: [...graph.links, link],
  };
}

import type { EwoksLink, EwoksNode, GraphEwoks } from '../types';
import { propIsEmpty } from './CalcGraphInputsOutputs';
import { DEFAULT_LINK_VALUES } from './defaultValues';

// DOC: calc the output nodes and links that need to be added to
// the graph from the output_nodes
export function outNodesLinks(
  graph: GraphEwoks
): { nodes: EwoksNode[]; links: EwoksLink[] } {
  const outputs: { nodes: EwoksNode[]; links: EwoksLink[] } = {
    nodes: [],
    links: [],
  };
  if (graph.graph.output_nodes && graph.graph.output_nodes.length > 0) {
    const outNodesInputed: string[] = [];
    graph.graph.output_nodes.forEach((outNod) => {
      const nodeSource = graph.nodes.find((no) => no.id === outNod.node);

      const uIProps = outNod.uiProps;

      if (!outNodesInputed.includes(outNod.id)) {
        const temPosition = uIProps?.position ?? {
          x: 1250,
          y: 450,
        };

        outputs.nodes.push({
          id: outNod.id,
          label: uIProps?.label ?? outNod.id,
          task_type: 'graphOutput',
          task_identifier: 'Start-End',
          uiProps: {
            type: 'output',
            position: temPosition,
            icon: 'graphOutput.svg',
            ...(uIProps?.withImage && { withImage: uIProps.withImage }),
            ...(uIProps?.withLabel && { withLabel: uIProps.withLabel }),
            ...(uIProps?.colorBorder && { colorBorder: uIProps.colorBorder }),
            ...(uIProps?.nodeWidth && { nodeWidth: uIProps.nodeWidth }),
          },
        });
        outNodesInputed.push(outNod.id);
      }

      if (outNod.node) {
        const linkAttr = outNod.link_attributes;

        const linksUiProps = {
          ...(linkAttr?.label && { label: linkAttr.label }),
          ...(linkAttr?.comment && { comment: linkAttr.comment }),
          ...(uIProps?.style?.stroke && {
            style: { stroke: uIProps.style.stroke, strokeWidth: '3px' },
          }),
          ...(uIProps?.markerEnd &&
            typeof uIProps.markerEnd !== 'string' &&
            uIProps.markerEnd.type !==
              DEFAULT_LINK_VALUES.uiProps.markerEnd.type && {
              markerEnd: uIProps.markerEnd,
            }),
          ...(uIProps?.animated && { animated: uIProps.animated }),
        };

        outputs.links.push({
          startEnd: true,
          source: outNod.node,
          target: outNod.id,
          ...(nodeSource?.task_type === 'graph' &&
            outNod.sub_node && { sub_source: outNod.sub_node }),
          ...(linkAttr?.conditions &&
            linkAttr.conditions.length > 0 && {
              conditions: linkAttr.conditions,
            }),
          ...(linkAttr?.data_mapping &&
            linkAttr.data_mapping.length > 0 && {
              data_mapping: linkAttr.data_mapping,
            }),
          ...(linkAttr?.on_error && {
            on_error: linkAttr.on_error,
          }),
          ...(linkAttr?.map_all_data && {
            map_all_data: linkAttr.map_all_data,
          }),
          ...(linkAttr?.required && {
            required: linkAttr.required,
          }),
          ...(!propIsEmpty(linksUiProps) && {
            uiProps: linksUiProps,
          }),
        });
      }
    });
  }
  return outputs;
}

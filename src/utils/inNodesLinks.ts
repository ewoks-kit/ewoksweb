import type { EwoksLink, EwoksNode, GraphEwoks } from '../types';
import { propIsEmpty } from './CalcGraphInputsOutputs';
import { DEFAULT_LINK_VALUES } from './defaultValues';
import { notUndefinedValue } from './utils';

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

      const uIProps = inNod.uiProps;

      if (!inNodesInputed.includes(inNod.id)) {
        const temPosition = inNod.uiProps?.position ?? {
          x: 50,
          y: 50,
        };

        inputs.nodes.push({
          id: inNod.id,
          label: inNod.uiProps?.label ?? inNod.id,
          task_type: 'graphInput',
          task_identifier: 'Start-End',
          uiProps: {
            type: 'input',
            position: temPosition,
            icon: 'graphInput.svg',
            ...notUndefinedValue(uIProps?.withImage, 'withImage'),
            ...notUndefinedValue(uIProps?.withLabel, 'withLabel'),
            ...(uIProps?.colorBorder && { colorBorder: uIProps.colorBorder }),
            ...(uIProps?.nodeWidth && { nodeWidth: uIProps.nodeWidth }),
          },
        });
        inNodesInputed.push(inNod.id);
      }

      if (inNod.node) {
        const linkAttr = inNod.link_attributes;

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
          ...notUndefinedValue(uIProps?.animated, 'animated'),
        };

        inputs.links.push({
          startEnd: true,
          source: inNod.id,
          target: inNod.node,
          ...(nodeTarget?.task_type === 'graph' &&
            inNod.sub_node && { sub_target: inNod.sub_node }),
          ...(linkAttr?.conditions &&
            linkAttr.conditions.length > 0 && {
              conditions: linkAttr.conditions,
            }),
          ...(linkAttr?.data_mapping &&
            linkAttr.data_mapping.length > 0 && {
              data_mapping: linkAttr.data_mapping,
            }),
          ...notUndefinedValue(linkAttr?.on_error, 'on_error'),
          ...notUndefinedValue(linkAttr?.map_all_data, 'map_all_data'),
          ...notUndefinedValue(linkAttr?.required, 'required'),
          ...(!propIsEmpty(linksUiProps) && {
            uiProps: linksUiProps,
          }),
        });
      }
    });
  }
  return inputs;
}

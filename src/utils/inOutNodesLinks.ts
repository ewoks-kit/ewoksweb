import type { EwoksLink, EwoksNode, GraphNodes } from '../types';
import { propIsEmpty } from './CalcGraphInputsOutputs';
import { DEFAULT_LINK_VALUES } from './defaultValues';

// DOC: calc the input-output nodes and links that need to be added
// to the graph from the input_nodes and outputs_nodes in the Ewoks graph model
export function inOutNodesLinks(
  inOutNodes: GraphNodes[] | undefined,
  nodes: EwoksNode[],
  inOrOut: string
): { nodes: EwoksNode[]; links: EwoksLink[] } {
  const inputsOutputs: { nodes: EwoksNode[]; links: EwoksLink[] } = {
    nodes: [],
    links: [],
  };
  if (inOutNodes && inOutNodes.length > 0) {
    const inOutNodesInputed: string[] = [];
    inOutNodes.forEach((inOutNod) => {
      const sourceOrTargetNode = nodes.find((no) => no.id === inOutNod.node);

      const uIProps = inOutNod.uiProps;

      const temPosition = uIProps?.position ?? {
        x: 50,
        y: 50,
      };

      if (!inOutNodesInputed.includes(inOutNod.id)) {
        inputsOutputs.nodes.push({
          id: inOutNod.id,
          label: uIProps?.label ?? inOutNod.id,
          task_type: inOrOut === 'inNodesLinks' ? 'graphInput' : 'graphOutput',
          task_identifier: 'Start-End',
          uiProps: {
            type: inOrOut === 'inNodesLinks' ? 'input' : 'output',
            position: temPosition,
            icon:
              inOrOut === 'inNodesLinks' ? 'graphInput.svg' : 'graphOutput.svg',
            ...(uIProps?.withImage !== undefined && {
              withImage: uIProps.withImage,
            }),
            ...(uIProps?.withLabel !== undefined && {
              withLabel: uIProps.withLabel,
            }),
            ...(uIProps?.colorBorder && {
              colorBorder: uIProps.colorBorder,
            }),
            ...(uIProps?.nodeWidth && {
              nodeWidth: uIProps.nodeWidth,
            }),
          },
        });
        inOutNodesInputed.push(inOutNod.id);
      }

      if (inOutNod.node) {
        const linkAttr = inOutNod.link_attributes;

        const linksUiProps = {
          ...(linkAttr?.label && { label: linkAttr.label }),
          ...(linkAttr?.comment && { comment: linkAttr.comment }),
          ...(uIProps?.style?.stroke &&
            uIProps.style.stroke !== DEFAULT_LINK_VALUES.uiProps.stroke && {
              style: { stroke: uIProps.style.stroke, strokeWidth: '3px' },
            }),
          ...(uIProps?.markerEnd &&
            typeof uIProps.markerEnd !== 'string' &&
            uIProps.markerEnd.type !==
              DEFAULT_LINK_VALUES.uiProps.markerEnd.type && {
              markerEnd: uIProps.markerEnd,
            }),
          ...(uIProps?.animated !== undefined && {
            animated: uIProps.animated,
          }),
        };

        const sourceTargetProps =
          inOrOut === 'inNodesLinks'
            ? {
                source: inOutNod.id,
                target: inOutNod.node,
              }
            : {
                source: inOutNod.node,
                target: inOutNod.id,
              };

        inputsOutputs.links.push({
          startEnd: true,
          ...sourceTargetProps,
          ...(sourceOrTargetNode?.task_type === 'graph' &&
            inOutNod.sub_node && { sub_target: inOutNod.sub_node }),
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
          ...(propIsEmpty(linksUiProps) && {
            uiProps: linksUiProps,
          }),
        });
      }
    });
  }
  return inputsOutputs;
}

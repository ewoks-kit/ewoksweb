import type {
  EdgeWithData,
  EwoksIOLinkAttributes,
  EwoksIONode,
  EwoksIONodeUiProps,
  GraphUiProps,
  NodeWithData,
} from '../types';
import { DEFAULT_LINK_VALUES } from './defaultValues';
import { isString } from './typeGuards';
import {
  calcDataMapping,
  convertRFMarkerEndToEwoks,
  notUndefinedValue,
  propIsEmpty,
} from './utils';

export function computeInputNodes(
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode[] {
  return nodes.flatMap((node) => {
    return node.data.task_props.task_type === 'graphInput'
      ? convertRFInputNodeToEwoks(node, nodes, links)
      : [];
  });
}

export function computeOutputNodes(
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode[] {
  return nodes.flatMap((node) => {
    return node.data.task_props.task_type === 'graphOutput'
      ? convertRFOutputNodeToEwoks(node, nodes, links)
      : [];
  });
}

function convertRFInputNodeToEwoks(
  thisNode: NodeWithData,
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode[] {
  const inputNodes: EwoksIONode[] = [];

  const connectedLinks = links.filter((link) => link.source === thisNode.id);

  for (const link of connectedLinks) {
    const connectedNode = nodes.find((node) => link.target === node.id);
    const linkAttributes = computeLinkAttributes(link);

    if (!connectedNode) {
      continue;
    }

    const subNode =
      connectedNode.data.task_props.task_type === 'graph' &&
      link.data.sub_target
        ? link.data.sub_target
        : undefined;

    inputNodes.push({
      id: thisNode.id,
      node: connectedNode.id,
      ...(subNode ? { sub_node: subNode } : {}),
      ...(!propIsEmpty(linkAttributes) && { link_attributes: linkAttributes }),
      uiProps: computeUiProps(thisNode, link),
    });
  }

  return inputNodes;
}

function convertRFOutputNodeToEwoks(
  rfOutputNode: NodeWithData,
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode[] {
  const outputNodes: EwoksIONode[] = [];

  const connectedLinks = links.filter(
    (link) => link.target === rfOutputNode.id,
  );

  for (const link of connectedLinks) {
    const connectedNode = nodes.find((node) => link.source === node.id);

    if (!connectedNode) {
      continue;
    }

    const subNode =
      connectedNode.data.task_props.task_type === 'graph' &&
      link.data.sub_source
        ? link.data.sub_source
        : undefined;

    const linkAttributes = computeLinkAttributes(link);
    outputNodes.push({
      id: rfOutputNode.id,
      node: connectedNode.id,
      ...(subNode ? { sub_node: subNode } : {}),
      ...(!propIsEmpty(linkAttributes) && { link_attributes: linkAttributes }),
      uiProps: computeUiProps(rfOutputNode, link),
    });
  }

  return outputNodes;
}

function computeLinkAttributes(link: EdgeWithData): EwoksIOLinkAttributes {
  const { data } = link;
  return {
    ...(isString(link.label) && { label: link.label }),
    ...(data.comment && { comment: data.comment }),
    ...(data.conditions &&
      data.conditions.length > 0 && {
        conditions: data.conditions.map((con) => {
          return {
            source_output: con.name,
            value: con.value,
          };
        }),
      }),
    ...(data.data_mapping &&
      data.data_mapping.length > 0 && {
        data_mapping: calcDataMapping(data.data_mapping),
      }),
    ...notUndefinedValue(data.map_all_data, 'map_all_data'),
    ...notUndefinedValue(data.on_error, 'on_error'),
    ...notUndefinedValue(data.required, 'required'),
  };
}

function computeUiProps(
  node: NodeWithData,
  link: EdgeWithData,
): EwoksIONodeUiProps {
  const ewoksMarkerEnd = convertRFMarkerEndToEwoks(link.markerEnd);
  const { ui_props: uiProps } = node.data;

  return {
    position: node.position,
    ...notUndefinedValue(node.data.ewoks_props.label, 'label'),
    ...notUndefinedValue(link.type, 'type'),
    ...(link.style?.stroke &&
      link.style.stroke !== DEFAULT_LINK_VALUES.uiProps.stroke && {
        style: {
          stroke: link.style.stroke,
        },
      }),
    ...(ewoksMarkerEnd ? { markerEnd: ewoksMarkerEnd } : {}),
    ...notUndefinedValue(link.animated, 'animated'),
    ...notUndefinedValue(uiProps.withImage, 'withImage'),
    ...notUndefinedValue(uiProps.withLabel, 'withLabel'),
    ...(uiProps.colorBorder && {
      colorBorder: uiProps.colorBorder,
    }),
    ...(uiProps.nodeWidth && {
      nodeWidth: uiProps.nodeWidth,
    }),
  };
}

export function enrichUiPropsWithNotes(
  uiProps: GraphUiProps | undefined,
  nodes: NodeWithData[],
): GraphUiProps | undefined {
  const notes = nodes
    .filter((nod) => nod.type === 'note')
    .map((noteNod) => {
      return {
        id: noteNod.id,
        label: noteNod.data.ewoks_props.label,
        comment: noteNod.data.comment,
        position: noteNod.position,
        nodeWidth: noteNod.data.ui_props.nodeWidth,
        colorBorder: noteNod.data.ui_props.colorBorder,
      };
    });

  if (notes.length === 0) {
    return uiProps;
  }

  return { ...uiProps, notes };
}

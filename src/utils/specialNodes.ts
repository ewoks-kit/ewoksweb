import type {
  EdgeWithData,
  EwoksIOLinkAttributes,
  EwoksIONode,
  EwoksNodeUiProps,
  NodeWithData,
  Note,
} from '../types';
import { isString } from './typeGuards';
import {
  calcDataMapping,
  convertRFMarkerEndToEwoks,
  hasDefinedFields,
  notUndefinedValue,
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
  return links
    .filter((link) => link.source === thisNode.id)
    .flatMap<EwoksIONode>((link) => {
      const connectedNode = nodes.find((node) => link.target === node.id);
      const linkAttributes = computeLinkAttributes(link);

      if (!connectedNode) {
        return [];
      }

      const subNode =
        connectedNode.data.task_props.task_type === 'graph' &&
        link.data.sub_target
          ? link.data.sub_target
          : undefined;

      return [
        {
          id: thisNode.id,
          node: connectedNode.id,
          ...(subNode ? { sub_node: subNode } : {}),
          ...(hasDefinedFields(linkAttributes) && {
            link_attributes: linkAttributes,
          }),
          uiProps: computeUiProps(thisNode, link),
        },
      ];
    });
}

function convertRFOutputNodeToEwoks(
  rfOutputNode: NodeWithData,
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode[] {
  return links
    .filter((link) => link.target === rfOutputNode.id)
    .flatMap<EwoksIONode>((link) => {
      const connectedNode = nodes.find((node) => link.source === node.id);

      if (!connectedNode) {
        return [];
      }

      const subNode =
        connectedNode.data.task_props.task_type === 'graph' &&
        link.data.sub_source
          ? link.data.sub_source
          : undefined;

      const linkAttributes = computeLinkAttributes(link);
      return [
        {
          id: rfOutputNode.id,
          node: connectedNode.id,
          ...(subNode ? { sub_node: subNode } : {}),
          ...(hasDefinedFields(linkAttributes) && {
            link_attributes: linkAttributes,
          }),
          uiProps: computeUiProps(rfOutputNode, link),
        },
      ];
    });
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
    ...(data.map_all_data && { map_all_data: data.map_all_data }),
    ...notUndefinedValue(data.on_error, 'on_error'),
    ...notUndefinedValue(data.required, 'required'),
  };
}

function computeUiProps(
  node: NodeWithData,
  link: EdgeWithData,
): EwoksNodeUiProps {
  const ewoksMarkerEnd = convertRFMarkerEndToEwoks(link.markerEnd);
  const { ui_props: uiProps } = node.data;

  return {
    position: node.position,
    width: node.width,
    height: node.height,
    ...notUndefinedValue(node.data.ewoks_props.label, 'label'),
    ...notUndefinedValue(link.type, 'type'),
    ...(link.style?.stroke && {
      style: {
        stroke: link.style.stroke,
      },
    }),
    ...(ewoksMarkerEnd ? { markerEnd: ewoksMarkerEnd } : {}),
    ...notUndefinedValue(link.animated, 'animated'),
    ...notUndefinedValue(uiProps.withImage, 'withImage'),
    ...notUndefinedValue(uiProps.withLabel, 'withLabel'),
    ...(uiProps.borderColor && {
      borderColor: uiProps.borderColor,
    }),
  };
}

export function computeNotes(nodes: NodeWithData[]): Note[] {
  return nodes
    .filter((nod) => nod.type === 'note')
    .map((node) => {
      return {
        id: node.id,
        label: node.data.ewoks_props.label,
        comment: node.data.comment,
        position: node.position,
        width: node.width,
        height: node.height,
        borderColor: node.data.ui_props.borderColor,
      };
    });
}

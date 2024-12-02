import type {
  EwoksIOLinkAttributes,
  EwoksIONode,
  EwoksNodeUiProps,
} from '../ewoksTypes';
import type { EdgeWithData, NodeWithData, Note } from '../types';
import { assertDefined, isString } from './typeGuards';
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
  return nodes
    .filter((node) => node.data.task_props.task_type === 'graphInput')
    .map((node) => convertRFInputNodeToEwoks(node, nodes, links));
}

export function computeOutputNodes(
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode[] {
  return nodes
    .filter((node) => node.data.task_props.task_type === 'graphOutput')
    .map((node) => convertRFOutputNodeToEwoks(node, nodes, links));
}

function convertRFInputNodeToEwoks(
  inputNode: NodeWithData,
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode {
  const connectedLink = links.find((link) => link.source === inputNode.id);

  if (!connectedLink) {
    return {
      id: inputNode.id,
      node: null,
      uiProps: computeNodeUiProps(inputNode),
    };
  }

  const connectedNode = nodes.find((node) => connectedLink.target === node.id);
  // Since a link needs two nodes to be created, this assertion should never fail
  assertDefined(connectedNode, `No node with id ${connectedLink.target}`);

  const linkAttributes = computeLinkAttributes(connectedLink);
  const subNode =
    connectedNode.data.task_props.task_type === 'graph' &&
    connectedLink.data.sub_target
      ? connectedLink.data.sub_target
      : undefined;

  return {
    id: inputNode.id,
    node: connectedNode.id,
    ...(subNode ? { sub_node: subNode } : {}),
    ...(hasDefinedFields(linkAttributes) && {
      link_attributes: linkAttributes,
    }),
    uiProps: computeUiProps(inputNode, connectedLink),
  };
}

function convertRFOutputNodeToEwoks(
  outputNode: NodeWithData,
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode {
  const connectedLink = links.find((link) => link.target === outputNode.id);

  if (!connectedLink) {
    return {
      id: outputNode.id,
      node: null,
      uiProps: computeNodeUiProps(outputNode),
    };
  }

  const connectedNode = nodes.find((node) => connectedLink.source === node.id);
  // Since a link needs two nodes to be created, this assertion should never fail
  assertDefined(connectedNode, `No node with id ${connectedLink.source}`);

  const linkAttributes = computeLinkAttributes(connectedLink);
  const subNode =
    connectedNode.data.task_props.task_type === 'graph' &&
    connectedLink.data.sub_source
      ? connectedLink.data.sub_source
      : undefined;

  return {
    id: outputNode.id,
    node: connectedNode.id,
    ...(subNode ? { sub_node: subNode } : {}),
    ...(hasDefinedFields(linkAttributes) && {
      link_attributes: linkAttributes,
    }),
    uiProps: computeUiProps(outputNode, connectedLink),
  };
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

  return {
    ...computeNodeUiProps(node),
    ...notUndefinedValue(link.type, 'type'),
    ...(link.style?.stroke && {
      style: {
        stroke: link.style.stroke,
      },
    }),
    ...(ewoksMarkerEnd ? { markerEnd: ewoksMarkerEnd } : {}),
    ...notUndefinedValue(link.animated, 'animated'),
  };
}

function computeNodeUiProps(node: NodeWithData): EwoksNodeUiProps {
  const { ui_props: uiProps } = node.data;

  return {
    position: node.position,
    width: node.width,
    height: node.height,
    ...notUndefinedValue(node.data.ewoks_props.label, 'label'),
    ...notUndefinedValue(uiProps.withImage, 'withImage'),
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

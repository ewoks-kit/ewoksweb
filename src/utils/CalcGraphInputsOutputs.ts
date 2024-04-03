import type {
  EdgeWithData,
  EwoksIOLinkAttributes,
  EwoksIONode,
  EwoksIONodeUiProps,
  GraphDetails,
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

export function computeInputOutputNodes(
  nodes: NodeWithData[],
  links: EdgeWithData[],
): Pick<GraphDetails, 'input_nodes' | 'output_nodes'> {
  let input_nodes: EwoksIONode[] = [];
  let output_nodes: EwoksIONode[] = [];

  nodes.forEach((node) => {
    if (node.data.task_props.task_type === 'graphInput') {
      input_nodes = [
        ...input_nodes,
        ...computeInputNodes(node, [...nodes], [...links]),
      ];
    }

    if (node.data.task_props.task_type === 'graphOutput') {
      output_nodes = [
        ...output_nodes,
        ...computeOutputNodes(node, [...nodes], [...links]),
      ];
    }
  });

  return {
    ...(input_nodes.length > 0 && {
      input_nodes,
    }),
    ...(output_nodes.length > 0 && {
      output_nodes,
    }),
  };
}

function computeInputNodes(
  nod: NodeWithData,
  graph_nodes: NodeWithData[],
  graph_links: EdgeWithData[],
): EwoksIONode[] {
  const nodes: EwoksIONode[] = [];

  let nodesNamesConnectedTo: string[] = [];

  // DOC: Find the nodes this INPUT node is connected to
  nodesNamesConnectedTo = graph_links
    .filter((link) => link.source === nod.id)
    .map((link) => link.target);

  // DOC: use an array for all nodes although ewoks allows only one for now
  const nodeObjConnectedTo: NodeWithData[] = [];
  for (const nodesNames of nodesNamesConnectedTo) {
    const nodeInGraph = graph_nodes.find((node) => nodesNames === node.id);
    if (nodeInGraph) {
      nodeObjConnectedTo.push(nodeInGraph);
    }
  }

  // DOC: Iterate the nodes to create the new input_nodes
  nodeObjConnectedTo.forEach((nodConnected) => {
    const link_index = graph_links.findIndex(
      (link) => link.source === nod.id && link.target === nodConnected.id,
    );

    nodes.push(
      computeIONode(
        nodConnected.data.task_props.task_type === 'graph',
        nod,
        nodConnected,
        graph_links[link_index],
        'graphInput',
      ),
    );
  });
  return nodes;
}

function computeOutputNodes(
  rawOutputNode: NodeWithData,
  nodes: NodeWithData[],
  links: EdgeWithData[],
): EwoksIONode[] {
  const output_nodes: EwoksIONode[] = [];

  const connectedNodesIds = links
    .filter((link) => link.target === rawOutputNode.id)
    .map((link) => link.source);

  for (const connectedNodeId of connectedNodesIds) {
    const connectedNode = nodes.find((node) => connectedNodeId === node.id);

    if (!connectedNode) {
      continue;
    }
    const connectingLink = links.find(
      (link) =>
        link.target === rawOutputNode.id && link.source === connectedNodeId,
    );
    if (!connectingLink) {
      continue;
    }

    const subNode =
      connectedNode.data.task_props.task_type === 'graph' &&
      connectingLink.data.sub_source
        ? connectingLink.data.sub_source
        : undefined;

    const linkAttributes = computeLinkAttributes(connectingLink);
    output_nodes.push({
      id: rawOutputNode.id,
      node: connectedNode.id,
      ...(subNode ? { sub_node: subNode } : {}),
      ...(!propIsEmpty(linkAttributes) && { link_attributes: linkAttributes }),
      uiProps: computeUiProps(rawOutputNode, connectingLink),
    });
  }

  return output_nodes;
}

function computeIONode(
  isGraph: boolean,
  node: NodeWithData,
  nodConnected: NodeWithData,
  link: EdgeWithData,
  inputOrOutput: 'graphInput',
): EwoksIONode {
  const linkAttributes = computeLinkAttributes(link);

  return {
    id: node.id,
    node: nodConnected.id,
    sub_node: isGraph
      ? (inputOrOutput === 'graphOutput'
          ? link.data.sub_source
          : link.data.sub_target) || undefined
      : undefined,
    ...(!propIsEmpty(linkAttributes) && { link_attributes: linkAttributes }),
    uiProps: computeUiProps(node, link),
  };
}

function computeLinkAttributes(link: EdgeWithData): EwoksIOLinkAttributes {
  const { data: lData } = link;
  return {
    ...(isString(link.label) && { label: link.label }),
    ...(lData.comment && { comment: lData.comment }),
    ...(lData.conditions &&
      lData.conditions.length > 0 && {
        conditions: lData.conditions.map((con) => {
          return {
            source_output: con.name,
            value: con.value,
          };
        }),
      }),
    ...(lData.data_mapping &&
      lData.data_mapping.length > 0 && {
        data_mapping: calcDataMapping(lData.data_mapping),
      }),
    ...notUndefinedValue(lData.map_all_data, 'map_all_data'),
    ...notUndefinedValue(lData.on_error, 'on_error'),
    ...notUndefinedValue(lData.required, 'required'),
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

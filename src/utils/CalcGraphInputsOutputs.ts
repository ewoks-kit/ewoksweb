import type {
  EdgeWithData,
  GraphDetails,
  InputOutputNodeAndLink,
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
  let input_nodes: InputOutputNodeAndLink[] = [];
  let output_nodes: InputOutputNodeAndLink[] = [];

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
): InputOutputNodeAndLink[] {
  const nodes: InputOutputNodeAndLink[] = [];

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
      calcNodeProps(
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
): InputOutputNodeAndLink[] {
  const output_nodes: InputOutputNodeAndLink[] = [];

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

    output_nodes.push(
      calcNodeProps(
        connectedNode.data.task_props.task_type === 'graph',
        rawOutputNode,
        connectedNode,
        connectingLink,
        'graphOutput',
      ),
    );
  }

  return output_nodes;
}

function calcNodeProps(
  isGraph: boolean,
  nod: NodeWithData,
  nodConnected: NodeWithData,
  link: EdgeWithData,
  inputOrOutput: 'graphInput' | 'graphOutput',
): InputOutputNodeAndLink {
  const lData = link.data;
  const nData = nod.data;
  const nUiprops = nData.ui_props;

  const linkAttributes = {
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

  const ewoksMarkerEnd = convertRFMarkerEndToEwoks(link.markerEnd);
  return {
    id: nod.id,
    node: nodConnected.id,
    sub_node: isGraph
      ? (inputOrOutput === 'graphOutput'
          ? lData.sub_source
          : lData.sub_target) || undefined
      : undefined,
    ...(nodConnected.id &&
      !propIsEmpty(linkAttributes) && { link_attributes: linkAttributes }),
    uiProps: {
      position: nod.position,
      ...notUndefinedValue(nData.ewoks_props.label, 'label'),
      ...notUndefinedValue(link.type, 'type'),
      ...(link.style?.stroke &&
        link.style.stroke !== DEFAULT_LINK_VALUES.uiProps.stroke && {
          style: {
            stroke: link.style.stroke,
          },
        }),
      ...(ewoksMarkerEnd ? { markerEnd: ewoksMarkerEnd } : {}),
      ...notUndefinedValue(link.animated, 'animated'),
      ...notUndefinedValue(nUiprops.withImage, 'withImage'),
      ...notUndefinedValue(nUiprops.withLabel, 'withLabel'),
      ...(nUiprops.colorBorder && {
        colorBorder: nUiprops.colorBorder,
      }),
      ...(nUiprops.nodeWidth && {
        nodeWidth: nUiprops.nodeWidth,
      }),
    },
  };
}

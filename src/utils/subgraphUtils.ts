import type {
  EwoksIONode,
  EwoksLink,
  EwoksNode,
  Workflow,
} from '../ewoksTypes';
import {
  calcCommonNodeUiProps,
  calcLinkCommonProps,
  calcLinkUiProps,
  hasDefinedFields,
} from './utils';

// DOC: calc the input nodes and links that need to be added to the graph from
// the input_nodes in the Ewoks graph model
export function inputNodesAndLinks(
  inputNodes: EwoksIONode[] | undefined,
  nodes: EwoksNode[],
): { nodes: EwoksNode[]; links: EwoksLink[] } {
  const inputs: { nodes: EwoksNode[]; links: EwoksLink[] } = {
    nodes: [],
    links: [],
  };
  if (inputNodes && inputNodes.length > 0) {
    const inNodesInputed: string[] = [];
    inputNodes.forEach((inNod) => {
      const nodeTarget = nodes.find((no) => no.id === inNod.node);

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
            position: temPosition,
            icon: 'graphInput.svg',
            ...(uIProps && { ...calcCommonNodeUiProps(uIProps) }),
          },
        });
        inNodesInputed.push(inNod.id);
      }

      if (inNod.node) {
        const linkAttr = inNod.link_attributes;

        const linksUiProps = calcLinkUiProps(uIProps, linkAttr);

        inputs.links.push({
          startEnd: true,
          source: inNod.id,
          target: inNod.node,
          ...(nodeTarget?.task_type === 'graph' &&
            inNod.sub_node && { sub_target: inNod.sub_node }),
          ...(linkAttr && { ...calcLinkCommonProps(linkAttr) }),
          ...(hasDefinedFields(linksUiProps) && {
            uiProps: linksUiProps,
          }),
        });
      }
    });
  }
  return inputs;
}

// DOC: calc the output nodes and links that need to be added to
// the graph from the output_nodes
export function outputNodesAndLinks(
  outputNodes: EwoksIONode[] | undefined,
  nodes: EwoksNode[],
): { nodes: EwoksNode[]; links: EwoksLink[] } {
  const outputs: { nodes: EwoksNode[]; links: EwoksLink[] } = {
    nodes: [],
    links: [],
  };
  if (outputNodes && outputNodes.length > 0) {
    const outNodesInputed: string[] = [];
    outputNodes.forEach((outNod) => {
      const nodeSource = nodes.find((no) => no.id === outNod.node);

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
            position: temPosition,
            icon: 'graphOutput.svg',
            ...(uIProps && { ...calcCommonNodeUiProps(uIProps) }),
          },
        });
        outNodesInputed.push(outNod.id);
      }

      if (outNod.node) {
        const linkAttr = outNod.link_attributes;

        const linksUiProps = calcLinkUiProps(uIProps, linkAttr);

        outputs.links.push({
          startEnd: true,
          source: outNod.node,
          target: outNod.id,
          ...(nodeSource?.task_type === 'graph' &&
            outNod.sub_node && { sub_source: outNod.sub_node }),
          ...(linkAttr && { ...calcLinkCommonProps(linkAttr) }),
          ...(hasDefinedFields(linksUiProps) && {
            uiProps: linksUiProps,
          }),
        });
      }
    });
  }
  return outputs;
}

export function getSubgraphOutputs(
  node: EwoksNode,
  subgraphs: Workflow[],
): string[] {
  const subgraphNodeSource = subgraphs.find(
    (subgraph) => subgraph.graph.id === node.task_identifier,
  );

  if (!subgraphNodeSource?.graph.output_nodes) {
    return [];
  }

  return subgraphNodeSource.graph.output_nodes.map(
    (outputNode) => outputNode.id,
  );
}

export function getSubgraphInputs(
  node: EwoksNode,
  subgraphs: Workflow[],
): { required: string[]; optional: string[] } {
  const subgraphNodeSource = subgraphs.find(
    (subGr) => subGr.graph.id === node.task_identifier,
  );

  if (!subgraphNodeSource?.graph.input_nodes) {
    return { required: [], optional: [] };
  }

  const inputNodesIds = subgraphNodeSource.graph.input_nodes.map(
    (inputNode) => inputNode.id,
  );

  return {
    optional: inputNodesIds,
    required: [],
  };
}

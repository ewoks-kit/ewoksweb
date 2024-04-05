import type { EwoksIONode, EwoksLink, EwoksNode } from '../types';
import { hasDefinedFields } from './utils';
import {
  calcCommonNodeUiProps,
  calcLinkCommonProps,
  calcLinkUiProps,
} from './utils';

// TODO: merge with outNodesLinks if possible when stable
// DOC: calc the input nodes and links that need to be added to the graph from
// the input_nodes in the Ewoks graph model
export function inNodesLinks(
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

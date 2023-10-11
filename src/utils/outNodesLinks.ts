import type { EwoksLink, EwoksNode, InputOutputNodeAndLink } from '../types';
import { propIsEmpty } from './utils';
import {
  calcCommonNodeUiProps,
  calcLinkCommonProps,
  calcLinkUiProps,
} from './utils';

// DOC: calc the output nodes and links that need to be added to
// the graph from the output_nodes
export function outNodesLinks(
  outputNodes: InputOutputNodeAndLink[] | undefined,
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
          ...(!propIsEmpty(linksUiProps) && {
            uiProps: linksUiProps,
          }),
        });
      }
    });
  }
  return outputs;
}

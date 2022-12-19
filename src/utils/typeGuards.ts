import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../types';

export function isNode(
  node: EwoksRFNode | EwoksRFLink | GraphDetails
): node is EwoksRFNode {
  return (node as EwoksRFNode).position !== undefined;
}

export function isLink(
  link: EwoksRFNode | EwoksRFLink | GraphDetails
): link is EwoksRFLink {
  return (link as EwoksRFLink).source !== undefined;
}

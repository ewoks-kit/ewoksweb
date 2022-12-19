import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../types';

export function isNode(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails
): entity is EwoksRFNode {
  return 'position' in entity;
}

export function isLink(
  entity: EwoksRFNode | EwoksRFLink | GraphDetails
): entity is EwoksRFLink {
  return 'source' in entity;
}

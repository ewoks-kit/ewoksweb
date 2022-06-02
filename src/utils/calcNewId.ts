import type { EwoksRFNode } from '../types';

export function calcNewId(nodeId: string, nodes: EwoksRFNode[]) {
  let id = 0;
  while (nodes.map((nod) => nod.id).includes(`${nodeId}_${id}`)) {
    id++;
  }
  return `${nodeId}_${id}`;
}

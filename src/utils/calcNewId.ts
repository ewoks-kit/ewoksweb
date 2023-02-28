export function calcNewId(nodeId: string, nodesIds: string[]): string {
  let id = 0;
  while (nodesIds.includes(`${nodeId}${id}`)) {
    id++;
  }
  return `${nodeId}${id}`;
}

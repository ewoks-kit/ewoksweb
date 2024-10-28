import type { SubgraphOutputsInputs } from '../../types';

export function formatId(id: string): string {
  if (id.length <= 20) {
    return id;
  }

  return id.split('.').pop() as string;
}

export function sortByPosition(
  a: SubgraphOutputsInputs,
  b: SubgraphOutputsInputs,
) {
  return (a.positionY || 0) - (b.positionY || 0);
}

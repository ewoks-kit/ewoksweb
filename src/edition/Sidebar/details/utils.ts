import type { Condition, DataMapping } from '../../../types';

export function mappingToLabel(dataMapping: DataMapping[] | undefined) {
  if (!dataMapping || dataMapping.length === 0) {
    return undefined;
  }

  return dataMapping
    .map((mapping) => `${mapping.source}->${mapping.target}`)
    .join(', ');
}

export function conditionsToLabel(conditions: Condition[] | undefined) {
  if (!conditions || conditions.length === 0) {
    return undefined;
  }

  return conditions
    .map(
      (condition) =>
        `${condition.name || ''}: ${JSON.stringify(condition.value)}`,
    )
    .join(', ');
}

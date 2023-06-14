/* eslint-disable require-unicode-regexp */
import { nanoid } from 'nanoid';
import type { Condition, DataMapping, DataMappingEwoks } from '../types';

export function createDataMappingData(pair: DataMappingEwoks): DataMapping {
  return {
    id: nanoid(),
    name: pair.source_output ? pair.source_output.toString() : '',
    value: pair.target_input ?? '',
  };
}

export function calcConditionValue(condition: Condition): unknown {
  return condition.value === 'true'
    ? true
    : condition.value === 'false'
    ? false
    : condition.value === 'null'
    ? null
    : condition.value;
}

export function calcConditionName(
  condition: Condition
): string | number | undefined {
  const cond = condition.name;

  return stringOrNumber(cond);
}

export function calcDataMapping(
  dataMappings: DataMapping[]
): DataMappingEwoks[] {
  return dataMappings.map(({ value, name }) => {
    return {
      source_output: stringOrNumber(name),
      target_input: stringOrNumber(value),
    };
  });
}

export function stringOrNumber(
  value: string | number | undefined
): string | number {
  return value === undefined
    ? ''
    : typeof value === 'number'
    ? value
    : value && /^\d+$/.test(value)
    ? Number.parseInt(value, 10)
    : value;
}

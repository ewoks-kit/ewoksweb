/* eslint-disable require-unicode-regexp */
import { nanoid } from 'nanoid';
import type { Conditions, DataMapping, DataMappingEwoks } from '../types';

export function createDataMappingData(pair: DataMappingEwoks): DataMapping {
  return {
    id: nanoid(),
    name: pair.source_output ? pair.source_output.toString() : '',
    value: pair.target_input ?? '',
  };
}

export function calcConditionValue(condition: Conditions) {
  return condition.value === 'true'
    ? true
    : condition.value === 'false'
    ? false
    : condition.value === 'null'
    ? null
    : condition.value;
}

export function calcConditionName(condition: Conditions) {
  const cond = condition.name;

  return cond && /^\d+$/.test(cond) ? Number.parseInt(cond, 10) : cond;
}

export function calcDataMapping(
  data_mapping: DataMapping[]
): DataMappingEwoks[] {
  return data_mapping.map((mapping) => {
    return {
      source_output:
        mapping.name && /^\d+$/.test(mapping.name)
          ? Number.parseInt(mapping.name, 10)
          : mapping.name,
      target_input:
        mapping.value && /^\d+$/.test(mapping.value as string)
          ? Number.parseInt(mapping.value as string, 10)
          : (mapping.value as string),
    };
  });
}

import type {
  Conditions,
  DataMapping,
  EditableTableRow,
  EwoksRFNode,
  Inputs,
} from '../../../types';

export const INPUT_TYPES = ['bool', 'number', 'string', 'list', 'dict', 'null'];

export function createData(
  pair: DataMapping | Conditions | Inputs
): EditableTableRow {
  if (pair.id && (pair.value || pair.value === null || pair.value === false)) {
    return { ...pair, isEditMode: false };
  }

  return {
    id: Object.values(pair)[0],
    name: Object.values(pair)[0],
    value: Object.values(pair)[1],
    isEditMode: false,
    type:
      pair.value === 'true' || pair.value === 'false'
        ? 'boolean'
        : pair.value === null
        ? 'null'
        : typeof pair.value,
  };
}

export function getType(val: DataMapping | Conditions | Inputs) {
  const { value } = val;

  if (typeof value === 'boolean' || value === 'true' || value === 'false') {
    return 'boolean';
  }

  if (Array.isArray(value)) {
    return 'list';
  }

  if (value === 'null' || value === null) {
    return 'null';
  }

  if (typeof value === 'object') {
    return 'dict';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  return 'string';
}
// DATAC with edges
export function isClass(node: EwoksRFNode | undefined): boolean {
  return node?.data.task_props.task_type === 'class';
}

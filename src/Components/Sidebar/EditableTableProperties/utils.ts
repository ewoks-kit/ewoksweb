import type {
  Conditions,
  DataMapping,
  EditableTableRow,
  EwoksRFNodeData,
  Inputs,
} from '../../../types';

export const INPUT_TYPES = ['bool', 'number', 'string', 'list', 'dict', 'null'];

export function createData(pair: Conditions | Inputs): EditableTableRow {
  console.log(pair);

  const type =
    pair.type ??
    (pair.value === 'true' || pair.value === 'false'
      ? 'boolean'
      : pair.value === null
      ? 'null'
      : typeof pair.value);

  if ('source_output' in pair) {
    return {
      id: pair.source_output?.toString(),
      name: pair.source_output?.toString(),
      value: pair.value !== null ? pair.value : 'null',
      type,
    };
  }

  return {
    id: pair.id?.toString() || pair.name?.toString(),
    name: pair.name?.toString(),
    value: pair.value !== null ? pair.value : 'null',
    type,
  };
}

export function getType(val: DataMapping | Conditions | Inputs) {
  const { value, type } = val;
  console.log(val, value);

  if (type in val && val.type) {
    return type;
  }

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

export function isClass(edgeData: EwoksRFNodeData | undefined): boolean {
  return edgeData?.task_props.task_type === 'class';
}

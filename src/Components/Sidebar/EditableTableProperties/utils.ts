import type {
  Condition,
  DataMapping,
  EditableTableRow,
  EwoksRFNodeData,
  Inputs,
} from '../../../types';

export const INPUT_TYPES = ['bool', 'number', 'string', 'list', 'dict', 'null'];

export function createData(pair: Condition | Inputs): EditableTableRow {
  const type =
    pair.value === 'true' || pair.value === 'false'
      ? 'boolean'
      : pair.value === null
      ? 'null'
      : typeof pair.value;

  if ('source_output' in pair) {
    return {
      id: pair.id?.toString() || pair.source_output?.toString(),
      name: pair.source_output?.toString(),
      value: pair.value !== null ? pair.value : 'null',
      type,
    };
  }

  return {
    id: pair.id?.toString() || pair.name?.toString(),
    name: pair.name?.toString(),
    value: pair.value,
    type,
  };
}

export function getType(val: DataMapping | Condition | Inputs) {
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

export function isClass(edgeData: EwoksRFNodeData | undefined): boolean {
  return edgeData?.task_props.task_type === 'class';
}

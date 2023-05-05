import type {
  Conditions,
  DataMapping,
  EditableTableRow,
  EwoksRFNodeData,
  Inputs,
} from '../../../types';

export const INPUT_TYPES = ['bool', 'number', 'string', 'list', 'dict', 'null'];

export function createData(pair: Conditions | Inputs): EditableTableRow {
  const type =
    pair.value === 'true' || pair.value === 'false'
      ? 'boolean'
      : pair.value === null
      ? 'null'
      : typeof pair.value;

  if ('source_output' in pair) {
    return {
      id: pair.source_output,
      name: pair.source_output,
      value: pair.value !== null ? pair.value : 'null',
      type,
    };
  }

  return {
    id: pair.id || pair.name,
    name: pair.name,
    value: pair.value,
    type,
  };
}

export function createDataMappingData(pair: DataMapping): EditableTableRow {
  return {
    id: pair.source_output ?? pair.id ?? '',
    name: pair.source_output ?? pair.name ?? '',
    value: pair.target_input ?? pair.value ?? '',
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

export function isClass(edgeData: EwoksRFNodeData | undefined): boolean {
  return edgeData?.task_props.task_type === 'class';
}

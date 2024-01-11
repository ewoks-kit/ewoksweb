import type {
  Condition,
  DefaultInput,
  InputTableRow,
  LinkData,
  NodeData,
  TypeOfValues,
} from '../../../types';

export const INPUT_TYPES = ['bool', 'number', 'string', 'list', 'dict', 'null'];

export function createData(pair: Condition | DefaultInput): InputTableRow {
  const type = getType(pair);

  return {
    rowId: pair.rowId?.toString() || pair.name.toString(),
    name: pair.name.toString(),
    value: pair.value,
    type,
  };
}

export function getType(val: Condition | DefaultInput) {
  const { value } = val;

  if ('type' in val && val.type) {
    return val.type;
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

export function isClass(edgeData: NodeData | undefined): boolean {
  return edgeData?.task_props.task_type === 'class';
}

export function calcTypeOfValues(
  inOrOut: 'inputs' | 'outputs',
  nodeData: NodeData | undefined,
  edgeDataL: LinkData,
): TypeOfValues {
  return {
    typeOfInput: isClass(nodeData) ? 'select' : 'input',
    values: isClass(nodeData)
      ? inOrOut === 'outputs'
        ? [
            ...(edgeDataL.links_required_output_names || []),
            ...(edgeDataL.links_optional_output_names || []),
          ]
        : edgeDataL.links_input_names || []
      : undefined,
    requiredValues:
      isClass(nodeData) && inOrOut === 'outputs'
        ? edgeDataL.links_required_output_names
        : undefined,
  };
}

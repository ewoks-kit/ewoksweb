import { nanoid } from 'nanoid';

import type {
  Condition,
  DefaultInput,
  InputTableRow,
  LinkData,
  NodeData,
  TypeOfValues,
} from '../../../types';
import { RowType } from '../../../types';

export function createData(pair: Condition | DefaultInput): InputTableRow {
  const type = getType(pair);
  const rowId = pair.rowId || nanoid();

  return {
    rowId,
    name: pair.name?.toString(),
    value: pair.value,
    type,
  };
}

export function getType(val: Condition | DefaultInput): RowType {
  const { value } = val;

  if ('type' in val && val.type) {
    return val.type;
  }

  if (typeof value === 'boolean') {
    return RowType.Bool;
  }

  if (Array.isArray(value)) {
    return RowType.List;
  }

  if (value === null) {
    return RowType.Null;
  }

  if (typeof value === 'object') {
    return RowType.Dict;
  }

  if (typeof value === 'number') {
    return RowType.Number;
  }

  return RowType.String;
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

export function transformInObject(
  value: unknown,
  type: string | undefined,
): object {
  if (type === 'list') {
    return Array.isArray(value) ? value : [];
  }

  if (type === 'dict') {
    return typeof value === 'object' && !Array.isArray(value) && value
      ? value
      : {};
  }

  return {};
}

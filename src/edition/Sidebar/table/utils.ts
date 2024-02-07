import type { LinkData, NodeData, TypeOfValues } from '../../../types';

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

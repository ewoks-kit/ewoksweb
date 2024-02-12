import type { LinkData, NodeData, Options } from '../../../types';

export function calcEdgeInputOptions(linkData: LinkData): Options | undefined {
  const { links_input_names: values = [] } = linkData;

  return values.length > 0 ? { values, requiredValues: [] } : undefined;
}

export function calcEdgeOutputOptions(linkData: LinkData): Options | undefined {
  const {
    links_required_output_names: requiredValues = [],
    links_optional_output_names: optionalValues = [],
  } = linkData;

  const values = [...requiredValues, ...optionalValues];

  return values.length > 0 ? { values, requiredValues } : undefined;
}

export function calcNodeInputOptions(
  nodeData: NodeData | undefined,
): Options | undefined {
  const requiredValues = nodeData?.task_props.required_input_names || [];
  const optionalValues = nodeData?.task_props.optional_input_names || [];

  const values = [...requiredValues, ...optionalValues];

  return values.length > 0 ? { values, requiredValues } : undefined;
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

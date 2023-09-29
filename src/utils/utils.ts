/* eslint-disable require-unicode-regexp */
import { nanoid } from 'nanoid';
import type {
  Condition,
  DataMapping,
  DataMappingEwoks,
  InOutLinkAttributes,
  InOutNodesUiProps,
} from '../types';
import { DEFAULT_LINK_VALUES } from './defaultValues';
import { isString } from './typeGuards';

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
    : condition.type === 'number' &&
      isString(condition.value) &&
      isDecimalNumber(condition.value)
    ? Number(condition.value)
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

export function isDecimalNumber(value: string) {
  return /^-?\d*\.?\d*$/u.test(value);
}

export function notUndefinedValue(
  value: unknown,
  propName: string
): object | undefined {
  if (value !== undefined) {
    return { [propName]: value };
  }
  return undefined;
}

export function calcCommonNodeUiProps(uiProps: InOutNodesUiProps) {
  return {
    ...notUndefinedValue(uiProps.withImage, 'withImage'),
    ...notUndefinedValue(uiProps.withLabel, 'withLabel'),
    ...(uiProps.colorBorder && { colorBorder: uiProps.colorBorder }),
    ...(uiProps.nodeWidth && { nodeWidth: uiProps.nodeWidth }),
  };
}

export function calcLinkUiProps(
  uiProps: InOutNodesUiProps | undefined,
  linkAttr?: InOutLinkAttributes | undefined
) {
  return {
    ...(linkAttr?.label && { label: linkAttr.label }),
    ...(linkAttr?.comment && { comment: linkAttr.comment }),
    ...(uiProps?.style?.stroke && {
      style: { stroke: uiProps.style.stroke, strokeWidth: '3px' },
    }),
    ...(uiProps?.markerEnd &&
      typeof uiProps.markerEnd !== 'string' &&
      uiProps.markerEnd.type !== DEFAULT_LINK_VALUES.uiProps.markerEnd.type && {
        markerEnd: uiProps.markerEnd,
      }),
    ...notUndefinedValue(uiProps?.animated, 'animated'),
  };
}

export function calcLinkCommonProps(linkAttr: InOutLinkAttributes) {
  return {
    ...(linkAttr.conditions &&
      linkAttr.conditions.length > 0 && {
        conditions: linkAttr.conditions,
      }),
    ...(linkAttr.data_mapping &&
      linkAttr.data_mapping.length > 0 && {
        data_mapping: linkAttr.data_mapping,
      }),
    ...notUndefinedValue(linkAttr.on_error, 'on_error'),
    ...notUndefinedValue(linkAttr.map_all_data, 'map_all_data'),
    ...notUndefinedValue(linkAttr.required, 'required'),
  };
}

export function propIsEmpty(uiprops: object | undefined) {
  let isEmpty = true;
  if (uiprops === undefined) {
    return isEmpty;
  }
  for (const [, value] of Object.entries(uiprops)) {
    if ((Array.isArray(value) && value.length > 0) || value) {
      isEmpty = false;
      break;
    }
  }
  return isEmpty;
}

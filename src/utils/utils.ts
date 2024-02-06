import { nanoid } from 'nanoid';

import type {
  DataMapping,
  EwoksDataMapping,
  InputOutputLinkAttributes,
  InputOutputUiProps,
} from '../types';
import { DEFAULT_LINK_VALUES } from './defaultValues';

export function createDataMappingData(pair: EwoksDataMapping): DataMapping {
  return {
    rowId: nanoid(),
    source: pair.source_output ? pair.source_output.toString() : '',
    target: pair.target_input ?? '',
  };
}

export function calcDataMapping(
  dataMappings: DataMapping[],
): EwoksDataMapping[] {
  return dataMappings.map(({ source, target }) => ({
    source_output: source,
    target_input: target,
  }));
}

export function notUndefinedValue(
  value: unknown,
  propName: string,
): object | undefined {
  if (value !== undefined) {
    return { [propName]: value };
  }
  return undefined;
}

export function calcCommonNodeUiProps(uiProps: InputOutputUiProps) {
  return {
    ...notUndefinedValue(uiProps.withImage, 'withImage'),
    ...notUndefinedValue(uiProps.withLabel, 'withLabel'),
    ...(uiProps.colorBorder && { colorBorder: uiProps.colorBorder }),
    ...(uiProps.nodeWidth && { nodeWidth: uiProps.nodeWidth }),
  };
}

export function calcLinkUiProps(
  uiProps: InputOutputUiProps | undefined,
  linkAttr?: InputOutputLinkAttributes | undefined,
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

export function calcLinkCommonProps(linkAttr: InputOutputLinkAttributes) {
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

export function generateUniqueNodeId(
  nodesIds: string[],
  tentativePrefix = '',
  tentativeSuffix = 0,
): string {
  const tentativeId = `${tentativePrefix}_${tentativeSuffix}`;
  if (nodesIds.includes(tentativeId)) {
    return generateUniqueNodeId(nodesIds, tentativePrefix, tentativeSuffix + 1);
  }

  return tentativeId;
}

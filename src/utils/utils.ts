import { nanoid } from 'nanoid';

import type {
  DataMapping,
  EwoksDataMapping,
  EwoksIOLinkAttributes,
  EwoksIONodeUiProps,
  EwoksMarkerEnd,
  EwoksMarkerEndLegacy,
  RFMarkerEnd,
  RowValue,
} from '../types';
import { RowType } from '../types';
import { DEFAULT_LINK_VALUES } from './defaultValues';
import { isMarkerType } from './typeGuards';

export function createDataMappingData(pair: EwoksDataMapping): DataMapping {
  return {
    rowId: nanoid(),
    source: pair.source_output ?? '',
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

export function notUndefinedValue<T>(
  value: T,
  propName: string,
): Record<string, NonNullable<T>> | undefined {
  if (value !== undefined && value !== null) {
    return { [propName]: value };
  }
  return undefined;
}

export function calcCommonNodeUiProps(uiProps: EwoksIONodeUiProps) {
  return {
    ...notUndefinedValue(uiProps.withImage, 'withImage'),
    ...notUndefinedValue(uiProps.withLabel, 'withLabel'),
    ...(uiProps.colorBorder && { colorBorder: uiProps.colorBorder }),
    ...(uiProps.nodeWidth && { nodeWidth: uiProps.nodeWidth }),
  };
}

export function calcLinkUiProps(
  uiProps: EwoksIONodeUiProps | undefined,
  linkAttr?: EwoksIOLinkAttributes | undefined,
) {
  return {
    ...(linkAttr?.label && { label: linkAttr.label }),
    ...(linkAttr?.comment && { comment: linkAttr.comment }),
    ...(uiProps?.style?.stroke && {
      style: { stroke: uiProps.style.stroke },
    }),
    ...(uiProps?.markerEnd && {
      markerEnd: uiProps.markerEnd,
    }),
    ...notUndefinedValue(uiProps?.animated, 'animated'),
  };
}

export function calcLinkCommonProps(linkAttr: EwoksIOLinkAttributes) {
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

export function hasDefinedFields(obj: object | null | undefined): boolean {
  if (obj === undefined || obj === null) {
    return false;
  }

  return Object.entries(obj).some(([, value]: [string, unknown]) => {
    return typeof value === 'object'
      ? hasDefinedFields(value)
      : typeof value === 'string'
      ? value.length > 0
      : true;
  });
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

export function getValueAndType(value: unknown): {
  type: RowType;
  value: RowValue;
} {
  if (typeof value === 'boolean') {
    return { type: RowType.Bool, value };
  }

  if (Array.isArray(value)) {
    return { type: RowType.List, value };
  }

  if (value === null) {
    return { type: RowType.Null, value };
  }

  if (typeof value === 'object') {
    return { type: RowType.Dict, value };
  }

  if (typeof value === 'number') {
    return { type: RowType.Number, value };
  }

  return { type: RowType.String, value: String(value) };
}

export function convertEwoksMarkerEndToRF(
  markerEnd: EwoksMarkerEndLegacy | undefined,
): RFMarkerEnd {
  // Legacy: Old links can have '' instead of 'none'
  if (markerEnd === 'none' || markerEnd === '') {
    return '';
  }

  if (isMarkerType(markerEnd)) {
    return { type: markerEnd };
  }

  // Legacy: Old link can have markerEnd of the form {type: EwoksMarkerEnd}
  if (typeof markerEnd === 'object' && 'type' in markerEnd) {
    return convertEwoksMarkerEndToRF(markerEnd.type);
  }

  return DEFAULT_LINK_VALUES.uiProps.markerEnd;
}

export function convertRFMarkerEndToEwoks(
  markerEnd: RFMarkerEnd,
): EwoksMarkerEnd | undefined {
  if (markerEnd === '') {
    return 'none';
  }

  if (!markerEnd || typeof markerEnd === 'string') {
    return undefined;
  }

  if (markerEnd === DEFAULT_LINK_VALUES.uiProps.markerEnd) {
    return undefined;
  }

  return markerEnd.type;
}

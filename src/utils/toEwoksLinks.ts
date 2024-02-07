import type { EdgeWithData, EwoksLink } from '../types';
import { propIsEmpty } from '../utils/utils';
import { DEFAULT_LINK_VALUES } from './defaultValues';
import { isString } from './typeGuards';
import { calcDataMapping, notUndefinedValue } from './utils';

// EwoksRFLinks --> EwoksLinks for saving
export function toEwoksLinks(links: EdgeWithData[]): EwoksLink[] {
  const tempLinks: EdgeWithData[] = [...links].filter(
    (link) => !link.data.startEnd,
  );

  return tempLinks.map(
    ({
      label,
      source,
      sourceHandle,
      target,
      targetHandle,
      data: {
        on_error,
        map_all_data,
        required,
        comment,
        getAroundProps,
        sub_source,
        sub_target,
        data_mapping,
        conditions,
      },
      type,
      markerEnd,
      style,
      animated,
    }) => {
      const datamapping = data_mapping && calcDataMapping(data_mapping);

      const conditionsValue = conditions?.map((con) => {
        return {
          source_output: con.name ?? '',
          value: con.value,
        };
      });

      const linkUiProps = {
        ...(isString(label) && {
          label,
        }),
        ...(comment && { comment }),
        ...(type && { type }),
        ...(markerEnd &&
          typeof markerEnd !== 'string' &&
          markerEnd.type !== DEFAULT_LINK_VALUES.uiProps.markerEnd.type && {
            markerEnd,
          }),
        ...(style?.stroke !== '#96a5f9' && {
          style: { stroke: style?.stroke },
        }),
        ...notUndefinedValue(animated, 'animated'),
        ...(sourceHandle && sourceHandle !== 'sr' && { sourceHandle }),
        ...(targetHandle && targetHandle !== 'tl' && { targetHandle }),
        ...(type === 'getAround' && {
          getAroundProps,
        }),
      };

      return {
        source,
        target,
        ...(sub_source && { sub_source }),
        ...(sub_target && { sub_target }),
        ...(datamapping && {
          data_mapping: datamapping,
        }),
        ...(conditionsValue && {
          conditions: conditionsValue,
        }),
        ...notUndefinedValue(on_error, 'on_error'),
        ...notUndefinedValue(required, 'required'),
        map_all_data,
        ...(!propIsEmpty(linkUiProps) && { uiProps: linkUiProps }),
      };
    },
  );
}

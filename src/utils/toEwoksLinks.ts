import { isString } from './typeGuards';
import type { EwoksLink, EwoksRFLink } from '../types';
import {
  calcConditionName,
  calcConditionValue,
  calcDataMapping,
} from './utils';
import { DEFAULT_LINK_VALUES } from './defaultValues';

// EwoksRFLinks --> EwoksLinks for saving
export function toEwoksLinks(links: EwoksRFLink[]): EwoksLink[] {
  const tempLinks: EwoksRFLink[] = [...links].filter(
    (link) => !link.data.startEnd
  );

  return tempLinks.map(
    ({
      label,
      source,
      sourceHandle,
      target,
      targetHandle,
      data,
      type,
      markerEnd,
      style,
      animated,
    }) => {
      const datamapping =
        data.data_mapping && calcDataMapping(data.data_mapping);

      const conditionsValue = data.conditions?.map((con) => {
        return {
          source_output: calcConditionName(con),
          value: calcConditionValue(con),
        };
      });

      const { required, on_error } = DEFAULT_LINK_VALUES;
      const link: EwoksLink = {
        source,
        target,
        ...(datamapping &&
          datamapping.length > 0 && {
            data_mapping: datamapping,
          }),
        ...(conditionsValue &&
          conditionsValue.length > 0 && {
            conditions: conditionsValue,
          }),
        ...(data.on_error !== on_error && {
          on_error: data.on_error,
        }),
        map_all_data: data.map_all_data,
        ...(data.required !== required && {
          required: data.required,
        }),
        uiProps: {
          ...(label &&
            isString(label) && {
              label,
            }),
          ...(data.comment && { comment: data.comment }),
          ...(type && type !== DEFAULT_LINK_VALUES.uiProps.type && { type }),
          ...(markerEnd &&
            typeof markerEnd !== 'string' &&
            markerEnd.type !== DEFAULT_LINK_VALUES.uiProps.markerEnd.type && {
              markerEnd,
            }),
          ...(style?.stroke !== '#96a5f9' && {
            style: { stroke: style?.stroke },
          }),
          ...(animated !== DEFAULT_LINK_VALUES.uiProps.animated && {
            animated,
          }),
          sourceHandle,
          targetHandle,
          ...(type === 'getAround' && {
            getAroundProps: data.getAroundProps,
          }),
        },
      };
      if (data.sub_source) {
        link.sub_source = data.sub_source;
      }
      if (data.sub_target) {
        link.sub_target = data.sub_target;
      }
      return link;
    }
  );
}

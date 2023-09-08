import { isString } from './typeGuards';
import type { EwoksLink, EwoksRFLink } from '../types';
import {
  calcConditionName,
  calcConditionValue,
  calcDataMapping,
} from './utils';
import { propIsEmpty } from '../utils/CalcGraphInputsOutputs';
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
          source_output: calcConditionName(con),
          value: calcConditionValue(con),
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
        ...(animated && { animated }),
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
        ...(on_error && { on_error }),
        ...(required && { required }),
        map_all_data,
        ...(!propIsEmpty(linkUiProps) && { uiProps: linkUiProps }),
      };
    }
  );
}

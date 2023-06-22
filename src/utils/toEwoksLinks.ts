import { isString } from './typeGuards';
import type { EwoksLink, EwoksRFLink } from '../types';
import {
  calcConditionName,
  calcConditionValue,
  calcDataMapping,
} from './utils';

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
      const link: EwoksLink = {
        source,
        target,
        data_mapping: data.data_mapping && calcDataMapping(data.data_mapping),
        conditions: data.conditions?.map((con) => {
          return {
            source_output: calcConditionName(con),
            value: calcConditionValue(con),
          };
        }),
        on_error: data.on_error,
        map_all_data: data.map_all_data,
        required: data.required,
        uiProps: {
          label: isString(label) ? label : undefined,
          comment: data.comment,
          type,
          markerEnd,
          style: { stroke: style?.stroke },
          animated,
          sourceHandle,
          targetHandle,
          getAroundProps: data.getAroundProps,
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

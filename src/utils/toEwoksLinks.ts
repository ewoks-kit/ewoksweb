/* eslint-disable require-unicode-regexp */
import { isString } from './typeGuards';
import type { Conditions, DataMapping, EwoksLink, EwoksRFLink } from '../types';

// EwoksRFLinks --> EwoksLinks for saving
export function toEwoksLinks(links: EwoksRFLink[]): EwoksLink[] {
  const tempLinks: EwoksRFLink[] = [...links].filter(
    (link) => !link.data.startEnd
  );
  // TODO: if there are some startEnd links with conditions or any other link_attributes
  // then graph.input_nodes and/or graph.output_nodes needs update
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
      labelBgStyle,
      labelStyle,
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
          labelBgStyle,
          labelStyle,
          style,
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

function calcConditionValue(condition: Conditions) {
  return condition.value === 'true'
    ? true
    : condition.value === 'false'
    ? false
    : condition.value === 'null'
    ? null
    : condition.value;
}

function calcConditionName(condition: Conditions) {
  const cond = condition.source_output ?? condition.name;

  return cond && /^\d+$/.test(cond as string)
    ? Number.parseInt(cond as string, 10)
    : cond;
}

function calcDataMapping(data_mapping: DataMapping[]) {
  return data_mapping.map((mapping) => {
    return {
      source_output:
        mapping.name && /^\d+$/.test(mapping.name)
          ? Number.parseInt(mapping.name, 10)
          : mapping.name,
      target_input:
        mapping.value && /^\d+$/.test(mapping.value as string)
          ? Number.parseInt(mapping.value as string, 10)
          : (mapping.value as string),
    };
  });
}

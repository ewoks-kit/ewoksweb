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
          const newCon = con.source_output ? con : calcConditionName(con);
          return { ...newCon, value: calcConditionValue(con) };
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
  const nameAsNumber = condition.name && Number(condition.name);
  return {
    source_output: Number.isNaN(nameAsNumber) ? condition.name : nameAsNumber,
  };
}

function calcDataMapping(data_mapping: DataMapping[]) {
  return data_mapping.map((mapping) => {
    const outputAsNumber =
      mapping.source_output && Number(mapping.source_output);
    const targetAsNumber = mapping.target_input && Number(mapping.target_input);
    return {
      source_output: Number.isNaN(outputAsNumber)
        ? mapping.source_output
        : outputAsNumber,
      target_input: Number.isNaN(targetAsNumber)
        ? mapping.target_input
        : targetAsNumber,
    };
  });
}

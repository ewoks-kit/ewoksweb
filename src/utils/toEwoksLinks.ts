import type { Conditions, EwoksLink, EwoksRFLink } from '../types';

// EwoksRFLinks --> EwoksLinks for saving
export function toEwoksLinks(links: EwoksRFLink[]): EwoksLink[] {
  const tempLinks: EwoksRFLink[] = [...links].filter(
    (link) => !link.data.startEnd
  );
  // if there are some startEnd links with conditions or any other link_attributes
  // then graph.input_nodes and/or graph.output_nodes needs update
  return tempLinks.map(
    ({
      label,
      source,
      sourceHandle,
      target,
      targetHandle,
      data: {
        comment,
        data_mapping,
        sub_target,
        sub_source,
        map_all_data,
        required,
        conditions,
        on_error,
        getAroundProps,
      },
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
        data_mapping,
        conditions: conditions?.map((con) => {
          const newCon = con.source_output ? con : { source_output: con.id };
          return { ...newCon, value: calcConditionValue(con) };
        }),
        on_error,
        map_all_data,
        required,
        uiProps: {
          label,
          comment,
          type,
          markerEnd,
          labelBgStyle,
          labelStyle,
          style,
          animated,
          sourceHandle,
          targetHandle,
          getAroundProps,
        },
      };
      if (sub_source) {
        link.sub_source = sub_source;
      }
      if (sub_target) {
        link.sub_target = sub_target;
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

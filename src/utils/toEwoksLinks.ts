import type { EwoksLink, EwoksRFLink } from '../types';

// EwoksRFLinks --> EwoksLinks for saving
export function toEwoksLinks(links): EwoksLink[] {
  // TODO: when input-arrow fake nodes exist remove their links to get an Ewoks description
  const tempLinks: EwoksRFLink[] = [...links].filter((link) => !link.startEnd);
  // if there are some startEnd links with conditions or any other link_attributes
  // then graph.input_nodes or graph.output_nodes needs update

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
        conditions,
        on_error,
      },
      type,
      arrowHeadType,
      labelStyle,
      style,
      animated,
    }) => ({
      source,
      target,
      data_mapping,
      conditions: conditions.map((con) => {
        if (con.source_output) {
          return {
            ...con,
            value: calcConditionValue(con),
          };
        }
        return {
          source_output: con.id,
          value: calcConditionValue(con),
        };
      }),
      on_error,
      sub_target,
      sub_source,
      map_all_data,
      uiProps: {
        label,
        comment,
        type,
        arrowHeadType,
        labelStyle,
        style,
        animated,
        sourceHandle,
        targetHandle,
      },
    })
  );
}

function calcConditionValue(condition) {
  return condition.value === 'true'
    ? true
    : condition.value === 'false'
    ? false
    : condition.value === 'null'
    ? null
    : condition.value;
}

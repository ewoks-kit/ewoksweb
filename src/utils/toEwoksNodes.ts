/* eslint-disable require-unicode-regexp */
import type {
  DataMapping,
  DataMappingEwoks,
  DefaultErrorAttributes,
  EwoksNode,
  EwoksRFNode,
  Inputs,
} from '../types';

function cleanDefaultInputs(default_inputs: Inputs[]) {
  return default_inputs.map((dIn) => {
    return {
      name: dIn.name,
      value:
        dIn.value === 'false'
          ? false
          : dIn.value === 'true'
          ? true
          : dIn.value === 'null'
          ? null
          : dIn.value,
    };
  });
}
function calcDefaultErrorAttributes(
  default_error_attributes: DefaultErrorAttributes<DataMapping> | undefined,
  default_error_node?: boolean
): DefaultErrorAttributes<DataMappingEwoks> | undefined {
  if (!default_error_node) {
    return undefined;
  }

  if (default_error_attributes?.map_all_data) {
    return { map_all_data: true, data_mapping: [] };
  }

  return {
    map_all_data: false,
    data_mapping:
      default_error_attributes?.data_mapping?.map((mapping) => {
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
      }) || [],
  };
}

function calcDefaultInputs(default_inputs: Inputs[] | undefined) {
  if (!default_inputs) {
    return [];
  }
  return default_inputs.map((dIn) => {
    return {
      name:
        dIn.name && /^\d+$/.test(dIn.name as string)
          ? Number.parseInt(dIn.name as string, 10)
          : dIn.name,
      value: dIn.value,
    };
  });
}

// EwoksRFNode --> EwoksNode for saving
export function toEwoksNodes(nodes: EwoksRFNode[]): EwoksNode[] {
  const tempNodes: EwoksRFNode[] = [...nodes].filter(
    (nod) =>
      nod.data.task_props.task_type &&
      !['graphInput', 'graphOutput', 'note'].includes(
        nod.data.task_props.task_type
      )
  );

  return tempNodes.map(
    ({
      id,
      data: {
        ewoks_props: {
          default_inputs,
          label,
          inputs_complete,
          task_generator,
          default_error_node,
          default_error_attributes,
        },
        task_props: { task_type, task_identifier },
        ui_props: {
          nodeWidth,
          node_icon,
          type,
          icon,
          moreHandles,
          withImage,
          withLabel,
          colorBorder,
        },

        comment,
      },
      position,
    }) => {
      if (task_type !== 'graph') {
        return {
          id: id.toString() || '',
          label,
          task_type,
          task_identifier,
          inputs_complete,
          task_generator,
          default_error_node,
          default_error_attributes: calcDefaultErrorAttributes(
            default_error_attributes,
            default_error_node
          ),
          default_inputs: cleanDefaultInputs(calcDefaultInputs(default_inputs)),
          uiProps: {
            nodeWidth,
            node_icon,
            type,
            icon,
            comment,
            position,
            moreHandles,
            withImage,
            withLabel,
            colorBorder,
          },
        };
      }
      // TODO: return the same for graphs and non-graphs
      // node-icon is not in graphs? ok? Graphs have no editable Node Info where the node_icon is
      // all the rest are the same... merge 2 returns?
      return {
        id: id.toString() || '',
        label,
        task_type,
        task_identifier,
        inputs_complete,
        task_generator,
        default_inputs: cleanDefaultInputs(calcDefaultInputs(default_inputs)),
        default_error_node,
        default_error_attributes: calcDefaultErrorAttributes(
          default_error_attributes,
          default_error_node
        ),
        uiProps: {
          label,
          type,
          icon,
          comment,
          position,
          moreHandles,
          colorBorder,
          withImage,
          withLabel,
          nodeWidth,
        },
      };
    }
  );
}

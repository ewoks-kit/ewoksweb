import type {
  DataMapping,
  DataMappingEwoks,
  DefaultErrorAttributes,
  EwoksNode,
  EwoksRFNode,
  Inputs,
} from '../types';
import { isString } from './typeGuards';
import { calcDataMapping, isDecimalNumber, stringOrNumber } from './utils';

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
    data_mapping: default_error_attributes?.data_mapping
      ? calcDataMapping(default_error_attributes.data_mapping)
      : [],
  };
}

function calcDefaultInputs(default_inputs: Inputs[] | undefined) {
  if (!default_inputs) {
    return [];
  }
  return default_inputs.map(({ name, value, type }) => {
    return {
      name: stringOrNumber(name),
      value:
        type === 'number' && isString(value) && isDecimalNumber(value)
          ? Number(value)
          : value,
    };
  });
}

// EwoksRFNode --> EwoksNode for saving
export function toEwoksNodes(nodes: EwoksRFNode[]): EwoksNode[] {
  const tempNodes: EwoksRFNode[] = [...nodes].filter(
    (nod) =>
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
      return {
        id,
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

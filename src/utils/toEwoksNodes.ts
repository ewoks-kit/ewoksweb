import type { EwoksNode, EwoksRFNode, Inputs } from '../types';
import { isInteger } from 'lodash';

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
function calcDefaultInputs(default_inputs: Inputs[] | undefined) {
  if (!default_inputs) {
    return [];
  }
  return default_inputs.map((dIn) => {
    return {
      name: isInteger(dIn.name) ? Number(dIn.name) : dIn.name,
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
          default_error_attributes: default_error_node
            ? default_error_attributes
            : undefined,
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
        default_error_attributes: default_error_node
          ? default_error_attributes
          : undefined,
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

import type { EwoksNode, EwoksRFNode, Inputs } from '../types';

function cleanDefaultInputs(default_inputs: Inputs[]) {
  return (
    default_inputs?.map((dIn) => {
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
    }) || []
  );
}

// EwoksRFNode --> EwoksNode for saving
export function toEwoksNodes(nodes: EwoksRFNode[]): EwoksNode[] {
  const tempNodes: EwoksRFNode[] = [...nodes].filter(
    (nod) =>
      !['graphInput', 'graphOutput', 'note'].includes(nod?.task_type || '')
  );

  return tempNodes.map(
    ({
      id,
      task_type,
      task_identifier,
      inputs_complete,
      task_generator,
      default_inputs,
      default_error_node,
      default_error_attributes,
      data: {
        nodeWidth,
        node_icon,
        label,
        type,
        icon,
        comment,
        moreHandles,
        withImage,
        withLabel,
        colorBorder,
      },
      position,
    }) => {
      if (task_type !== 'graph') {
        return {
          id: (id && id.toString()) || '',
          label,
          task_type,
          task_identifier,
          inputs_complete,
          task_generator: task_generator || undefined,
          default_error_node,
          default_error_attributes: default_error_node
            ? default_error_attributes
            : undefined,
          default_inputs: cleanDefaultInputs(default_inputs || []),
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
        id: (id && id.toString()) || '',
        label,
        task_type,
        task_identifier,
        inputs_complete,
        task_generator: task_generator || undefined,
        default_inputs: cleanDefaultInputs(default_inputs || []),
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
        // inputs: inputsSub,
        // outputs: outputsSub,
        // inputsFlow,
        // inputs: inputsFlow, // for connecting graphically to different input
      };
    }
  );
}

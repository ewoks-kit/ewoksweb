import type { EwoksNode, EwoksRFNode } from '../types';

// EwoksRFNode --> EwoksNode for saving
export function toEwoksNodes(nodes: EwoksRFNode[]): EwoksNode[] {
  // TODO: when input-arrow fake nodes exist remove them to get an Ewoks description
  const tempNodes: EwoksRFNode[] = [...nodes].filter(
    (nod) => !['graphInput', 'graphOutput', 'note'].includes(nod.task_type)
  );
  return tempNodes.map(
    ({
      id,
      task_type,
      task_identifier,
      // type, exists in EwoksRFNode but is the same as task_type
      inputs_complete,
      task_generator,
      default_inputs,
      default_error_node,
      default_error_attributes,
      data: {
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
          id: id.toString(),
          label,
          task_type,
          task_identifier,
          inputs_complete,
          task_generator,
          default_error_node,
          default_error_attributes,
          default_inputs:
            default_inputs &&
            default_inputs.map((dIn) => {
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
            }),
          uiProps: {
            label,
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
      // graphs separately only if a transformation is needed???
      return {
        id: id.toString(),
        task_type,
        task_identifier,
        // type: task_type,
        inputs_complete,
        task_generator,
        default_inputs,
        default_error_node,
        default_error_attributes,
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
        },
        // inputs: inputsSub,
        // outputs: outputsSub,
        // inputsFlow,
        // inputs: inputsFlow, // for connecting graphically to different input
      };
    }
  );
}

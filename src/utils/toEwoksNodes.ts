import type {
  DataMapping,
  DefaultErrorAttributes,
  EwoksDataMapping,
  EwoksNode,
  NodeWithData,
} from '../types';
import { calcDataMapping, notUndefinedValue } from './utils';

function calcDefaultErrorAttributes(
  default_error_attributes: DefaultErrorAttributes<DataMapping> | undefined,
): DefaultErrorAttributes<EwoksDataMapping> | undefined {
  if (default_error_attributes?.map_all_data) {
    return { map_all_data: true };
  }

  return {
    map_all_data: false,
    ...(default_error_attributes?.data_mapping &&
      default_error_attributes.data_mapping.length > 0 && {
        data_mapping: calcDataMapping(default_error_attributes.data_mapping),
      }),
  };
}

// EwoksRFNode --> EwoksNode for saving
export function toEwoksNodes(nodes: NodeWithData[]): EwoksNode[] {
  const regularNodes: NodeWithData[] = nodes.filter(
    (nod) =>
      !['graphInput', 'graphOutput', 'note'].includes(
        nod.data.task_props.task_type,
      ),
  );

  return regularNodes.map((node) => {
    const {
      id,
      data: {
        ewoks_props: {
          default_inputs,
          label,
          force_start_node,
          task_generator,
          default_error_node,
          default_error_attributes,
        },
        task_props: { task_type, task_identifier },
        ui_props: { icon, moreHandles, withImage, withLabel, colorBorder },
        comment,
      },
      position,
      width,
      height,
    } = node;

    return {
      id,
      label,
      task_type,
      task_identifier,
      ...(force_start_node ? { force_start_node } : {}),
      task_generator,
      default_inputs: default_inputs?.map(({ name, value }) => ({
        name,
        value,
      })),
      default_error_node,
      ...(default_error_node && {
        default_error_attributes: calcDefaultErrorAttributes(
          default_error_attributes,
        ),
      }),
      uiProps: {
        icon,
        ...(comment && { comment }),
        position,
        ...notUndefinedValue(moreHandles, 'moreHandles'),
        ...(colorBorder && { colorBorder }),
        ...notUndefinedValue(withImage, 'withImage'),
        ...notUndefinedValue(withLabel, 'withLabel'),
        width,
        height,
      },
    };
  });
}

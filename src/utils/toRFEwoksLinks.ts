import { nanoid } from 'nanoid';

import { colorToRFEdgeStyle } from '../edition/Sidebar/edit/utils';
import type { EwoksLinkUiProps, Workflow } from '../ewoksTypes';
import type { Condition, EdgeWithData, Task } from '../types';
import { findLinkInputs, findLinkOutputs } from './calcTasksForLink';
import { inputNodesAndLinks, outputNodesAndLinks } from './subgraphUtils';
import {
  convertEwoksMarkerEndToRF,
  createDataMappingData,
  getValueAndType,
  notUndefinedValue,
} from './utils';

const EDGE_LABEL_PADDING: [number, number] = [5, 2];

type WorkflowWithNodesLinks = Required<Workflow>;

export function toRFEwoksLinks(
  inputWorkflow: WorkflowWithNodesLinks,
  subgraphs: Workflow[],
  tasks: Task[],
): EdgeWithData[] {
  let id = 0;

  const { graph, nodes } = inputWorkflow;

  // DOC: calculate the links from inputs-outputs of the Ewoks workflow
  const { links: inputLinks } = inputNodesAndLinks(graph.input_nodes, nodes);
  const { links: outputLinks } = outputNodesAndLinks(graph.output_nodes, nodes);
  const links = [...inputWorkflow.links, ...inputLinks, ...outputLinks];

  return links.map(
    ({
      source,
      target,
      data_mapping,
      sub_target,
      sub_source,
      on_error,
      conditions,
      map_all_data,
      required,
      uiProps,
      startEnd,
    }) => {
      const conditionsForFront = conditions?.map<Condition>((con) => {
        return {
          rowId: nanoid(),
          name: con.source_output,
          ...getValueAndType(con.value),
        };
      });

      const linkInputNames = findLinkInputs(nodes, source, subgraphs, tasks);
      const linkOutputNames = findLinkOutputs(nodes, target, subgraphs, tasks);

      const link: EdgeWithData = {
        id: `${source}:${uiProps?.sourceHandle ?? ''}->${target}:${
          uiProps?.targetHandle ?? ''
        }_${id++}`,
        ...(uiProps?.label && { label: uiProps.label }),
        source: source.toString(),
        target: target.toString(),
        targetHandle: calcTargetHandle(uiProps, sub_target),
        sourceHandle: calcSourceHandle(uiProps, sub_source),
        ...notUndefinedValue(uiProps?.type, 'type'),
        ...notUndefinedValue(uiProps?.animated, 'animated'),
        markerEnd: convertEwoksMarkerEndToRF(uiProps?.markerEnd),
        labelBgPadding: EDGE_LABEL_PADDING,
        ...(uiProps?.color ? colorToRFEdgeStyle(uiProps.color) : {}),
        data: {
          // DOC: startEnd is not in EwoksLink on the server but needed for calculating
          // the in-out nodes-links.
          startEnd: !!startEnd,
          links_optional_output_names: linkOutputNames.optional,
          links_required_output_names: linkOutputNames.required,
          links_input_names: linkInputNames,
          ...(data_mapping &&
            data_mapping.length > 0 && {
              data_mapping: data_mapping.map(createDataMappingData),
            }),
          ...notUndefinedValue(required, 'required'),
          ...notUndefinedValue(sub_target, 'sub_target'),
          ...notUndefinedValue(sub_source, 'sub_source'),
          ...(conditionsForFront &&
            conditionsForFront.length > 0 && {
              conditions: conditionsForFront,
            }),
          ...notUndefinedValue(map_all_data, 'map_all_data'),
          ...notUndefinedValue(uiProps?.comment, 'comment'),
          ...notUndefinedValue(on_error, 'on_error'),
        },
      };

      return link;
    },
  );
}

function calcTargetHandle(
  uiProps: EwoksLinkUiProps | undefined,
  sub_target: string | undefined,
): string {
  return uiProps?.targetHandle ?? sub_target ?? 'tl';
}

function calcSourceHandle(
  uiProps: EwoksLinkUiProps | undefined,
  sub_source: string | undefined,
): string {
  return uiProps?.sourceHandle ?? sub_source ?? 'sr';
}

import { nanoid } from 'nanoid';

import { defaultLinkStyle } from '../edition/Canvas/utils';
import type {
  Condition,
  EdgeWithData,
  LinkUiProps,
  Task,
  Workflow,
} from '../types';
import { findLinkInputs, findLinkOutputs } from './calcTasksForLink';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import {
  convertEwoksMarkerEndToRF,
  createDataMappingData,
  getValueAndType,
  notUndefinedValue,
} from './utils';

type WorkflowWithNodesLinks = Required<Workflow>;

// DOC: from GraphEwoks get EwoksRFLinks
// - tempGraph: the graph to transform its links
// - newNodeSubgraphs: the subgraphs located in the supergraph.
export function toRFEwoksLinks(
  tempGraph: WorkflowWithNodesLinks,
  newNodeSubgraphs: Workflow[],
  tasks: Task[],
): EdgeWithData[] {
  let id = 0;

  // DOC: calculate the links from inputs-outputs of the Ewoks graph
  const inOutTempGraph = calcAllLinks(tempGraph);

  return inOutTempGraph.links.map(
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
      const color = uiProps?.style?.stroke || '#96a5f9';

      const conditionsForFront = conditions?.map<Condition>((con) => {
        return {
          rowId: nanoid(),
          name: con.source_output,
          ...getValueAndType(con.value),
        };
      });

      const linkInputNames = findLinkInputs(
        tempGraph.nodes,
        source,
        newNodeSubgraphs,
        tasks,
      );
      const linkOutputNames = findLinkOutputs(
        tempGraph.nodes,
        target,
        newNodeSubgraphs,
        tasks,
      );

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
        ...defaultLinkStyle,
        style: {
          ...defaultLinkStyle.style,
          stroke: color,
        },
        labelBgStyle: {
          ...defaultLinkStyle.labelBgStyle,
          stroke: color,
        },
        labelStyle: {
          ...defaultLinkStyle.labelStyle,
          color,
          fill: color,
        },
        data: {
          // DOC: startEnd is not in EwoksLink on the server but needed for calculating
          // the in-out nodes-links.
          startEnd: !!startEnd,
          ...(uiProps?.type === 'getAround' &&
            uiProps.getAroundProps && {
              getAroundProps: uiProps.getAroundProps,
            }),
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
  uiProps: LinkUiProps | undefined,
  sub_target: string | undefined,
): string {
  return uiProps?.targetHandle ?? sub_target ?? 'tl';
}

function calcSourceHandle(
  uiProps: LinkUiProps | undefined,
  sub_source: string | undefined,
): string {
  return uiProps?.sourceHandle ?? sub_source ?? 'sr';
}

function calcAllLinks({
  graph,
  nodes,
  links,
}: WorkflowWithNodesLinks): WorkflowWithNodesLinks {
  // DOC: calculate the links from inputs-outputs of the Ewoks graph
  const inNodeLinks = inNodesLinks(graph.input_nodes, nodes);
  const outNodeLinks = outNodesLinks(graph.output_nodes, nodes);
  return {
    graph,
    nodes,
    links: [...links, ...inNodeLinks.links, ...outNodeLinks.links],
  };
}

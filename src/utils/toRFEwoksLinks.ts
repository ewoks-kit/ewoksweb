import type { EwoksRFLink } from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import { calcTasksForLink } from './calcTasksForLink';
import existsOrValue from './existsOrValue';

// from GraphEwoks get EwoksRFLinks
// tempGraph: the graph to transform its links
// newNodeSubgraphs: the subgraphs located in the supergraph.
export function toRFEwoksLinks(
  tempGraph,
  newNodeSubgraphs,
  tasks
): EwoksRFLink[] {
  let id = 0;

  // calculate the links from inputs-outputs of the Ewoks graph
  const inOutTempGraph = calcInOutLinks(tempGraph);

  if (inOutTempGraph.links) {
    return inOutTempGraph.links.map(
      ({
        source,
        target,
        data_mapping = [],
        sub_target,
        sub_source,
        on_error,
        conditions,
        map_all_data,
        uiProps,
        startEnd,
      }) => {
        const [sourceTask, targetTask] = calcTasksForLink(
          tempGraph,
          source,
          target,
          newNodeSubgraphs,
          tasks
        );
        // console.log(source, target);
        // console.log(sourceTask, targetTask, valid);
        const color =
          (uiProps && uiProps.style && uiProps.style.stroke) ||
          'rgb(60, 81, 202)';

        return {
          // type: 'bendingText',
          // TODO? does not accept 2 links between the same nodes
          id: `${source as string}:${
            existsOrValue(uiProps, 'sourceHandle', '') as string
          }->${target as string}:${
            existsOrValue(uiProps, 'targetHandle', '') as string
          }_${id++}`,
          label: calcLabel(uiProps, conditions, data_mapping),
          source: source.toString(),
          target: target.toString(),
          startEnd: startEnd || '',
          targetHandle: calcTargetHandle(uiProps, sub_target),
          sourceHandle: calcSourceHandle(uiProps, sub_source),
          type: (uiProps && uiProps.type) || '',
          markerEnd: existsOrValue(uiProps, 'markerEnd', {
            type: 'arrowclosed',
          }),
          // labelStyle: uiProps && uiProps.labelStyle ? uiProps.labelStyle : {},
          animated: existsOrValue(uiProps, 'animated', false),
          style: {
            stroke:
              (uiProps && uiProps.style && uiProps.style.stroke) || '#96a5f9',
            strokeWidth: '3',
          },
          labelBgStyle: {
            fill: 'rgb(223, 226, 247)',
            // color: color,
            fillOpacity: 1,
            strokeWidth: 3,
            stroke: color,
          },
          // labelShowBg: false,
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelStyle: {
            color,
            fill: color,
            fontWeight: 500,
            fontSize: 14,
          },
          data: {
            // node optional_input_names are link's optional_output_names
            links_optional_output_names: targetTask.optional_input_names || [],
            // node required_input_names are link's required_output_names
            links_required_output_names: targetTask.required_input_names || [],
            // node output_names are link's input_names
            links_input_names: sourceTask.output_names || [],
            data_mapping,
            sub_target: sub_target || '',
            sub_source: sub_source || '',
            conditions: conditions || [],
            map_all_data: !!map_all_data,
            on_error: on_error || false,
            comment: existsOrValue(uiProps, 'comment', ''),
          },
        };
      }
    );
  }
  return [] as EwoksRFLink[];
}

function calcLabel(uiProps, conditions, data_mapping): string {
  return uiProps && uiProps.label
    ? uiProps.label
    : conditions && conditions.length > 0
    ? conditions
        .map((el) => `${el.source_output as string}->${el.value as string}`)
        .join(', ')
    : data_mapping && data_mapping.length > 0
    ? data_mapping
        .map(
          (el) => `${el.source_output as string}->${el.target_input as string}`
        )
        .join(', ')
    : '';
}

function calcTargetHandle(uiProps, sub_target) {
  return uiProps && uiProps.targetHandle
    ? uiProps.targetHandle
    : sub_target
    ? sub_target
    : ''; // TODO remove this? when stable
}

function calcSourceHandle(uiProps, sub_source) {
  return uiProps && uiProps.sourceHandle
    ? uiProps.sourceHandle
    : sub_source
    ? sub_source
    : '';
}

function calcInOutLinks(tempGraph) {
  // calculate the links from inputs-outputs of the Ewoks graph
  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);

  // accumulate all links inOutTempGraph
  const inOutTempGraph = { ...tempGraph };
  if (inNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...inNodeLinks.links];
  }
  if (outNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...outNodeLinks.links];
  }
  return inOutTempGraph;
}

import type {
  Condition,
  EwoksRFLink,
  GraphEwoks,
  Task,
  UiPropsLinks,
} from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import { findLinkInputs, findLinkOutputs } from './calcTasksForLink';
import { createDataMappingData } from './utils';
import { defaultLinkStyle } from '../edition/Canvas/utils';

// DOC: from GraphEwoks get EwoksRFLinks
// - tempGraph: the graph to transform its links
// - newNodeSubgraphs: the subgraphs located in the supergraph.
export function toRFEwoksLinks(
  tempGraph: GraphEwoks,
  newNodeSubgraphs: GraphEwoks[],
  tasks: Task[]
): EwoksRFLink[] {
  let id = 0;

  // DOC: calculate the links from inputs-outputs of the Ewoks graph
  const inOutTempGraph = calcInOutLinks(tempGraph);

  return inOutTempGraph.links.map(
    ({
      source,
      target,
      data_mapping = [],
      sub_target,
      sub_source,
      on_error = false,
      conditions = [],
      map_all_data,
      required = false,
      uiProps = {},
      startEnd,
    }) => {
      const color = uiProps.style?.stroke || '#96a5f9';

      const conditionsForFront = conditions.map<Condition>((con) => {
        return {
          name: con.source_output?.toString(),
          value: con.value,
        };
      });

      const linkInputNames = findLinkInputs(
        tempGraph.nodes,
        source,
        newNodeSubgraphs,
        tasks
      );
      const linkOutputNames = findLinkOutputs(
        tempGraph.nodes,
        target,
        newNodeSubgraphs,
        tasks
      );

      const link: EwoksRFLink = {
        id: `${source}:${uiProps.sourceHandle ?? ''}->${target}:${
          uiProps.targetHandle ?? ''
        }_${id++}`,
        label: uiProps.label,
        source: source.toString(),
        target: target.toString(),

        targetHandle: calcTargetHandle(uiProps, sub_target),
        sourceHandle: calcSourceHandle(uiProps, sub_source),
        type: uiProps.type || '',
        markerEnd: uiProps.markerEnd ?? '',
        animated: uiProps.animated ?? false,
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
          startEnd: startEnd || false,
          getAroundProps: uiProps.getAroundProps || {
            x: 0,
            y: 0,
          },
          links_optional_output_names: linkOutputNames.optional,
          links_required_output_names: linkOutputNames.required,
          links_input_names: linkInputNames,
          data_mapping: data_mapping.map(createDataMappingData),
          required,
          sub_target,
          sub_source,
          conditions: conditionsForFront,
          map_all_data:
            map_all_data === undefined
              ? data_mapping.length === 0
              : map_all_data,
          on_error,
          comment: uiProps.comment ?? '',
        },
      };
      return link;
    }
  );
}

function calcTargetHandle(
  uiProps: UiPropsLinks | undefined,
  sub_target: string | undefined
): string {
  return uiProps?.targetHandle ?? sub_target ?? 'tl';
}

function calcSourceHandle(
  uiProps: UiPropsLinks | undefined,
  sub_source: string | undefined
): string {
  return uiProps?.sourceHandle ?? sub_source ?? 'sr';
}

function calcInOutLinks(tempGraph: GraphEwoks): GraphEwoks {
  // DOC: calculate the links from inputs-outputs of the Ewoks graph
  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);

  // DOC: accumulate all links inOutTempGraph
  const inOutTempGraph: GraphEwoks = { ...tempGraph };
  if (inNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...inNodeLinks.links];
  }
  if (outNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...outNodeLinks.links];
  }

  return inOutTempGraph;
}

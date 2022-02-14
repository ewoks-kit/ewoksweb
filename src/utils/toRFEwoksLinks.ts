import type { EwoksRFLink, GraphEwoks, Task } from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';

// from GraphEwoks get EwoksRFLinks
export function toRFEwoksLinks(
  tempGraph, // TODO : GraphEwoks
  newNodeSubgraphs,
  tasks
): EwoksRFLink[] {
  // tempGraph: the graph to transform its links
  // newNodeSubgraphs: the subgraphs located in the supergraph.
  // If wrong task_identifier or non-existing graph tempGraph is not in there
  let id = 0;

  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);
  // console.log(tempGraph, newNodeSubgraphs, inNodeLinks, outNodeLinks);

  const inOutTempGraph = { ...tempGraph };
  if (inNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...inNodeLinks.links];
  }
  if (outNodeLinks.links.length > 0) {
    inOutTempGraph.links = [...inOutTempGraph.links, ...outNodeLinks.links];
  }

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
        // find the outputs-inputs from the connected nodes
        const sourceTmp = tempGraph.nodes.find((nod) => nod.id === source);
        const targetTmp = tempGraph.nodes.find((nod) => nod.id === target);
        // if undefined source or/and target node does not exist

        // console.log('TASKSTMP:', sourceTmp, targetTmp);
        let sourceTask = {} as Task;
        let targetTask = {} as Task;
        if (sourceTmp) {
          if (sourceTmp.task_type !== 'graph') {
            // TODO: if a task find it in tasks. IF NOT THERE?
            sourceTask = tasks.find(
              (tas) => tas.task_identifier === sourceTmp.task_identifier
            );
          } else {
            // TODO following line exuiProps.commentamine
            // if node=subgraph calculate inputs-outputs from subgraph.graph
            const subgraphNodeSource = newNodeSubgraphs.find(
              (subGr) => subGr.graph.id === sourceTmp.task_identifier
            );

            const outputs = [];

            if (subgraphNodeSource) {
              subgraphNodeSource.graph.output_nodes.forEach((out) =>
                outputs.push(out.id)
              );
            }
            sourceTask = {
              task_type: sourceTmp.task_type,
              task_identifier: sourceTmp.task_identifier,
              // optional_input_names: sourceTmp.optional_input_names,
              output_names: outputs,
              // required_input_names: sourceTask.required_input_names,
            };
          }
        }
        if (targetTmp) {
          if (targetTmp.task_type !== 'graph') {
            // TODO: if a task find it in tasks. IF NOT THERE? add a default?
            targetTask = tasks.find(
              (tas) => tas.task_identifier === targetTmp.task_identifier
            );
          } else {
            // TODO following line examine
            const subgraphNodeTarget = newNodeSubgraphs.find(
              (subGr) => subGr.graph.id === targetTmp.task_identifier
            );
            // if subgraphNodeTarget undefined = not fount
            const inputs = [];
            if (subgraphNodeTarget) {
              subgraphNodeTarget.graph.input_nodes.forEach((inp) =>
                inputs.push(inp.id)
              );
            }

            targetTask = {
              task_type: targetTmp.task_type,
              task_identifier: targetTmp.task_identifier,
              optional_input_names: inputs,
              required_input_names: [],
            };
          }
        }
        // if not found app does not break, put an empty skeleton
        sourceTask = sourceTask
          ? sourceTask
          : {
              output_names: [],
            };
        targetTask = targetTask
          ? targetTask
          : {
              optional_input_names: [],
              required_input_names: [],
            };
        return {
          // TODO: does not accept 2 links between the same nodes?
          id: `${source}:${
            uiProps && uiProps.sourceHandle ? uiProps.sourceHandle : ''
          }->${target}:${uiProps && uiProps.targetHandle}_${id++}`,
          // Label if empty use data-mapping
          label:
            uiProps && uiProps.label
              ? uiProps.label
              : conditions && conditions.length > 0
              ? conditions
                  .map((el) => `${el.source_output}->${el.value}`)
                  .join(', ')
              : data_mapping && data_mapping.length > 0
              ? data_mapping
                  .map((el) => `${el.source_output}->${el.target_input}`)
                  .join(', ')
              : '',
          source: source.toString(),
          target: target.toString(),
          startEnd: startEnd ? startEnd : '',
          targetHandle:
            uiProps && uiProps.targetHandle
              ? uiProps.targetHandle
              : sub_target
              ? sub_target
              : '', // TODO remove this? when stable
          sourceHandle:
            uiProps && uiProps.sourceHandle
              ? uiProps.sourceHandle
              : sub_source
              ? sub_source
              : '',
          type: uiProps && uiProps.type ? uiProps.type : '',
          arrowHeadType:
            uiProps && uiProps.arrowHeadType
              ? uiProps.arrowHeadType
              : 'arrowclosed',
          // labelStyle: uiProps && uiProps.labelStyle ? uiProps.labelStyle : {},
          animated: uiProps && uiProps.animated ? uiProps.animated : false,
          style: {
            stroke:
              uiProps && uiProps.style && uiProps.style.stroke
                ? uiProps.style.stroke
                : '#96a5f9',
            strokeWidth: '3',
          },
          labelBgStyle: {
            fill: 'rgb(223, 226, 247)',
            color: 'rgb(50, 130, 219)',
            fillOpacity: 1,
            // border: '5px solid red'
          },
          // labelShowBg: false,
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelStyle: { fill: 'blue', fontWeight: 500, fontSize: 14 },
          data: {
            // node optional_input_names are link's optional_output_names
            links_optional_output_names: targetTask.optional_input_names || [],
            // node required_input_names are link's required_output_names
            links_required_output_names: targetTask.required_input_names || [],
            // node output_names are link's input_names
            links_input_names: sourceTask.output_names || [],
            data_mapping,
            sub_target: sub_target ? sub_target : '',
            sub_source: sub_source ? sub_source : '',
            conditions: conditions ? conditions : [],
            map_all_data: !!map_all_data,
            on_error: on_error ? on_error : false,
            comment: uiProps && uiProps.comment ? uiProps.comment : '',
          },
        };
      }
    );
  }
  return [] as EwoksRFLink[];
}

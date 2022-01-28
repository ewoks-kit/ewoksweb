import type { EwoksRFNode, GraphRF } from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';

// Accepts a GraphEwoks and returns an EwoksRFNode[]
export function toRFEwoksNodes(
  tempGraph,
  newNodeSubgraphs,
  tasks
): EwoksRFNode[] {
  // Find input and output nodes of the graph
  const inputsAl = inputsAll(tempGraph);

  const outputsAll =
    tempGraph.graph &&
    tempGraph.graph.output_nodes &&
    tempGraph.graph.output_nodes.map((nod) => nod.node);

  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);
  // console.log(tempGraph, newNodeSubgraphs, inNodeLinks, outNodeLinks);
  const inOutTempGraph = { ...tempGraph };
  if (inNodeLinks.nodes.length > 0) {
    inOutTempGraph.nodes = [...inOutTempGraph.nodes, ...inNodeLinks.nodes];
  }
  if (outNodeLinks.nodes.length > 0) {
    inOutTempGraph.nodes = [...inOutTempGraph.nodes, ...outNodeLinks.nodes];
  }

  if (inOutTempGraph.nodes) {
    return inOutTempGraph.nodes.map(
      ({
        id,
        task_type,
        task_identifier,
        label,
        default_inputs,
        inputs_complete,
        task_generator,
        // need to put
        task_icon,
        task_category,
        uiProps,
      }) => {
        // console.log(task_identifier);
        // calculate if node input and/or output or internal
        const isInput = inputsAl && inputsAl.includes(id);
        const isOutput = outputsAll && outputsAll.includes(id);
        let nodeType = '';
        if (isInput && isOutput) {
          nodeType = 'input_output';
        } else if (isInput) {
          nodeType = 'input';
        } else if (isOutput) {
          nodeType = 'output';
        } else if (task_type === 'graphInput') {
          nodeType = 'graphInput';
        } else if (task_type === 'graphOutput') {
          nodeType = 'graphOutput';
        } else {
          nodeType = 'internal';
        }

        // locate the task and add required+optional-inputs + outputs
        let tempTask = tasks.find(
          (tas) => tas.task_identifier === task_identifier
        );
        // if it is not in the tasks list like a new task or subgraph?
        // Not in the list => add a default one FAILSAFE TODO

        // for subgraph calculate through input_nodes, output_nodes
        tempTask = tempTask
          ? tempTask // if you found the Task return it
          : task_type === 'graph' // if not found check if it is a graph
          ? tempTask // if a graph return it and if not add some default inputs-outputs
          : {
              optional_input_names: [],
              output_names: [],
              required_input_names: [],
            };

        if (task_type !== 'graph') {
          // console.log(
          //   task_identifier,
          //   task_generator,
          //   task_category,
          //   task_icon
          // );
          return {
            id: id.toString(),
            task_type,
            task_identifier,
            type: task_type, // need it for visualizing dataNodes
            inputs_complete: inputs_complete ? inputs_complete : false,
            task_generator: task_generator ? task_generator : '',
            task_icon: task_icon || '',
            task_category: task_category || '',
            default_inputs: default_inputs ? default_inputs : [],
            optional_input_names: tempTask.optional_input_names,
            output_names: tempTask.output_names,
            required_input_names: tempTask.required_input_names,
            label,
            // TODO: style directly applies to node and should be saved in ui props
            // style: {
            //   background: '#D6D5E6',
            //   color: '#333',
            //   // border: '1px solid #222138',
            //   // width: 180,
            // },
            data: {
              label: label ? label : task_identifier,
              type: nodeType,
              icon: uiProps && uiProps.icon ? uiProps.icon : '',
              comment: uiProps && uiProps.comment ? uiProps.comment : '',
              moreHandles:
                uiProps && 'moreHandles' in uiProps
                  ? uiProps.moreHandles
                  : false,
            },
            position:
              uiProps && uiProps.position
                ? uiProps.position
                : { x: 100, y: 100 },
          };
        }
        // if node=subgraph calculate inputs-outputs from subgraph.graph
        const subgraphNode: GraphRF = newNodeSubgraphs.find(
          (subGr) => subGr.graph.id === task_identifier
        );
        let inputsSub = [];
        let outputsSub = [];
        if (subgraphNode && subgraphNode.graph.id) {
          inputsSub = subgraphNode.graph.input_nodes.map((input) => {
            return {
              id: input.id,
              label: `${
                input.uiProps && input.uiProps.label
                  ? input.uiProps.label
                  : input.id
              }: ${input.node} ${
                input.sub_node ? `  -> ${input.sub_node}` : ''
              }`,
              type: 'data ',
            };
          });
          outputsSub = subgraphNode.graph.output_nodes.map((output) => {
            return {
              id: output.id,
              label: `${
                uiProps in output && output.uiProps.label
                  ? output.uiProps.label
                  : output.id
              }: ${output.node} ${
                output.sub_node ? ` -> ${output.sub_node}` : ''
              }`,
              type: 'data ',
            };
          });
        } else {
          inputsSub = [{ label: 'unknown_input', type: 'data' }];
          outputsSub = [{ label: 'unknown_output', type: 'data' }];
        }

        return {
          id: id.toString(),
          task_type,
          task_identifier,
          type: task_type,
          inputs_complete: inputs_complete ? inputs_complete : false,
          task_generator: task_generator ? task_generator : '',
          default_inputs: default_inputs ? default_inputs : [],
          label,
          data: {
            label: label ? label : task_identifier,
            type: nodeType,
            exists: subgraphNode && !!subgraphNode.graph.id,
            inputs: inputsSub,
            outputs: outputsSub,
            // inputsFlow,
            icon: uiProps && uiProps.icon ? uiProps.icon : '',
            comment: uiProps && uiProps.comment ? uiProps.comment : '',
            moreHandles:
              uiProps && 'moreHandles' in uiProps ? uiProps.moreHandles : false,
          },
          // inputs: inputsFlow, // for connecting graphically to different input
          position: uiProps.position,
        };
      }
    );
  }

  return [] as EwoksRFNode[];
}

const inputsAll = (tempGraph) => {
  return (
    tempGraph.graph &&
    tempGraph.graph.input_nodes &&
    tempGraph.graph.input_nodes.map((nod) => nod.node)
  );
};

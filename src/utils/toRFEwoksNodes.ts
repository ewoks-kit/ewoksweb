import type { EwoksRFNode, GraphRF } from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import existsOrValue from './existsOrValue';

// Accepts a GraphEwoks and returns an EwoksRFNode[]
export function toRFEwoksNodes(
  tempGraph,
  newNodeSubgraphs,
  tasks
): EwoksRFNode[] {
  // Find input and output nodes of the graph
  const inputsAl = inputsAll(tempGraph);

  const outputsAl = outputsAll(tempGraph);

  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);

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
        label, // TODO: node has a label everytime? Then dont use the one in uiProps
        default_inputs,
        inputs_complete,
        default_error_node,
        default_error_attributes,
        task_generator,
        task_icon,
        task_category,
        uiProps,
      }) => {
        const nodeType = calcNodeType(inputsAl, outputsAl, task_type, id);

        const node: EwoksRFNode = {
          id: id.toString(),
          task_type,
          task_identifier,
          type: task_type,
          inputs_complete: inputs_complete || false,
          default_error_node: default_error_node || false,
          default_error_attributes: default_error_attributes || {
            map_all_data: true,
            data_mapping: [],
          },
          task_generator: task_generator || '',
          task_icon: task_icon || '',
          default_inputs: default_inputs || [],
          data: {
            label: label ? label : task_identifier,
            type: nodeType,
            icon: existsOrValue(uiProps, 'icon', ''),
            comment: existsOrValue(uiProps, 'comment', ''),
            moreHandles: existsOrValue(uiProps, 'moreHandles', false),
            executing: false,
            withImage: existsOrValue(uiProps, 'withImage', true),
            withLabel: existsOrValue(uiProps, 'withLabel', true),
            colorBorder: existsOrValue(uiProps, 'colorBorder', ''),
          },
          position: existsOrValue(uiProps, 'position', { x: 100, y: 100 }),
        };

        return addNodeProperties(
          task_type,
          newNodeSubgraphs,
          task_identifier,
          uiProps,
          node,
          tasks,
          task_category
        );
      }
    );
  }

  return [] as EwoksRFNode[];
}

function inputsAll(tempGraph) {
  return (
    tempGraph.graph &&
    tempGraph.graph.input_nodes &&
    tempGraph.graph.input_nodes.map((nod) => nod.node)
  );
}

function outputsAll(tempGraph) {
  return (
    tempGraph.graph &&
    tempGraph.graph.output_nodes &&
    tempGraph.graph.output_nodes.map((nod) => nod.node)
  );
}

// calculate if node input and/or output or internal
function calcNodeType(inputsAl, outputsAll, task_type, id) {
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
  return nodeType;
}

// locate the task and add required+optional-inputs + outputs
function calcTask(tasks, task_identifier, task_type) {
  let tempTask = tasks.find((tas) => tas.task_identifier === task_identifier);

  tempTask = tempTask
    ? tempTask // if you found the Task return it
    : task_type === 'graph' // if not found check if it is a graph
    ? tempTask // if a graph return it and if not add some default inputs-outputs
    : {
        optional_input_names: [],
        output_names: [],
        required_input_names: [],
      };
  return tempTask;
}

function calcInOutForSubgraph(subgraphNode) {
  let inputsSub = [];
  let outputsSub = [];

  if (subgraphNode && subgraphNode.graph.id) {
    const allOutputsIds = subgraphNode.graph.output_nodes.map((nod) => nod.id);
    const allInputsIds = subgraphNode.graph.input_nodes.map((nod) => nod.id);

    inputsSub = subgraphNode.graph.input_nodes.map((input) => {
      allInputsIds.shift();

      return {
        id: input.id,
        label: calcLabel(input, allInputsIds),
        // `${
        //   ('uiProps' in input && (input.uiProps.label as string)) ||
        //   (input.id as string)
        // }${allInputsIds.includes(input.id) ? '_' : ':'} ${
        //   input.node as string
        // } ${input.sub_node ? `  -> ${input.sub_node as string}` : ''}`,
        type: 'data ',
      };
    });

    outputsSub = subgraphNode.graph.output_nodes.map((output) => {
      allOutputsIds.shift();

      return {
        id: output.id,
        label: calcLabel(output, allOutputsIds),
        // `${
        //   ('uiProps' in output && (output.uiProps.label as string)) ||
        //   (output.id as string)
        // }${allOutputsIds.includes(output.id) ? '_' : ':'} ${
        //   output.node as string
        // } ${output.sub_node ? ` -> ${output.sub_node as string}` : ''}`,
        type: 'data ',
      };
    });
  } else {
    inputsSub = [{ label: 'unknown_input', type: 'data' }];
    outputsSub = [{ label: 'unknown_output', type: 'data' }];
  }
  return [inputsSub, outputsSub];
}

function calcLabel(inOut, allInOutputsIds) {
  return `${
    ('uiProps' in inOut && (inOut.uiProps.label as string)) ||
    (inOut.id as string)
  }${allInOutputsIds.includes(inOut.id) ? '_' : ':'} ${inOut.node as string} ${
    inOut.sub_node ? `  -> ${inOut.sub_node as string}` : ''
  }`;
}

function addNodeProperties(
  task_type,
  newNodeSubgraphs,
  task_identifier,
  uiProps,
  node,
  tasks,
  task_category
) {
  let tempNode = { ...node };
  if (task_type === 'graph') {
    // if node=subgraph calculate inputs-outputs from subgraph.graph
    const subgraphNode: GraphRF = newNodeSubgraphs.find(
      (subGr) => subGr.graph.id === task_identifier
    );

    const [inputsSub, outputsSub] = calcInOutForSubgraph(subgraphNode);

    tempNode = {
      ...tempNode,
      data: {
        ...tempNode.data,
        exists: subgraphNode && !!subgraphNode.graph.id,
        inputs: inputsSub,
        outputs: outputsSub,
      },
    };
  } else {
    // locate the task and add required+optional-inputs + outputs
    const tempTask = calcTask(tasks, task_identifier, task_type);

    tempNode = {
      ...tempNode,
      task_category: task_category || '',
      optional_input_names: tempTask.optional_input_names,
      output_names: tempTask.output_names,
      required_input_names: tempTask.required_input_names,
    };
  }

  return tempNode;
}

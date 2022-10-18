import type { GraphEwoks } from '../types';

function assertLog(statement, severity = 'info') {
  // severity can be error, warning, info
  if (severity === 'error') {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.error(statement);
  } else if (severity === 'warning') {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.warn(statement);
  } else {
    /* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
    console.info(statement);
  }
}

function isJsonString(str) {
  // try {
  return JSON.parse(str);
  // } catch (error) {
  //   // console.log(error);
  //   return false;
  // }
  // return true;
}

function includes(entity: {}, label: string, properties: string[]) {
  // console.info(entity, properties);
  let result = true;
  properties.forEach((pr) => {
    if (Object.keys(entity).includes(pr)) {
      assertLog(`${label} has "${pr}"`);
    } else {
      assertLog(`${label} does not have a ${pr}`, 'error');
      result = false;
    }
  });
  return result;
}

export function validateEwoksGraph(graph: GraphEwoks) {
  const result = [];
  // // console.log(graph);
  result.push(isJsonString(JSON.stringify(graph)));
  // graph structure
  result.push(
    includes(graph, `graph: ${graph.graph && graph.graph.id}`, [
      'graph',
      'nodes',
      'links',
    ])
  );
  result.push(
    includes(graph.graph, `graph.graph: ${graph.graph.id}`, [
      'id',
      // 'label',
      'input_nodes',
      'output_nodes',
      // 'uiProps',
    ])
  );
  result.push(
    graph.nodes.forEach((nod) =>
      includes(nod, `node: ${nod.id}`, [
        'id',
        // 'label',
        'task_type',
        'task_identifier',
        'uiProps',
      ])
    )
  );
  // not uiProps position warn
  result.push(
    graph.links.forEach((link) =>
      includes(link, `Link from: ${link.source}`, ['source', 'target'])
    )
  );

  // type of some properties

  // relationships between properties
  const nodeIds = new Set(graph.nodes.map((nod) => nod.id));
  if (nodeIds.size !== graph.nodes.length) {
    result.push(false);
    // console.error('At least one node id is not unique');
  }

  console.log(nodeIds);

  graph.links.forEach((link, index) => {
    // DOC: links should have both ends attached to nodes or else delete link
    // since it is not shown on the canvas
    if (!nodeIds.has(link.source) || !nodeIds.has(link.target)) {
      assertLog(`${link.source} does not exist`);
      result.push(true);
    } else {
      result.push(false);
      // console.error(
      // `link ${index} ${link.source} ${link.target} has wrong source and/or target node id`
      // );
    }
  });

  // graph.input_nodes.forEach((input, index) => {
  //   if (input.sub_node) {
  //     // The subgraph does not exist or has changed its input names remove link
  //   }
  //   if (!nodeIds.has(input.node)) {
  //     assertLog(`${input.node} mentioned on an input-link does not exist`);
  //     result.push(true);
  //   } else {
  //     result.push(false);
  //     // console.error(
  //     // `link ${index} ${link.source} ${link.target} has wrong source and/or target node id`
  //     // );
  //   }
  // });

  // if subgraphs exist look for the whole tree if it exists and warn

  // // console.log(result);
  return { result: !result.includes(false), logs: {} };
}

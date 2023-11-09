import type { Connection, Edge } from 'reactflow';

import type { NodeData, NodeWithData } from '../types';

export default function isValidLink(
  connection: Connection,
  nodes: NodeWithData[],
  graphLinks: Edge[],
  nodesData?: Map<string, NodeData>,
  oldEdge?: Edge,
): { isValid: boolean; reason: string } {
  let isValid = true;
  let reason = '';

  // DOC: if an old edge was dragged remove it before validating the new edge
  const links = oldEdge?.id
    ? graphLinks.filter((link) => link.id !== oldEdge.id)
    : graphLinks;

  const source = nodes.find((nod) => nod.id === connection.source);
  const target = nodes.find((nod) => nod.id === connection.target);

  if (!source || !target) {
    return { isValid: false, reason: 'One of the link end is not defined' };
  }

  if (nodesData?.get(source.id)?.task_props.task_type === 'graphInput') {
    // check if there is already a link using this graph-input
    if (links.some((link) => link.source === source.id)) {
      isValid = false;
      reason = 'Cannot connect an input with more than one node';
    }

    // DOC: if connected with a graph take the targetHandle into account
    // else compare only the node id
    if (target.type === 'graph') {
      if (
        links.some((link) => {
          return (
            link.target === target.id &&
            link.targetHandle === connection.targetHandle
          );
        })
      ) {
        isValid = false;
        reason =
          'Cannot connect an input with an already connected node-handle';
      }
    } else {
      if (
        links.some((link) => {
          return link.target === target.id;
        })
      ) {
        isValid = false;
        reason = 'Cannot connect an input with an already connected node';
      }
    }
  }

  if (nodesData?.get(target.id)?.task_props.task_type === 'graphOutput') {
    // DOC: check if there is already a link using this graph-output
    if (links.some((link) => link.target === target.id)) {
      isValid = false;
      reason = 'Cannot connect an output with more than one node';
    }

    if (source.type === 'graph') {
      // DOC: if connected with a graph take the sourceHandle into account
      if (
        links.some((link) => {
          return (
            link.source === source.id &&
            link.sourceHandle === connection.sourceHandle
          );
        })
      ) {
        isValid = false;
        reason =
          'Cannot connect an output with an already connected node-handle';
      }
    } else {
      if (
        links.some((link) => {
          return link.source === source.id;
        })
      ) {
        isValid = false;
        reason = 'Cannot connect an output with an already connected node';
      }
    }
  }

  // if two nodes are already connected
  // Take into account if one or both nodes that need connection are graphs
  // if graph take into account the exact sourceHandle or targetHandle
  // if not.a.graph dont take into account the Handlers
  // TODO: string comparing with slice() is error-prone... Solution
  if (
    (source.type !== 'graph' &&
      target.type !== 'graph' &&
      links.some(
        (link) =>
          link.source === connection.source &&
          link.target === connection.target,
      )) ||
    (source.type === 'graph' &&
      target.type !== 'graph' &&
      links.some(
        (link) =>
          link.source === connection.source &&
          link.target === connection.target &&
          (link.sourceHandle?.slice(0, -5) === connection.sourceHandle ||
            link.sourceHandle === connection.sourceHandle?.slice(0, -5) ||
            link.sourceHandle === connection.sourceHandle),
      )) ||
    (source.type !== 'graph' &&
      target.type === 'graph' &&
      links.some(
        (link) =>
          link.source === connection.source &&
          link.target === connection.target &&
          (link.targetHandle?.slice(0, -6) === connection.targetHandle ||
            link.targetHandle === connection.targetHandle?.slice(0, -6) ||
            link.targetHandle === connection.targetHandle),
      )) ||
    (source.type === 'graph' &&
      target.type === 'graph' &&
      links.some(
        (link) =>
          link.source === connection.source &&
          link.target === connection.target &&
          (link.targetHandle?.slice(0, -6) === connection.targetHandle ||
            link.targetHandle === connection.targetHandle?.slice(0, -6) ||
            link.targetHandle === connection.targetHandle) &&
          (link.sourceHandle?.slice(0, -5) === connection.sourceHandle ||
            link.sourceHandle === connection.sourceHandle?.slice(0, -5) ||
            link.sourceHandle === connection.sourceHandle),
      ))
  ) {
    isValid = false;
    reason = `Cannot re-connect two nodes. Use data mapping instead in order to
      map different values on the same link!`;
  }

  return { isValid, reason };
}

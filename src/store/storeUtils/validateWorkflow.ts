import type { Workflow } from '../../types';

export function validateWorkflow(workflow: Workflow): {
  valid: boolean;
  invalidReason?: string;
} {
  // Validate graph in workflow
  if (!('graph' in workflow)) {
    return {
      valid: false,
      invalidReason: 'Missing required property "graph"',
    };
  }
  if (!('id' in workflow.graph)) {
    return {
      valid: false,
      invalidReason: 'Missing required property "id" in graph',
    };
  }
  // Validate nodes in workflow
  if (!('nodes' in workflow)) {
    return {
      valid: false,
      invalidReason: 'Missing required property "nodes"',
    };
  }
  if (!Array.isArray(workflow.nodes)) {
    return {
      valid: false,
      invalidReason: 'Nodes are not an array in the workflow description',
    };
  }
  if (workflow.nodes.some((node) => !('id' in node))) {
    return {
      valid: false,
      invalidReason: 'One or more Nodes have no "id"',
    };
  }
  // Validate links in workflow
  if (!('links' in workflow)) {
    return {
      valid: false,
      invalidReason: 'Missing required property "links"',
    };
  }
  if (!Array.isArray(workflow.links)) {
    return {
      valid: false,
      invalidReason: 'Links are not an array in the workflow description',
    };
  }
  if (workflow.links.some((link) => !('source' in link))) {
    return {
      valid: false,
      invalidReason: 'One or more Links have no "source"',
    };
  }
  if (workflow.links.some((link) => !('target' in link))) {
    return {
      valid: false,
      invalidReason: 'One or more Links have no "target"',
    };
  }

  return { valid: true };
}

import type { Workflow } from '../../../src/types';
import { MarkerType } from 'reactflow';

export function emptyWorkflow(id: string): Workflow {
  return { graph: { id }, nodes: [], links: [] };
}

export function withCategoryCommentLabelWorkflow(id: string): Workflow {
  return {
    ...emptyWorkflow(id),
    graph: {
      id,
      label: id,
      category: 'graph category',
      uiProps: { comment: 'graph comment' },
    },
  };
}

export function simpleNodeWorkflow(id: string): Workflow {
  return {
    ...emptyWorkflow(id),
    nodes: [
      {
        id: 'taskSkeleton0',
        label: 'taskSkeleton',
        task_type: 'ppfmethod',
        task_identifier: 'taskSkeleton',
        uiProps: {},
      },
    ],
  };
}

export function populatedNodeWorkflow(id: string): Workflow {
  return {
    ...emptyWorkflow(id),
    nodes: [
      {
        id: 'taskSkeleton0',
        label: 'theNewLabel',
        task_type: 'ppfmethod',
        task_identifier: 'taskSkeleton',
        default_inputs: [{ name: 'default_input', value: 'isaString' }],
        uiProps: {
          comment: 'node comment',
          moreHandles: true,
          withImage: false,
        },
      },
    ],
  };
}

export function simpleLinkWorkflow(id: string): Workflow {
  return {
    graph: { id },
    nodes: [
      {
        id: 'taskSkeleton1',
        label: 'taskSkeleton',
        task_type: 'ppfmethod',
        task_identifier: 'taskSkeleton',
        uiProps: {},
      },
      {
        id: 'taskSkeleton0',
        label: 'theNewLabel',
        task_type: 'ppfmethod',
        task_identifier: 'taskSkeleton',
        default_inputs: [{ name: 'default_input', value: 'isaString' }],
        uiProps: {
          comment: 'node comment',
          moreHandles: true,
          withImage: false,
        },
      },
    ],
    links: [
      { source: 'taskSkeleton0', target: 'taskSkeleton1', map_all_data: true },
    ],
  };
}

export function populatedLinkWorkflow(id: string): Workflow {
  return {
    ...simpleLinkWorkflow(id),
    links: [
      {
        source: 'taskSkeleton0',
        target: 'taskSkeleton1',
        data_mapping: [
          {
            source_output: 'sourceDataMapping',
            target_input: 'targetDataMapping',
          },
        ],
        conditions: [{ source_output: 'outputConditions', value: true }],
        on_error: false,
        required: true,
        map_all_data: false,
        uiProps: {
          label: 'linkLabel',
          comment: 'linkComment',
          type: 'straight',
          animated: true,
        },
      },
    ],
  };
}

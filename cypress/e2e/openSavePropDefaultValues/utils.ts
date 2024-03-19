export function emptyWorkflow(id: string) {
  return { graph: { id }, nodes: [], links: [] };
}

export function addPUTInterceptor(id: string, expectedWorkflow: any) {
  cy.intercept('PUT', `api/workflow/${id}`, (req) => {
    const removedPositionworkflow = Cypress._.cloneDeep(req.body);
    Cypress._.each(removedPositionworkflow.nodes, (node) => {
      if (node.uiProps && node.uiProps.position) {
        node.uiProps.position = {};
      }
    });

    expect(removedPositionworkflow).to.deep.equal(expectedWorkflow);
  });
}

export function withCategoryCommentLabelWorkflow(id: string) {
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

export function simpleNodeWorkflow(id: string) {
  return {
    ...emptyWorkflow(id),
    nodes: [
      {
        id: 'taskSkeleton0',
        task_type: 'ppfmethod',
        task_identifier: 'taskSkeleton',
        uiProps: { position: {} },
      },
    ],
  };
}

export function populatedNodeWorkflow(id: string) {
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
          position: {},
        },
      },
    ],
  };
}

export function simpleLinkWorkflow(id: string) {
  return {
    graph: { id },
    nodes: [
      {
        id: 'taskSkeleton1',
        task_type: 'ppfmethod',
        task_identifier: 'taskSkeleton',
        uiProps: { position: {} },
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
          position: {},
        },
      },
    ],
    links: [
      {
        source: 'taskSkeleton0',
        target: 'taskSkeleton1',
        map_all_data: true,
      },
    ],
  };
}

export function simpleLinkWorkflowMarkerEnd(id: string) {
  return {
    ...simpleLinkWorkflow(id),
    links: [
      {
        source: 'taskSkeleton0',
        target: 'taskSkeleton1',
        map_all_data: true,
        markerEnd: '',
      },
    ],
  };
}

export function populatedLinkWorkflow(id: string) {
  return {
    ...simpleLinkWorkflowMarkerEnd(id),
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
          markerEnd: '',
        },
      },
    ],
  };
}

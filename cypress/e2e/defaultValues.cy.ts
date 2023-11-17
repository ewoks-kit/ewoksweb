import { nanoid } from 'nanoid';

beforeEach(() => {
  cy.loadAppWithoutGraph();
});

const id = nanoid();

it('Saves correctly an empty workflow', () => {
  cy.intercept('POST', '/workflows', (req) => {
    expect(req.body).to.deep.equal({ graph: { id }, nodes: [], links: [] });
  });
  cy.saveEmptyWorkflow(id);
});

it('Saves correctly an empty existing workflow', () => {
  cy.loadGraph(id);
  cy.intercept('PUT', `/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal({ graph: { id }, nodes: [], links: [] });
  });
  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Saves correctly workflow comment, category and label', () => {
  // TODO: Also check the structure after opening
  cy.loadGraph(id);
  cy.intercept('PUT', `/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal({
      graph: {
        id,
        label: id,
        category: 'till forever ends',
        uiProps: { comment: 'Always and forever' },
      },
      nodes: [],
      links: [],
    });
  });
  cy.findByRole('textbox', { name: 'Edit label' }).click().type(id);
  cy.findByRole('textbox', { name: 'Edit comment' })
    .click()
    .type('Always and forever');
  cy.findByRole('textbox', { name: 'Edit category' })
    .click()
    .type('till forever ends');
  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Saves correctly workflow after deleting comment, category and label', () => {
  cy.loadGraph(id);
  cy.intercept('PUT', `/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal({ graph: { id }, nodes: [], links: [] });
  });

  cy.findByRole('textbox', { name: 'Edit label' }).clear();
  cy.findByRole('textbox', { name: 'Edit comment' }).clear();
  cy.findByRole('textbox', { name: 'Edit category' }).clear();

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Saves correctly a skeleton node right after dropping it on canvas', () => {
  cy.loadGraph(id);
  cy.intercept('PUT', `/workflow/${id}`, (req) => {
    const removedPositionworkflow = Cypress._.cloneDeep(req.body);
    Cypress._.each(removedPositionworkflow.nodes, (node) => {
      if (node.uiProps && node.uiProps.position) {
        delete node.uiProps.position;
      }
    });

    expect(removedPositionworkflow).to.deep.equal({
      graph: {
        id,
      },
      nodes: [
        {
          id: 'taskSkeleton0',
          label: 'taskSkeleton',
          task_type: 'ppfmethod',
          task_identifier: 'taskSkeleton',
          uiProps: {},
        },
      ],
      links: [],
    });
  });

  cy.get('.react-flow__node').should('have.length', 0);

  cy.findByRole('button', { name: 'General category' }).click();
  cy.dragNodeInCanvas('taskSkeleton');

  cy.get('.react-flow__node').should('have.length', 1);

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Saves correctly a skeleton node after populating it', () => {
  // TODO: Also check the structure after opening
  cy.loadGraph(id);
  cy.intercept('PUT', `/workflow/${id}`, (req) => {
    const removedPositionworkflow = Cypress._.cloneDeep(req.body);
    Cypress._.each(removedPositionworkflow.nodes, (node) => {
      if (node.uiProps && node.uiProps.position) {
        delete node.uiProps.position;
      }
    });

    expect(removedPositionworkflow).to.deep.equal({
      graph: { id },
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
      links: [],
    });
  });
  cy.get('.react-flow__node').should('have.length', 1);
  cy.findAllByRole('button', { name: 'taskSkeleton' })
    .filter('.react-flow__node')
    .as('node', { type: 'static' })
    .click();

  cy.findByRole('textbox', { name: 'Edit label' }).clear().type('theNewLabel');
  cy.findByRole('textbox', { name: 'Edit comment' })
    .clear()
    .type('node comment');

  cy.findByRole('heading', { name: 'Default Inputs' })
    .parent()
    .as('defaultInputsSection');

  cy.get('@defaultInputsSection').within(() => {
    cy.findByRole('button', { name: 'Add entry' }).click();
  });
  cy.get('[data-cy="inputInEditableCell"]').first().type('default_input');
  cy.get('[data-cy="inputInEditableCell"]').last().type('isaString');
  cy.findByRole('checkbox', { name: 'More handles' }).check();
  cy.findByRole('checkbox', { name: 'With image' }).uncheck();
  // cy.findByRole('checkbox', { name: 'More handles' }).check();

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

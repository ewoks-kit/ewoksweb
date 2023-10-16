beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('displays the general category with the general tasks inside', () => {
  cy.findByRole('button', { name: 'General' }).should('be.visible');
  cy.findByRole('button', { name: 'General' }).click();

  cy.findByRole('button', { name: 'graphInput' }).should('be.visible');
  cy.findByRole('button', { name: 'graphOutput' }).should('be.visible');
  cy.findByRole('button', { name: 'taskSkeleton' }).should('be.visible');
  cy.findByRole('button', { name: 'note' }).should('be.visible');
  cy.findByRole('button', { name: 'subworkflow' }).should('be.visible');
});

it('does not allow to edit general tasks', () => {
  cy.findByRole('button', { name: 'General' }).click();

  cy.findByRole('button', { name: 'graphInput' }).click();
  cy.findByRole('button', { name: 'Edit task' }).should('not.exist');
  cy.findByRole('button', { name: 'Clone task' }).should('not.exist');
  cy.findByRole('button', { name: 'Delete task' }).should('not.exist');
});

it('drags general tasks in the canvas', () => {
  cy.get('.react-flow__node').should('have.length', 0);

  cy.findByRole('button', { name: 'General' }).click();
  cy.dragNodeInCanvas('graphInput');

  cy.get('.react-flow__node').should('have.length', 1);
});

it('does not allow to edit node inputs or task info for graph input, graph output and note tasks', () => {
  cy.findByRole('button', { name: 'General' }).click();

  ['graphInput', 'graphOutput', 'note'].forEach((task) => {
    cy.dragNodeInCanvas(task);
    cy.waitForStableDOM();

    cy.findAllByRole('button', { name: task })
      .filter('.react-flow__node')
      // Can be underneath another node
      .click({ force: true });

    cy.findByRole('heading', { name: 'Default Inputs' }).should('not.exist');
    cy.findByRole('heading', { name: 'Task Info' }).should('not.exist');
  });
});

it('adds a subworkflow node by dragging the subworkflow task', () => {
  cy.findByRole('button', { name: 'General' }).click();

  cy.dragNodeInCanvas('subworkflow');

  cy.findByRole('dialog')
    .should('be.visible')
    .should('contain.text', 'Add subworkflow');
  cy.findByRole('dialog').within(() => {
    cy.findByRole('combobox', {
      name: 'Quick open',
    }).type('Adding-Tasks');
  });
  cy.findByRole('option', { name: 'Adding-Tasks' }).click();
  cy.waitForStableDOM();

  cy.findAllByRole('button', { name: /Adding-Tasks/ })
    .filter('.react-flow__node')
    .should('contain.text', 'graphInputgraphOutput');
});

before(() => {
  cy.loadAppWithoutGraph();
});

it('should display the General category', () => {
  cy.findByRole('button', { name: 'General' }).should('be.visible');
});

it('General should contain the appropriete Nodes', () => {
  cy.findByRole('button', { name: 'General' }).click();

  cy.findByRole('button', { name: 'graphInput' }).should('be.visible');
  cy.findByRole('button', { name: 'graphOutput' }).should('be.visible');
  cy.findByRole('button', { name: 'taskSkeleton' }).should('be.visible');
  cy.findByRole('button', { name: 'note' }).should('be.visible');
  cy.findByRole('button', { name: 'subworkflow' }).should('be.visible');
});

it('General nodes should not be editable', () => {
  cy.findByRole('button', { name: 'graphInput' }).click();
  cy.findByRole('button', { name: 'Clone task' }).should('not.exist');
});

it('General nodes should not be draggable to the canvas', () => {
  cy.dragNodeInCanvas('graphInput');
  cy.get('.react-flow__node').should('be.visible');
  cy.get('[data-cy="task_props"]').should('not.exist');
});

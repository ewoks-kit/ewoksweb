beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('should create a task skeleton and update its info when changing the identifier', () => {
  cy.findByRole('button', { name: 'General' }).click();
  cy.dragNodeInCanvas('taskSkeleton');

  cy.get('.react-flow__node').click();
  cy.get('[data-cy="task_identifier"]').should(
    'contain.text',
    'Task Identifier: taskSkeleton',
  );

  cy.get('[data-cy="task_props"]')
    .should('contain.text', 'Category: General')
    .should('contain.text', 'Task Type: ppfmethod')
    .should('contain.text', 'Required Inputs: Unknown')
    .should('contain.text', 'Optional Inputs: Unknown')
    .should('contain.text', 'Outputs: Unknown');

  cy.findByRole('button', { name: 'Edit task identifier' }).click();
  cy.findByRole('combobox', { name: 'Change task identifier' }).select(
    'ewokscore.tests.examples.tasks.sumtask.SumTask',
  );
  cy.findByRole('button', { name: 'Save' }).click();
  cy.waitForStableDOM();

  cy.get('[data-cy="task_identifier"]').should(
    'contain.text',
    'Task Identifier: ewokscore.tests.examples.tasks.sumtask.SumTask',
  );
  cy.get('[data-cy="task_props"]')
    .should('contain.text', 'Category: ewokscore')
    .should('contain.text', 'Task Type: class')
    .should('contain.text', 'Required Inputs: a')
    .should('contain.text', 'Optional Inputs: b, delay')
    .should('contain.text', 'Outputs: result');
});

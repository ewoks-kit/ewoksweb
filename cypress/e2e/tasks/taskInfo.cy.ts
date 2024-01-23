beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('should display the info for a class task', () => {
  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.dragNodeInCanvas(
    'ewokscore.tests.examples.tasks.errorsumtask.ErrorSumTask',
  );

  cy.get('.react-flow__node').click();

  cy.get('[data-cy="task_identifier"]').should(
    'contain.text',
    'Task Identifier: ewokscore.tests.examples.tasks.errorsumtask.ErrorSumTask',
  );

  cy.get('[data-cy="task_props"]')
    .should('contain.text', 'Category: ewokscore')
    .should('contain.text', 'Task Type: class')
    .should('contain.text', 'Required Inputs: None')
    .should('contain.text', 'Optional Inputs: a, b, raise_error')
    .should('contain.text', 'Outputs: result');
});

it('should display the info for a method task', () => {
  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.dragNodeInCanvas('ewokscore.tests.examples.tasks.simplemethods.add');

  cy.get('.react-flow__node').click();

  cy.get('[data-cy="task_identifier"]').should(
    'contain.text',
    'Task Identifier: ewokscore.tests.examples.tasks.simplemethods.add',
  );

  cy.get('[data-cy="task_props"]')
    .should('contain.text', 'Category: ewokscore')
    .should('contain.text', 'Task Type: method')
    .should('contain.text', 'Required Inputs: Unknown')
    .should('contain.text', 'Optional Inputs: Unknown')
    .should('contain.text', 'Outputs: return_value');
});

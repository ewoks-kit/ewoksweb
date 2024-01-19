before(() => {
  cy.loadAppWithoutGraph();
});

it('should display correct task info', () => {
  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.dragNodeInCanvas('ewokscore.tests.examples.tasks.sumlist.SumList');

  cy.get('.react-flow__node').click();

  cy.get('[data-cy="task_identifier"]').should(
    'contain.text',
    'Task Identifier: ewokscore.tests.examples.tasks.sumlist.SumList',
  );

  cy.get('[data-cy="task_props"]')
    .should('contain.text', 'Category: ewokscore')
    .should('contain.text', 'Required Inputs: list')
    .should('contain.text', 'Optional Inputs: delay')
    .should('contain.text', 'Outputs: sum');
});

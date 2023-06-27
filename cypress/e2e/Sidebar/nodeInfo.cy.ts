before(() => {
  cy.loadAppWithoutGraph();
});

it('should display correct node info', () => {
  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.dragNodeInCanvas('ewokscore.tests.examples.tasks.sumlist.SumList');

  cy.get('.react-flow__node').click();

  cy.findByRole('button', { name: 'Node Info' }).click();

  cy.get('[data-cy="node_info"]')
    .should(
      'contain.text',
      'Task Identifier: ewokscore.tests.examples.tasks.sumlist.SumList'
    )
    .should('contain.text', 'Category: ewokscore')
    .should('contain.text', 'Inputs: list, delay')
    .should('contain.text', 'Outputs: sum');
});

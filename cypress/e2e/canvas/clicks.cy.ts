beforeEach(() => {
  cy.loadApp();
  cy.findByRole('button', { name: 'Close task drawer' }).click();
});

it('selects a node with click', () => {
  cy.get('.react-flow__node')
    .first()
    .click({ force: true })
    .should('include.class', 'selected');

  cy.waitForStableDOM();

  cy.contains('Label').should('be.visible');
  cy.contains('Comment').should('be.visible');
  cy.findByRole('heading', { name: 'Default Inputs' }).should('be.visible');
  cy.contains('Default Error Node').should('be.visible');
  cy.contains('Force start node').should('be.visible');
  cy.findByRole('heading', { name: 'Task Info' }).should('be.visible');
  cy.findByRole('heading', { name: 'Appearance' })
    .scrollIntoView()
    .should('be.visible');
});

it('selects a link with click', () => {
  cy.get('.react-flow__edge')
    .first()
    .click({ force: true })
    .should('include.class', 'selected');

  cy.contains('Map all Data').should('be.visible');
  cy.contains('On Error condition').should('be.visible');
  cy.contains('Conditions').should('be.visible');
  cy.contains('Required').should('be.visible');
  cy.contains('Comment').should('be.visible');
});

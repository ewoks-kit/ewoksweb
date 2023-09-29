before(() => {
  cy.loadApp();
  cy.findByRole('button', { name: 'Close task drawer' }).click();
});

it('selects a node with click', () => {
  cy.get('.react-flow__node')
    .first()
    .click({ force: true })
    .should('include.class', 'selected');

  cy.waitForStableDOM();

  cy.contains('Label').should('exist').should('be.visible');
  cy.contains('Comment').should('exist').should('be.visible');
  cy.findByRole('heading', { name: 'Default Inputs' }).should('be.visible');
  cy.contains('Default Error Node').should('exist').should('be.visible');
  cy.contains('Inputs Complete').should('exist').should('be.visible');
  cy.findByRole('heading', { name: 'Task Info' })
    .should('exist')
    .should('be.visible');
  cy.findByRole('heading', { name: 'Appearance' }).should('exist');
});

it('selects a link with click', () => {
  cy.contains('on_error').should('not.exist');
  cy.contains('Conditions').should('not.exist');
  cy.contains('Map all Data').should('not.exist');
  cy.contains('Required').should('not.exist');
  cy.contains('Source').should('not.exist');
  cy.contains('Target').should('not.exist');

  cy.get('.react-flow__edge')
    .first()
    .click({ force: true })
    .should('include.class', 'selected');

  cy.contains('Map all Data').should('exist').should('be.visible');
  cy.contains('On Error condition').should('exist').should('be.visible');
  cy.contains('Conditions').should('exist').should('be.visible');
  cy.contains('Required').should('exist').should('be.visible');
  cy.contains('Comment').should('exist').should('be.visible');
});

it('doubleclick on graph node', () => {
  cy.get('.react-flow__node-graph').should('have.length', 7).last().dblclick();

  cy.get('.react-flow__node').should('not.have.length', 17);

  cy.get('h1')
    .get('.MuiBreadcrumbs-li')
    .should('have.length', 2)
    .first()
    .contains('tutorial_Graph')
    .click();

  cy.get('.react-flow__node').should('have.length', 17);
});

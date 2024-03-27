beforeEach(() => {
  cy.loadApp();
  cy.findByRole('button', { name: 'Close task drawer' }).click();
  cy.waitForStableDOM();
  cy.findAllByRole('button', { name: 'ewoksweb' })
    .filter('.react-flow__node')
    .as('node', { type: 'static' })
    .click();
  cy.findByRole('button', {
    name: 'Save workflow to server: no changes',
  })
    .as('saveToServerButton', { type: 'static' })
    .should('exist');
});

it('depicts the save button with the correct label without the red dot', () => {
  cy.findByRole('button', {
    name: 'Save workflow to server: no changes',
  }).should('exist');
  cy.findByRole('button', {
    name: 'Save workflow to server: changes pending',
  }).should('not.exist');

  cy.get('[class*="saveRedDot"]').should('not.exist');
});

it('changes the label of a node and the red dot appears', () => {
  cy.get('@node').click();
  cy.findByRole('textbox', { name: 'Edit label' })
    .click()
    .type('Always and forever...');

  cy.get('@node').click();

  cy.findByRole('button', {
    name: 'Save workflow to server: no changes',
  }).should('not.exist');
  cy.findByRole('button', {
    name: 'Save workflow to server: changes pending',
  }).should('exist');

  cy.get('[class*="saveRedDot"]').should('exist');
});

it('when save to server is pressed the red dot disappears', () => {
  cy.get('@node').click();
  cy.findByRole('textbox', { name: 'Edit label' })
    .click()
    .type('Always and forever...');

  cy.get('@node').click();
  cy.get('[class*="saveRedDot"]').should('exist');
  cy.get('@saveToServerButton').click();
  cy.get('[class*="saveRedDot"]').should('not.exist');

  cy.get('@node').click();
  cy.findByRole('textbox', { name: 'Edit label' })
    .click()
    .clear()
    .type('ewoksweb');

  cy.get('@node').click();
  cy.get('[class*="saveRedDot"]').should('exist');
});

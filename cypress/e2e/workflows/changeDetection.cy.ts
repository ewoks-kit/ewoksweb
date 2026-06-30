beforeEach(() => {
  cy.loadApp();
  cy.findByRole('button', { name: 'Close task drawer' }).click();
  cy.waitForStableDOM();
  cy.findNode('ewoksweb').as('node', { type: 'static' });
});

it('does not show a red dot on the save button if there are no changes', () => {
  cy.findByRole('button', {
    name: 'Save workflow to server: no changes',
  }).should('exist');
  cy.findByRole('button', {
    name: 'Save workflow to server: changes pending',
  }).should('not.exist');

  cy.findByTestId('saveRedDot').should('not.exist');
});

it('detects a change and makes the red dot appear on the save button', () => {
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

  cy.findByTestId('saveRedDot').should('exist');
});

it('detects no changes when the workflow is saved', () => {
  cy.get('@node').click();
  cy.findByRole('textbox', { name: 'Edit label' }).type(
    'Always and forever...',
  );
  cy.wait(500);

  cy.findByTestId('saveRedDot').should('exist');
  cy.findByRole('button', {
    name: 'Save workflow to server: changes pending',
  }).click();
  // Wait until the save button returns to idle status
  cy.wait(1000);
  cy.findByTestId('saveRedDot').should('not.exist');

  cy.get('@node').click();
  cy.findByRole('textbox', { name: 'Edit label' }).clear().type('ewoksweb');
  cy.wait(500);

  cy.findByTestId('saveRedDot').should('exist');
  cy.findByRole('button', {
    name: 'Save workflow to server: changes pending',
  }).click();
  cy.findByTestId('saveRedDot').should('not.exist');
});

it('prompts a warning when leaving an unsaved workflow', () => {
  cy.get('@node').click();
  cy.findByRole('textbox', { name: 'Edit label' })
    .click()
    .type('Always and forever...');

  cy.get('@node').click();

  cy.findByRole('button', {
    name: 'Save workflow to server: changes pending',
  }).should('exist');

  cy.window().then((win) => cy.spy(win, 'confirm').as('confirm'));

  cy.findByRole('link', { name: 'Monitor' }).click();
  cy.get('@confirm').should('have.been.calledOnce');

  // We should be able to navigate back without a second warning prompt
  cy.findAllByRole('link', { name: 'Edit' }).first().click();
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/edit');
    expect(loc.search).to.eq('?workflow=tutorial_Graph');
  });
  cy.get('@confirm').should('have.been.calledOnce');
});

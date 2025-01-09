before(() => {
  cy.visit('http://localhost:3000/monitor');
});

it('should redirect to monitor page and display "Success" when successfully executing a workflow', () => {
  cy.visit('http://localhost:3000/edit');
  cy.loadGraph('demo');

  cy.findByRole('button', { name: 'Open menu with more actions' }).click();

  cy.findByRole('menuitem', { name: /^Execute workflow/ }).click();
  cy.findByRole('button', { name: 'Save & Execute' }).click();
  cy.waitForStableDOM();

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/monitor');
  });

  // Wait until socket messages are sent
  cy.wait(1000);

  cy.findAllByRole('listitem')
    .first()
    .within(() => {
      cy.findByText('demo').should('exist');
      cy.findByText('Success').should('exist');
    });
});

it('should be able to display the status of another workflow (even if it cannot be executed)', () => {
  cy.visit('http://localhost:3000/edit');
  cy.loadGraph('Ewoks-Tasks');

  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: /^Execute workflow/ }).click();
  cy.findByRole('button', { name: 'Save & Execute' }).click();
  cy.waitForStableDOM();

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/monitor');
  });

  // Wait until socket messages are sent
  cy.wait(1000);

  cy.findAllByRole('listitem')
    .first()
    .within(() => {
      cy.findByText('Ewoks-Tasks').should('exist');
      cy.findByText('Failed').should('exist');
    });
});

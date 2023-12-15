before(() => {
  cy.visit('http://localhost:3000/monitor');
});

it('should display no execution event in the history', () => {
  cy.findByText('No workflow was run!').should('exist');
  cy.findByRole('list').should('not.exist');
});

it('should redirect to monitor page and display "Success" when successfully executing a workflow', () => {
  cy.visit('http://localhost:3000/edit');
  cy.loadGraph('demo');

  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Execute workflow' }).click();
  cy.findByRole('button', { name: 'Save & Execute' }).click();
  cy.waitForStableDOM();

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/monitor');
  });

  // Wait until socket messages are sent
  cy.wait(1000);

  cy.findAllByRole('listitem').should('have.length', 1);

  // Comment since workflows keep crashing in the backend and no workflow_id is assigned
  cy.findByRole('listitem', { name: 'demo' }).within(() => {
    cy.findByText('Success').should('exist');
  });
});

it('should be able to display the status of another workflow (even if it cannot be executed)', () => {
  cy.visit('http://localhost:3000/edit');
  cy.loadGraph('Ewoks-Tasks');

  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Execute workflow' }).click();
  cy.waitForStableDOM();
  cy.findByRole('button', { name: 'Save & Execute' }).click();

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/monitor');
  });

  // Wait until socket messages are sent
  cy.wait(1000);

  cy.findAllByRole('listitem').should('have.length', 2);

  // Comment till backend is fixed
  cy.findByRole('listitem', { name: 'Ewoks-Tasks' }).within(() => {
    cy.findByText('Failed').should('exist');
  });
});

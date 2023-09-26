beforeEach(() => {
  cy.visit('http://localhost:3000/edit');
});

it('loads workflow from disk', () => {
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Open from disk' }).click();

  cy.findByLabelText('Load workflow from disk').selectFile(
    'cypress/fixtures/workflow2.json',
    {
      // needed since the input is hidden
      force: true,
    }
  );
  cy.waitForStableDOM();

  cy.findByRole('heading', { name: 'workflow2' }).should('be.visible');
  cy.get('.react-flow__node').should('have.length', 4);
  cy.get('.react-flow__edge').should('have.length', 3);
});

// Skipped until `label` of nodes and graph are no longer populated
it.skip('leaves the original JSON untouched when saving on the server', () => {
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Open from disk' }).click();

  cy.findByLabelText('Load workflow from disk').selectFile(
    'cypress/fixtures/workflow2.json',
    {
      // needed since the input is hidden
      force: true,
    }
  );
  cy.waitForStableDOM();

  cy.findByRole('heading', { name: 'workflow2' }).should('be.visible');
  cy.findByRole('button', { name: 'Save workflow to server' }).click();
  cy.findByRole('textbox', {
    name: 'Identifier',
  }).type('workflow2');
  cy.findByRole('button', { name: 'Save workflow' }).click();

  cy.readFile('cypress/fixtures/workflow2.json').then((originalJson) => {
    cy.readFile(
      'pysrc/ewoksweb/tests/resources/workflows/workflow2.json'
    ).should('deep.equal', originalJson);
  });
});

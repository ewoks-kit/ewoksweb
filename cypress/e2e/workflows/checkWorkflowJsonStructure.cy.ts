beforeEach(() => {
  cy.visit('http://localhost:3000/edit');
});

it('keywords, input_schema, ui_schema, execute_arguments, worker_optins remain when saving on the server', () => {
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Open from disk' }).click();

  cy.findByLabelText('Load workflow from disk').selectFile(
    'cypress/fixtures/workflowAllValues.json',
    {
      // needed since the input is hidden
      force: true,
    }
  );
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['workflowAllValues']);

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
  cy.findByRole('textbox', {
    name: 'Identifier',
  }).type('workflowAllValues');
  cy.findByRole('button', { name: 'Save workflow' }).click();

  cy.readFile('cypress/fixtures/workflowAllValues.json').then(
    (originalJson) => {
      cy.readFile(
        'pysrc/ewoksweb/tests/resources/workflows/workflowAllValues.json'
      ).should('deep.equal', originalJson);
    }
  );
});

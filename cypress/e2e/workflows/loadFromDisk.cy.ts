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
    },
  );
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['workflow2']);
  cy.get('.react-flow__node').should('have.length', 4);
  cy.get('.react-flow__edge').should('have.length', 3);
});

it('leaves the original JSON untouched when saving on the server', () => {
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Open from disk' }).click();

  cy.findByLabelText('Load workflow from disk').selectFile(
    'cypress/fixtures/workflow2.json',
    {
      // needed since the input is hidden
      force: true,
    },
  );
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['workflow2']);
  cy.findByRole('button', { name: 'Save workflow to server' }).click();
  cy.findByRole('textbox', {
    name: 'Identifier',
  }).type('workflow2');
  cy.findByRole('button', { name: 'Save workflow' }).click();

  cy.findByRole('alert', { hidden: true }).should(
    'contain.text',
    'Graph saved successfully',
  );

  cy.readFile('cypress/fixtures/workflow2.json').then((originalJson) => {
    cy.readFile(
      'pysrc/ewoksweb/tests/resources/workflows/workflow2.json',
    ).should('deep.equal', originalJson);
  });

  // Clean-up by deleting the saved workflow
  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Delete Workflow' }).click();
  cy.findByRole('button', { name: 'Yes' }).click();
});

it('saves optional fields of the workflow to the server', () => {
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Open from disk' }).click();

  cy.findByLabelText('Load workflow from disk').selectFile(
    'cypress/fixtures/workflowAllValues.json',
    {
      // needed since the input is hidden
      force: true,
    },
  );
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['workflowAllValues']);

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
  cy.findByRole('textbox', {
    name: 'Identifier',
  }).type('workflowAllValues');
  cy.findByRole('button', { name: 'Save workflow' }).click();

  cy.findByRole('alert', { hidden: true }).should(
    'contain.text',
    'Graph saved successfully',
  );

  cy.readFile('cypress/fixtures/workflowAllValues.json').then(
    (originalJson) => {
      cy.readFile(
        'pysrc/ewoksweb/tests/resources/workflows/workflowAllValues.json',
      ).should('deep.equal', originalJson);
    },
  );

  // Clean-up by deleting the saved workflow
  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Delete Workflow' }).click();
  cy.findByRole('button', { name: 'Yes' }).click();
});

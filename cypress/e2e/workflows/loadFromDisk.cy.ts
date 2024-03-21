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

  cy.hasNavBarLabel('workflow2');
  cy.hasVisibleNodes(4);
  cy.hasVisibleEdges(3);
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

  cy.hasNavBarLabel('workflow2');

  cy.saveNewWorkflow('workflow2');

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
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Delete workflow' }).click();
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

  cy.hasNavBarLabel('workflowAllValues');

  cy.saveNewWorkflow('workflowAllValues');

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
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Delete workflow' }).click();
  cy.findByRole('button', { name: 'Yes' }).click();
});

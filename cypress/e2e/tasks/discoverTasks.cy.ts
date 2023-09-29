beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('discovers tasks from an existing module', () => {
  cy.findByRole('button', { name: 'Discover tasks' }).click();

  cy.findByRole('textbox', { name: 'Module name' }).type('ewokscore');
  cy.findByRole('button', { name: 'Discover' }).click();

  cy.findByRole('button', { name: 'Cancel' }).click();

  cy.findByRole('button', { name: 'ewokscore' }).click();

  const discoveredTasksIds = [
    'ewokscore.methodtask.MethodExecutorTask',
    'ewokscore.notebooktask.NotebookExecutorTask',
    'ewokscore.ppftasks.PpfMethodExecutorTask',
    'ewokscore.ppftasks.PpfPortTask',
    'ewokscore.scripttask.ScriptExecutorTask',
  ];

  discoveredTasksIds.forEach((identifier) => {
    cy.findByRole('button', {
      name: identifier,
    }).should('be.visible');
  });
});

it('shows a warning when discovering tasks from an non-existing module', () => {
  cy.findByRole('button', { name: 'Discover tasks' }).click();

  cy.findByRole('textbox', { name: 'Module name' }).type('not_a_module');
  cy.findByRole('button', { name: 'Discover' }).click();

  // Need "hidden: true" because MUI puts Snackbars into a hidden div
  cy.findByRole('alert', { hidden: true }).should(
    'contain.text',
    "No module named 'not_a_module'"
  );
});

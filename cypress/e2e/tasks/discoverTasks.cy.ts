beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('discovers tasks from an existing module', () => {
  cy.findByRole('button', { name: 'Discover tasks' }).click();

  cy.findByRole('textbox', { name: 'Module name' }).type('ewokscore');
  cy.findByRole('checkbox', { name: /^Discover from all modules/ }).should(
    'not.be.checked',
  );
  cy.findByRole('button', { name: 'Discover' }).click();
  cy.findByRole('button', { name: 'Cancel' }).click();

  // Close discover pop-up
  cy.findByRole('button', { name: 'Close' }).click();

  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.waitForStableDOM();

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
    })
      .scrollIntoView()
      .should('be.visible');
  });
});

it('shows a warning when discovering tasks from an non-existing module', () => {
  cy.findByRole('button', { name: 'Discover tasks' }).click();

  cy.findByRole('textbox', { name: 'Module name' }).type('not_a_module');
  cy.findByRole('checkbox', { name: /^Discover from all modules/ }).should(
    'not.be.checked',
  );
  cy.findByRole('button', { name: 'Discover' }).click();

  // Need "hidden: true" because MUI puts Snackbars into a hidden div
  cy.findByRole('alert', { hidden: true }).should(
    'contain.text',
    "No module named 'not_a_module'",
  );
});

it('discovers tasks from the current Python env', () => {
  cy.findByRole('button', { name: 'Discover tasks' }).click();
  cy.findByRole('checkbox', { name: /^Discover from all modules/ }).check();
  cy.findByRole('button', { name: 'Discover' }).click();

  cy.findByRole('alert', { hidden: true }).should(($elem) => {
    expect($elem.text()).to.match(/\d+ tasks imported/);
  });
});

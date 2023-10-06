beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('makes icons appear on tasks correctly', () => {
  cy.findByRole('button', { name: 'ewokscore' }).click();

  cy.readFile(
    'pysrc/ewoksweb/tests/resources/icons/default.png',
    'base64'
  ).then((imgData) => {
    cy.findByRole('button', {
      name: 'ewokscore.tests.examples.tasks.sumlist.SumList',
    }).within(() => {
      cy.findByRole('img')
        .should('have.attr', 'src')
        .should('eq', `data:image/png;base64,${imgData}`);
    });
  });
});

it('should upload and delete icons', () => {
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();

  cy.findByRole('menuitem', { name: 'Manage icons' }).click();
  cy.findByRole('button', { name: 'down.svg' }).should('not.exist');

  // Upload non-existing
  cy.findByLabelText('Select an Icon to Upload').selectFile(
    'cypress/fixtures/down.svg'
  );
  cy.contains('File ready to be uploaded as an icon');
  cy.findByRole('button', { name: 'Upload' }).click();

  cy.findByRole('button', { name: 'down.svg' }).should('be.visible');

  // Upload existing
  cy.findByLabelText('Select an Icon to Upload').selectFile(
    'cypress/fixtures/down.svg'
  );
  cy.findByRole('button', { name: 'Upload' }).click();
  cy.contains("Icon 'down.svg' already exists");

  // Delete
  cy.findByRole('button', { name: 'down.svg' }).click();
  cy.findByRole('button', { name: 'Delete icon' }).click();
  cy.contains('Delete "down.svg" icon?').should('be.visible');

  cy.findByRole('button', { name: 'No' }).click();
  cy.findByRole('button', { name: 'down.svg' }).should('be.visible');

  cy.findByRole('button', { name: 'Delete icon' }).click();
  cy.contains('Delete "down.svg" icon?').should('be.visible');

  cy.findByRole('button', { name: 'Yes' }).click();
  cy.findByRole('button', { name: 'down.svg' }).should('not.exist');
});

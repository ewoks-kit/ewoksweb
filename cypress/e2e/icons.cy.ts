describe('Icons:', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('icons appear on tasks correctly', () => {
    cy.findByRole('button', { name: 'ewokscore' }).click();

    cy.findByRole('img', {
      name: 'ewokscore.tests.examples.tasks.sumtask.SumTask',
    })
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAA7D'
      );
  });

  // Assumes down.svg is on the server
  it('should upload-fail-delete-upload down.svg and appear-disappear on the icon list', () => {
    cy.findByRole('button', { name: 'Open menu with more actions' }).click();

    cy.findByRole('menuitem', { name: 'Manage icons' }).click();

    cy.findByLabelText('Select an Icon to Upload').selectFile(
      'cypress/fixtures/down.svg'
    );
    cy.contains('File ready to be uploaded as an icon');

    cy.findByRole('button', { name: 'Upload' }).click();
    cy.contains("Icon 'down.svg' already exists");

    cy.findByRole('button', { name: 'down.svg' }).click();
    cy.findByRole('button', { name: 'Delete icon' }).click();
    cy.contains('Delete "down.svg" icon?').should('be.visible');

    cy.findByRole('button', { name: 'No' }).click();
    cy.findByRole('button', { name: 'down.svg' }).should('be.visible');

    cy.findByRole('button', { name: 'Delete icon' }).click();
    cy.contains('Delete "down.svg" icon?').should('be.visible');

    cy.findByRole('button', { name: 'Yes' }).click();
    cy.findByRole('button', { name: 'down.svg' }).should('not.exist');

    cy.findByLabelText('Select an Icon to Upload').selectFile(
      'cypress/fixtures/down.svg'
    );
    cy.contains('File ready to be uploaded as an icon');

    cy.findByRole('button', { name: 'Upload' }).click();
    cy.findByRole('button', { name: 'down.svg' }).should('be.visible');
  });
});

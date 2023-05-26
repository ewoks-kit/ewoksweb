describe('Icons:', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('icons appear on tasks correctly', () => {
    cy.findByRole('button', { name: 'ewokscore' }).click();

    cy.findByTitle('ewokscore.tests.examples.tasks.sumtask.SumTask').within(
      () => {
        cy.findByRole('img', { hidden: true })
          .should('have.attr', 'src')
          .should(
            'include',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAA7D'
          );
      }
    );
  });

  // Assumes down.svg is on the server
  it('should upload-fail-delete-upload down.svg and appear-disappear on the icon list', () => {
    cy.get('[aria-controls="navbar-dropdown-menu"]').click();

    cy.findByRole('menuitem', { name: 'Settings' }).click();

    cy.contains('Categories');

    cy.get('[data-cy="iconsTab"]').click();
    cy.findByLabelText('Select an Icon to Upload').selectFile(
      'cypress/fixtures/down.svg'
    );
    cy.contains('File ready to be uploaded as an icon');

    cy.findByRole('button', { name: 'Upload' }).click();
    cy.contains("Icon 'down.svg' already exists");

    cy.get('[alt="down.svg"]').click();
    cy.findByRole('button', { name: 'Delete' }).click();
    cy.contains('Delete "down.svg" icon?').should('be.visible');
    cy.contains('Icon can be deleted since it is not used in any Task!').should(
      'be.visible'
    );

    cy.findByRole('button', { name: 'No' }).click();
    cy.get('[alt="down.svg"]').should('be.visible');

    cy.findByRole('button', { name: 'Delete' }).click();
    cy.contains('Delete "down.svg" icon?').should('be.visible');
    cy.contains('Icon can be deleted since it is not used in any Task!').should(
      'be.visible'
    );
    cy.findByRole('button', { name: 'Yes' }).click();
    cy.get('[alt="down.svg"]').should('not.be.visible');

    cy.get('[data-cy="iconsTab"]').click();
    cy.findByLabelText('Select an Icon to Upload').selectFile(
      'cypress/fixtures/down.svg'
    );
    cy.contains('File ready to be uploaded as an icon');

    cy.findByRole('button', { name: 'Upload' }).click();
    cy.get('[alt="down.svg"]').should('be.visible');
  });
});

describe('Icons:', () => {
  before(() => {
    cy.loadApp();
  });

  it('icons appear on tasks correctly', () => {
    cy.contains('General').click();

    cy.get('[data-cy="add-nodes-category-General"]')
      .find('.dndnode')
      .first()
      .children('span')
      .children('span')
      .should('have.text', 'graphOutput')
      .siblings('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAGaUlEQVR4nO2aX0xT'
      );
  });

  // Assumes down.svg is on the server
  it('should upload-fail-delete-upload down.svg and appear-disappear on the icon list', () => {
    cy.get('[data-cy="openTopDrawerButton"]').click();
    cy.contains('Categories');

    cy.get('[data-cy="iconsTab"]').click();
    cy.get('[data-cy="browseInput"]').selectFile('cypress/fixtures/down.svg');
    cy.contains('File ready to be uploaded as an icon');

    cy.get('[data-cy="iconUploadButton"]').click();
    cy.contains("Icon 'down.svg' already exists");

    cy.get('[alt="down.svg"]').click();
    cy.get('[data-cy="iconDeleteButton"]').click();
    cy.contains('Delete "down.svg" icon?').should('be.visible');
    cy.contains('Icon can be deleted since it is not used in any Task!').should(
      'be.visible'
    );

    cy.get('[data-cy="noButtonConfirmDialod"]').click();
    cy.get('[alt="down.svg"]').should('be.visible');

    cy.get('[data-cy="iconDeleteButton"]').click();
    cy.contains('Delete "down.svg" icon?').should('be.visible');
    cy.contains('Icon can be deleted since it is not used in any Task!').should(
      'be.visible'
    );
    cy.get('[data-cy="yesButtonConfirmDialog"]').click();
    cy.get('[alt="down.svg"]').should('not.be.visible');

    cy.get('[data-cy="iconsTab"]').click();
    cy.get('[data-cy="browseInput"]').selectFile('cypress/fixtures/down.svg');
    cy.contains('File ready to be uploaded as an icon');

    cy.get('[data-cy="iconUploadButton"]').click();
    cy.get('[alt="down.svg"]').should('be.visible');
  });
});

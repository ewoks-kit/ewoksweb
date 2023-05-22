describe('new Task form', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('creates new task', () => {
    cy.get('[aria-controls="navbar-dropdown-menu"]').click();

    cy.get('#navbar-dropdown-menu').within(() => {
      cy.contains('[role="menuitem"]', 'Settings').click();
    });

    cy.contains('Categories');

    cy.get('[data-cy="tasksTab"]').click();

    cy.contains('button', 'Create a new task').should('be.visible').click();

    cy.contains('Give the new Task details')
      .parent()
      .should('have.class', 'MuiDialogTitle-root')
      .siblings()
      .first()
      .as('dialogContent')
      .should('have.class', 'MuiDialogContent-root');

    cy.get('@dialogContent')
      .contains('New Name - Identifier')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .type('Always-and-forever');

    // TODO for some reason this is covered by another element and force is not working??
    // cy.get('@dialogContent')
    //   .contains('Task Type')
    //   .should('exist')
    //   .parent()
    //   .click({ force: true });

    // cy.contains('ppfmethod').click();

    cy.get('@dialogContent')
      .contains('Category')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Optional Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Required Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Outputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Icon')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    // Test if the choice in Task Type is class
    cy.get('@dialogContent')
      .contains('Task Type')
      .should('exist')
      .parent()
      .click();

    cy.contains('class').click();

    cy.get('@dialogContent')
      .contains('Category')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Optional Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Required Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Outputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Icon')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    // Test if the choice in Task Type is method
    cy.get('@dialogContent')
      .contains('Task Type')
      .should('exist')
      .parent()
      .click();

    cy.contains('method').click();

    cy.get('@dialogContent')
      .contains('Category')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Optional Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Required Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Outputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .should('have.value', 'return_value')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Icon')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    // Test if the choice in Task Type is script
    cy.get('@dialogContent')
      .contains('Task Type')
      .should('exist')
      .parent()
      .click();

    cy.contains('script').click();

    cy.get('@dialogContent')
      .contains('Category')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Optional Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Required Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Outputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .should('have.value', 'return_value')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Icon')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('not.has.attr', 'disabled');

    // Test if the choice in Task Type is ppfport
    cy.get('@dialogContent')
      .contains('Task Type')
      .should('exist')
      .parent()
      .click();

    cy.contains('ppfport').click();

    cy.get('@dialogContent')
      .contains('Category')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .as('categoryInput')
      .first()
      .and('not.has.attr', 'disabled');

    cy.get('@categoryInput').type('till-forever-ends');

    cy.get('@dialogContent')
      .contains('Optional Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Required Inputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Outputs')
      .should('exist')
      .siblings('div')
      .first()
      .children('input')
      .and('has.attr', 'disabled');

    cy.get('@dialogContent')
      .contains('Icon')
      .should('exist')
      .siblings('div')
      .first()
      .as('iconInput')
      .children('input')

      .and('not.has.attr', 'disabled');

    cy.get('@iconInput').click();

    cy.contains('default.png').click();
  });
});

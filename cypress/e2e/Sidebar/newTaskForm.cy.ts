describe('new Task form', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('creates new task', () => {
    cy.findByRole('button', { name: 'New task' }).click();
    cy.waitForStableDOM();

    cy.findByRole('textbox', { name: 'New Name - Identifier' }).type(
      'Always-and-forever'
    );

    cy.findByRole('textbox', { name: 'Category' }).should('be.enabled');

    cy.findByRole('textbox', { name: 'Optional inputs' }).as(
      'optionalInputsBox'
    );
    cy.findByRole('textbox', { name: 'Required inputs' }).as(
      'requiredInputsBox'
    );
    cy.findByRole('textbox', { name: 'Outputs' }).as('outputsBox');

    // Test `class` Task type
    cy.findByRole('button', { name: /^Task type/ }).click();
    cy.findByRole('option', { name: 'class' }).click();

    cy.get('@optionalInputsBox').should('be.enabled');
    cy.get('@requiredInputsBox').should('be.enabled');
    cy.get('@outputsBox').should('be.enabled');

    // Test `method` Task type
    cy.findByRole('button', { name: /^Task type/ }).click();
    cy.findByRole('option', { name: 'method' }).click();

    cy.get('@optionalInputsBox').should('be.disabled');
    cy.get('@requiredInputsBox').should('be.disabled');
    cy.get('@outputsBox').should('be.disabled');
    cy.get('@outputsBox').should('have.value', 'return_value');

    // Test `script` Task type
    cy.findByRole('button', { name: /^Task type/ }).click();
    cy.findByRole('option', { name: 'script' }).click();

    cy.get('@optionalInputsBox').should('be.disabled');
    cy.get('@requiredInputsBox').should('be.disabled');
    cy.get('@outputsBox').should('be.disabled');
    cy.get('@outputsBox').should('have.value', 'return_code');

    // Test `ppfmethod` Task type
    cy.findByRole('button', { name: /^Task type/ }).click();
    cy.findByRole('option', { name: 'ppfport' }).click();

    cy.get('@optionalInputsBox').should('be.disabled');
    cy.get('@requiredInputsBox').should('be.disabled');
    cy.get('@outputsBox').should('be.disabled');

    cy.findByRole('textbox', { name: 'Category' }).type('till-forever-ends');

    cy.findByRole('button', { name: /^Icon/ }).click();
    cy.findByRole('option', { name: 'default.png' }).click();
  });
});

beforeEach(() => {
  cy.loadApp();
  cy.get('.react-flow').contains('web app?').parent().click({ force: true });
});

it('click on a link and see its details in the sidebar ', () => {
  cy.findByRole('complementary').within(() => {
    cy.contains('On Error condition').should('be.visible');
    cy.contains('Conditions').should('be.visible');
    cy.contains('Data Mapping').should('be.visible');
    cy.contains('Required').should('be.visible');
    cy.contains('Source').should('be.visible');
    cy.contains('Target').should('be.visible');
    cy.contains('Output').scrollIntoView().should('be.visible');
    cy.contains('Type').scrollIntoView().should('be.visible');
    cy.contains('Value').scrollIntoView().should('be.visible');
    cy.contains('Advanced').scrollIntoView().should('be.visible');
    cy.contains('Appearance').scrollIntoView().should('be.visible');
    cy.contains('Link type').scrollIntoView().should('be.visible');
    cy.contains('Arrow Head').scrollIntoView().should('be.visible');
    cy.contains('Animated').scrollIntoView().should('be.visible');
    cy.contains('Color').scrollIntoView().should('be.visible');
  });
});

it('enables the data mapping when unchecking "Map all Data"', () => {
  cy.findByRole('complementary').within(() => {
    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('not.exist');
      });

    cy.findByLabelText('Map all Data').uncheck();

    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1);
      });
  });
});

it('disables the Conditions when checking "On Error condition"', () => {
  cy.findByRole('complementary').within(() => {
    cy.contains('Conditions')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1);
      });

    cy.findByLabelText('On Error condition').check();

    cy.contains('Conditions')
      .siblings()
      .within(() => {
        cy.contains('Add').should('not.exist');
      });
  });
});

it('inserts a new Data Mapping entry and disables it when "Map all data" is checked', () => {
  cy.findByLabelText('Map all Data').uncheck();

  cy.findByRole('complementary').within(() => {
    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1).click();
        cy.get('[data-cy="inputInEditableCell"]').first().type('Always');
        cy.get('[data-cy="inputInEditableCell"]').last().type('and forever');
      });

    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 2);
  });

  cy.findByLabelText('Map all Data').check();
  cy.findByRole('complementary').within(() => {
    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 0);
        cy.get('[data-cy="inputInEditableCell"]')
          .children()
          .each(($input) => {
            cy.wrap($input).should('be.disabled');
          });
      });
  });
});

it('inserts a new Condition, changes it and disables it when "On Error condition" is checked', () => {
  cy.findByRole('table', { name: 'editable table' }).within(() => {
    cy.contains('Add').should('have.length', 1).click();

    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 1);
    cy.get('[data-cy="inputInEditableCell"]').first().type('Always');

    cy.findByRole('combobox').should('have.text', 'bool');

    cy.findByRole('radio', { name: 'false' }).should('be.checked');

    cy.findByRole('radio', { name: 'true' }).click();
    cy.findByRole('radio', { name: 'true' }).should('be.checked');
  });

  cy.findByLabelText('On Error condition').click();

  cy.findByRole('table', { name: 'editable table' }).within(() => {
    cy.contains('Add').should('have.length', 0);
    cy.get('[data-cy="inputInEditableCell"]')
      .children()
      .each(($input) => {
        cy.wrap($input).should('be.disabled');
      });

    cy.waitForStableDOM();
    cy.findByRole('combobox').should('not.be.enabled');

    cy.findByRole('radio', { name: 'false' }).should('be.disabled');
    cy.findByRole('radio', { name: 'true' }).should('be.disabled');
  });
});

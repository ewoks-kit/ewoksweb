before(() => {
  cy.loadApp();
});

it('click on a link and see its details in the sidebar ', () => {
  cy.get('.react-flow').contains('web app?').parent().click({ force: true });

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

it('disables the data mapping when checking map all Data', () => {
  cy.findByRole('complementary').within(() => {
    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('not.exist');
      });

    cy.findByLabelText('Map all Data').click();

    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1);
      });
  });
});

it('disables the Conditions when checking On Error condition', () => {
  cy.findByRole('complementary').within(() => {
    cy.contains('Conditions')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1);
      });

    cy.findByLabelText('On Error condition').click();

    cy.contains('Conditions')
      .siblings()
      .within(() => {
        cy.contains('Add').should('not.exist');
      });
  });
});

it('insert a new Data Mapping entry', () => {
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
});

it('not able to edit the Data Mapping when Map all Data is checked', () => {
  cy.findByRole('complementary').within(() => {
    cy.findByLabelText('Map all Data').click();

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

it('insert a new Condition', () => {
  cy.findByRole('complementary').within(() => {
    cy.findByLabelText('On Error condition').click();

    cy.contains('Conditions')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1).click();
        cy.get('[data-cy="inputInEditableCell"]').first().type('Always');
      });
    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 3);
  });
});

it('not able to edit the Conditions when on Error condition is checked', () => {
  cy.findByRole('complementary').within(() => {
    cy.findByLabelText('On Error condition').click();

    cy.contains('Conditions')
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

describe('edit links conditions', () => {
  before(() => {
    cy.loadApp();
  });

  it('click on a link and see its details in the sidebar ', () => {
    cy.get('.react-flow').contains('web app?').parent().click({ force: true });

    cy.get('[data-cy="rightSidebar"]').within(() => {
      cy.contains('On Error condition').should('be.visible');
      cy.contains('Conditions').should('be.visible');
      cy.contains('Data Mapping').should('be.visible');
      cy.contains('Required').should('be.visible');
      cy.contains('Source').should('be.visible');
      cy.contains('Target').should('be.visible');
      cy.contains('Output').should('be.visible');
      cy.contains('Type').should('be.visible');
      cy.contains('Value').should('be.visible');
      cy.contains('Advanced').should('be.visible');
      cy.contains('Appearance').should('be.visible');
      cy.contains('Link type').scrollIntoView().should('be.visible');
      cy.contains('Arrow Head').scrollIntoView().should('be.visible');
      cy.contains('Animated').scrollIntoView().should('be.visible');
      cy.contains('Color').scrollIntoView().should('be.visible');
      cy.contains('Add').should('be.visible').should('have.length', 1);
    });
  });

  it('interacts with Map all Data and see results on Data Mapping', () => {
    cy.get('[data-cy="rightSidebar"]').within(() => {
      cy.contains('Data Mapping')
        .siblings()
        .within(() => {
          cy.contains('Add').should('not.exist');
        });

      cy.contains('Advanced')
        .siblings()
        .within(() => {
          cy.contains('Map all Data').siblings().click();
        });

      cy.contains('Data Mapping')
        .siblings()
        .within(() => {
          cy.contains('Add').should('have.length', 1);
        });
    });
  });

  it('interacts with On Error condition and see results on Conditions', () => {
    cy.get('[data-cy="rightSidebar"]').within(() => {
      cy.contains('Conditions')
        .siblings()
        .within(() => {
          cy.contains('Add').should('have.length', 1);
        });

      cy.contains('Advanced')
        .siblings()
        .within(() => {
          cy.contains('On Error condition').siblings().click();
        });

      cy.contains('Conditions')
        .siblings()
        .within(() => {
          cy.contains('Add').should('not.exist');
        });
    });
  });

  it('insert a new Data Mapping', () => {
    cy.get('[data-cy="rightSidebar"]').within(() => {
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

  it('insert a new Condition', () => {
    cy.get('[data-cy="rightSidebar"]').within(() => {
      cy.contains('Advanced')
        .siblings()
        .within(() => {
          cy.contains('On Error condition').siblings().click();
        });

      cy.contains('Conditions')
        .siblings()
        .within(() => {
          cy.contains('Add').should('have.length', 1).click();
          cy.get('[data-cy="inputInEditableCell"]').first().type('Always');
        });
      cy.get('[data-cy="inputInEditableCell"]').should('have.length', 3);
    });
  });
});

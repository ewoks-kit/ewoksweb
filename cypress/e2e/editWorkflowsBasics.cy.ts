describe('structure and basics for edit-workflows', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');
  });

  it('should be in the right page', () => {
    cy.location().should((loc) => {
      // expect(loc.hash).to.eq('#/edit-workflows');
      // expect(loc.hash).not.to.eq('#/monitor-workflows');
      expect(loc.host).to.eq('localhost:3000');
    });
  });

  // Comment until done refactoring the sidebar at the right
  // it('displays 18 buttons', () => {
  //   cy.get('button').should('have.length', 14);
  // });

  it('displays the canvas', () => {
    cy.get('.react-flow').should('be.visible');
    cy.get('.react-flow__controls').should('be.visible');
    cy.get('.react-flow__background').should('be.visible');
    cy.get('.react-flow__attribution').should('be.visible');
  });

  it('displays the autocomplete dropdown', () => {
    cy.get('[data-testid="async-autocomplete-drop"]').should('be.visible');
  });

  it('displays the Graph Details', () => {
    cy.get('span').should(
      'include.text',
      'Open a workflow from the top-right or drag-and-drop nodes from the left sidebar to create a new'
    );
  });
});

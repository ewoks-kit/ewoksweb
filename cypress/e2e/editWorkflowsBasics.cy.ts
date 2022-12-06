describe('structure and basics for edit-workflows', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');
  });

  it('should be in the right page', () => {
    cy.location().should((loc) => {
      expect(loc.hash).to.eq('#/edit-workflows');
      expect(loc.hash).not.to.eq('#/monitor-workflows');
      expect(loc.host).to.eq('localhost:3000');
    });
  });

  it('displays 18 buttons', () => {
    cy.get('button').should('have.length', 16);
  });

  it('displays the canvas', () => {
    cy.get('.react-flow').should('be.visible');
    cy.get('.react-flow__controls').should('be.visible');
    cy.get('.react-flow__minimap').should('be.visible');
    cy.get('.react-flow__background').should('be.visible');
    cy.get('.react-flow__attribution').should('be.visible');
  });

  it('displays the autocomplete dropdown', () => {
    cy.get('[data-testid="async-autocomplete-drop"]').should('be.visible');
  });

  it('displays the Add Nodes Accordion', () => {
    cy.get('p').should('include.text', 'Add Nodes');
  });

  it('displays the Edit Graph', () => {
    cy.get('p').should('include.text', 'Edit Graph');
  });

  it('should be able to open and close Add Nodes and see General category', () => {
    cy.contains('ewokscore').should('be.visible');
    cy.contains('Add Nodes').parents('.MuiButtonBase-root').click();
    cy.contains('ewokscore').should('not.be.visible');
  });

  it('should be able to open and close Edit Graph and see graph editing elements', () => {
    cy.contains('Label').should('not.be.visible');
    cy.contains('Comment').should('not.be.visible');
    cy.contains('Category').should('not.be.visible');
    cy.contains('Edit Graph').parents('.MuiButtonBase-root').click();
    cy.contains('Label').should('be.visible');
    cy.contains('Comment').should('be.visible');
    cy.contains('Category').should('be.visible');
  });
});

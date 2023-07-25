describe('structure and basics for edit workflows', () => {
  before(() => {
    cy.visit('http://localhost:3000/edit');
  });

  it('displays the canvas', () => {
    cy.get('.react-flow').should('be.visible');
    cy.get('.react-flow__controls').should('be.visible');
    cy.get('.react-flow__background').should('be.visible');
    cy.get('.react-flow__attribution').should('be.visible');
  });

  it('displays the autocomplete dropdown', () => {
    cy.findByRole('textbox', {
      name: 'Quick open',
    }).should('be.visible');
  });

  it('displays the Graph Details', () => {
    cy.get('p').should(
      'include.text',
      'Drag and drop tasks here to start building your workflow,or use Quick Open to open an existing workflow.'
    );
  });
});

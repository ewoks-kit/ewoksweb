describe('test newGraph scenarios', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('Initially it displays the empty canvas', () => {
    cy.get('.react-flow').should('be.visible');
    cy.get('.react-flow__controls').should('be.visible');
    cy.get('.react-flow__background').should('be.visible');
    cy.get('.react-flow__attribution').should('be.visible');
  });

  it('should drag and drop a new node from add nodes into canvas', () => {
    const dataTransfer = new DataTransfer();

    cy.waitForStableDOM();

    // Close and re-open the sidebar
    cy.get('button[aria-label="add"]').click();
    cy.get('button[aria-label="add"]').click();

    cy.contains('General').click();

    cy.get('.react-flow__node').should('have.length', 0);
    cy.get('p').should(
      'include.text',
      'Drag and drop tasks here to start building your workflow,or use Quick Open to open an existing workflow.'
    );

    cy.get('[data-cy="add-nodes-category-General"]')
      .find('.dndnode')
      .first()
      .trigger('dragstart', {
        dataTransfer,
      });

    cy.get('.react-flow').trigger('drop', {
      dataTransfer,
      force: true,
    });

    cy.get('.react-flow__node').should('have.length', 1);
    cy.get('h3').should('not.exist');
  });

  it('...then open a graph and show graph details', () => {
    cy.loadGraph('tutorial_Graph');
    cy.contains('tutorial_Graph');
    cy.get('h1').should('include.text', 'tutorial_Graph');
  });
});

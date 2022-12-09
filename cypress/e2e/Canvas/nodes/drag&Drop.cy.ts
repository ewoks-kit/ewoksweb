describe('drag and drop nodes', () => {
  before(() => {
    cy.loadApp();
  });

  it('should drag and drop 2 nodes from add nodes into canvas', () => {
    const dataTransfer = new DataTransfer();

    cy.waitForStableDOM();
    cy.contains('Add Nodes').click();

    cy.contains('General').click();

    cy.get('[data-cy="add-nodes-category-General"]')
      .find('.dndnode')
      .first()
      .trigger('dragstart', {
        dataTransfer,
      });

    cy.get('.react-flow').trigger('drop', {
      dataTransfer,
    });

    cy.get('.react-flow__node').should('have.length', 17);

    cy.get('[data-cy="add-nodes-category-General"]')
      .find('.dndnode')
      .first()
      .trigger('dragstart', {
        dataTransfer,
      });

    cy.get('.react-flow').trigger('drop', {
      dataTransfer,
    });

    cy.get('.react-flow__node').should('have.length', 18);
  });

  // TODO: move node - dragstart seems to grasp the inner and creates a ghost
  it('should move a node in the canvas', () => {
    const dataTransfer = new DataTransfer();

    cy.get('.react-flow__node-graph').last().find('img').trigger('dragstart', {
      dataTransfer,
    });

    cy.get('.react-flow').last().trigger('drop', {
      dataTransfer,
    });
    cy.get('.react-flow__node').should('have.length', 20);
  });
});

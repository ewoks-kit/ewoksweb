describe('drag and drop nodes', () => {
  before(() => {
    cy.loadApp();
  });

  it('should drag and drop 2 nodes from add nodes into canvas', () => {
    cy.get('button[aria-label="addNodes"]').click();
    cy.waitForStableDOM();

    const dataTransfer = new DataTransfer();

    cy.waitForStableDOM();
    cy.get('button[aria-label="addNodes"]').click();

    cy.contains('General').click();

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

    cy.get('[data-cy="add-nodes-category-General"]')
      .find('.dndnode')
      .first()
      .trigger('dragstart', {
        dataTransfer,
      });

    cy.get('.react-flow').trigger('drop', {
      dataTransfer,
    });

    cy.get('.react-flow__node').should('have.length', 19);
  });

  // TODO: move node - dragstart seems to grasp the inner and creates a ghost
  it.skip('should move a node in the canvas', () => {
    // const dataTransfer = new DataTransfer();

    // cy.get('.react-flow__node-graph').last().trigger('dragstart', {
    //   dataTransfer,
    // });

    // cy.get('.react-flow').last().trigger('drop', {
    //   dataTransfer,
    // });
    cy.get('.react-flow__node-graph')
      .last()
      .click()
      .trigger('mousedown', { button: 0 })
      .wait(100)
      .then(($node) => {
        const initialPosition = $node.position();
        const startX = initialPosition.left;
        const startY = initialPosition.top;

        cy.get('.react-flow__node-graph')
          .last()
          .trigger('mousemove', {
            clientX: startX - 100,
            clientY: startY - 100,
            force: true,
          })
          .wait(100)
          .trigger('mouseup', { force: true })
          .wait(100);

        cy.get('.react-flow__node-graph')
          .last()
          .then(($movedNode) => {
            const newPosition = $movedNode.position();
            const movedX = newPosition.left;
            const movedY = newPosition.top;

            expect(movedX).to.not.equal(startX);
            expect(movedY).to.not.equal(startY);
          });
        cy.get('.react-flow__node').should('have.length', 19);
      });
  });
});

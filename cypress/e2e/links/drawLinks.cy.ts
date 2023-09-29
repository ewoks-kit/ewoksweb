describe('draw links', () => {
  before(() => {
    cy.loadApp();
  });

  it('draws a link by clicking two handles in simple nodes', () => {
    cy.findByRole('button', { name: 'Close task drawer' }).click();
    cy.get('.react-flow__edge').should('have.length', 12);
    cy.waitForStableDOM();
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="sr"]')
      .click({ force: true });

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .last()
      .find('div[data-handleid="tl"]')
      .click({ force: true });

    cy.get('.react-flow__edge').should('have.length', 13);
  });

  it('wont draw a link between 2 outputs', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="sr"]')
      .click({ force: true });

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .last()
      .find('div[data-handleid="sr"]')
      .click({ force: true });

    cy.get('.react-flow__edge').should('have.length', 13);
  });

  it('wont draw a link between 2 inputs', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="tl"]')
      .click({ force: true });

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .last()
      .find('div[data-handleid="tl"]')
      .click({ force: true });

    cy.get('.react-flow__edge').should('have.length', 13);
  });

  it('draws a link between the input and the output of the same node', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="sr"]')
      .click({ force: true });

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="tl"]')
      .click({ force: true });

    cy.get('.react-flow__edge').should('have.length', 14);
  });

  it('wont draw a link between 2 already connected simple nodes', () => {
    cy.contains('a web application to EDIT ewoks graphs')
      .parent()
      .find('div[data-handleid="sr"]')
      .click({ force: true });

    cy.contains('has a web UI in React and a server side in Python-Flask')
      .parent()
      .find('div[data-handleid="tl"]')
      .click({ force: true });

    cy.get('.react-flow__edge').should('have.length', 14);
    cy.contains('Cannot re-connect two nodes');
  });

  it('deletes a link by button and keyboard', () => {
    cy.get('.react-flow__edge')
      .should('have.length', 14)
      .first()
      .children('g')
      .first()
      .click({ force: true })
      .type('{del}');

    cy.get('.react-flow__edge').should('have.length', 13);

    cy.get('.react-flow__edge')
      .first()
      .children('g')
      .first()
      .click({ force: true });

    cy.get('[aria-controls="editSidebar-dropdown-menu"]').click();

    cy.contains('Delete Link').click();

    cy.get('.react-flow__edge').should('have.length', 12);
  });
});

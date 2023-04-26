describe('draw links', () => {
  before(() => {
    cy.loadApp();
  });

  // draw link by clicking two handles in simple nodes
  it('draws a link by clicking two handles in simple nodes', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="sr"]')
      .click();

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .last()
      .find('div[data-handleid="tl"]')
      .click();

    cy.get('.react-flow__edge').should('have.length', 14);
  });

  it('wont draw a link between 2 outputs', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="sr"]')
      .click();

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .last()
      .find('div[data-handleid="sr"]')
      .click();

    cy.get('.react-flow__edge').should('have.length', 14);
  });

  it('wont draw a link between 2 inputs', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="tl"]')
      .click();

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .last()
      .find('div[data-handleid="tl"]')
      .click();

    cy.get('.react-flow__edge').should('have.length', 14);
  });

  it('draws a link between the input and the output of the same node', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="sr"]')
      .click();

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .find('div[data-handleid="tl"]')
      .click();

    cy.get('.react-flow__edge').should('have.length', 15);
  });

  it('wont draw a link between 2 already connected simple nodes', () => {
    cy.contains('a web application to EDIT ewoks graphs')
      .parent()
      .find('div[data-handleid="sr"]')
      .click();

    cy.contains('has a web UI in React and a server side in Python-Flask')
      .parent()
      .find('div[data-handleid="tl"]')
      .click();

    cy.get('.react-flow__edge').should('have.length', 15);
    cy.contains('Cannot re-connect two nodes');
  });

  it('deletes a link by button and keyboard', () => {
    cy.get('.react-flow__edge')
      .should('have.length', 15)
      .first()
      .children('g')
      .first()
      .click({ force: true })
      .type('{del}');

    cy.get('.react-flow__edge').should('have.length', 14);

    cy.get('.react-flow__edge')
      .first()
      .children('g')
      .first()
      .click({ force: true });

    cy.get('[data-cy="iconMenu"]').click();

    cy.contains('Delete Link').click();

    cy.get('.react-flow__edge').should('have.length', 13);
  });
});

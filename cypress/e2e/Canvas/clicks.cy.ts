describe('clicks on canvas and elements', () => {
  before(() => {
    cy.loadApp();
  });

  // TODO: rightClick? Must click on backround and not on a node
  // it('displays the rightClick message', () => {
  //   cy.get('.reactflow-wrapper').rightclick();
  //   cy.contains('Open a graph and click on nodes and links on this Canvas!');
  // });

  // select a node with click
  it('selects a node with click', () => {
    cy.get('.react-flow__node').first().click();
    // TODO: RF11 does not add a selected. Should find another way after moving canvas to RF11
    //   .should('include.class', 'selected');
    cy.contains('Default Inputs').should('exist').should('be.visible');

    cy.contains('Inputs-complete').should('not.exist');
  });

  it('selects a link with click', () => {
    cy.contains('on_error').should('not.exist');
    cy.contains('Conditions').should('not.exist');

    cy.get('.react-flow__edge').first().click({ force: true });

    cy.contains('Map all data').should('exist');
    cy.contains('Map all data').should('be.visible');
    cy.contains('on_error').should('exist');
    cy.contains('on_error').should('be.visible');
    cy.contains('Conditions').should('exist');
    cy.contains('Conditions').should('be.visible');
    cy.contains('Required').should('exist');
    cy.contains('Required').should('be.visible');
    cy.contains('Comment').should('exist');
    cy.contains('Comment').should('be.visible');
  });

  it('doubleclick on graph node', () => {
    cy.get('.react-flow__node-graph')
      .should('have.length', 7)
      .last()
      .dblclick();

    cy.get('.react-flow__node').should('not.have.length', 19);

    cy.get('h1')
      .get('.MuiBreadcrumbs-li')
      .should('have.length', 2)
      .first()
      .contains('tutorial_Graph')
      .click();

    cy.get('.react-flow__node').should('have.length', 17);
  });

  // TODO: test the deactivation by setting details to false if the feature is needed
  // it('doubleclick on note node', () => {
  //   cy.get('.react-flow__node-note')
  //     .last()
  //     .dblclick()
  //     .get('.icons')
  //     .children('button[type=button]')
  //     .should('have.length', 1);
  // });

  // TODO: click out and make these icons disappear
  // it('click outside of a doubleclicked note node', () => {
  //   cy.get('.react-flow__node').first().click();
  //   cy.get('.react-flow__node-note')
  //     .last()
  //     .get('.icons')
  //     .children('button[type=button]')
  //     .should('not.exist');
  // });
});

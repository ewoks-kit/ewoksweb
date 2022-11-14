/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('structure and basics for edit-workflows', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.get('label')
      .should('include.text', 'Open Workflow')
      .parents('.MuiAutocomplete-root')
      .click()
      .get('input[type=text]')
      .type('tutorial_Graph');

    cy.contains('tutorial_Graph').parent().click();
  });

  // it('displays the canvas', () => {
  //   cy.get('.react-flow').should('be.visible');
  //   cy.get('.react-flow__controls').should('be.visible');
  //   cy.get('.react-flow__minimap').should('be.visible');
  //   cy.get('.react-flow__background').should('be.visible');
  //   cy.get('.react-flow__attribution').should('be.visible');
  // });

  // it('opens the tutorial_Graph on the canvas', () => {
  //   cy.contains('tutorial_Graph');
  //   cy.get('h1').should('include.text', 'tutorial_Graph');
  // });

  // it('displays the number of nodes the tutorial_Graph has', () => {
  //   cy.get('.react-flow__node').should('have.length', 20);
  // });

  // it('displays the number of links the tutorial_Graph has', () => {
  //   cy.get('.react-flow__edge').should('have.length', 12);
  // });

  // rightClick?
  // it('displays the rightClick message', () => {
  //   cy.get('.reactflow-wrapper').rightclick();
  //   cy.contains('Open a graph and click on nodes and links on this Canvas!');
  // });

  // select a node with click
  // it('selects a node with click', () => {
  //   cy.contains('Advanced').should('not.exist');
  //   cy.contains('Default Inputs').should('not.exist');

  //   cy.get('.react-flow__node')
  //     .first()
  //     .click()
  //     .should('include.class', 'selected');

  //   cy.contains('Advanced').should('exist');
  //   cy.contains('Default Inputs').should('exist');
  //   cy.contains('Default Inputs').should('be.visible');
  //   cy.contains('Inputs-complete').should('exist');
  //   cy.contains('Inputs-complete').should('not.be.visible');
  // });

  // // select a link with click
  // it('selects a link with click', () => {
  //   cy.contains('Map all Data').should('not.exist');
  //   cy.contains('on_error').should('not.exist');
  //   cy.contains('Conditions').should('not.exist');

  //   cy.get('.react-flow__edge')
  //     .first()
  //     .click({ force: true })
  //     .should('include.class', 'selected');

  //   cy.contains('Advanced').should('exist');
  //   cy.contains('Map all Data').should('exist');
  //   cy.contains('Map all Data').should('be.visible');
  //   cy.contains('on_error').should('exist');
  //   cy.contains('on_error').should('be.visible');
  //   cy.contains('Conditions').should('exist');
  //   cy.contains('Conditions').should('be.visible');
  //   cy.contains('Required').should('exist');
  //   cy.contains('Required').should('not.be.visible');
  //   cy.contains('Comment').should('exist');
  //   cy.contains('Comment').should('not.be.visible');
  // });

  // doubleclick on default node
  it('doubleclick on default node', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .dblclick()
      .get('.icons')
      .children('button[type=button]')
      .should('have.length', 2);
  });

  // doubleclick on note node
  // it('doubleclick on note node', () => {
  //   cy.get('.react-flow__node-note')
  //     .last('include.class', 'node-note')
  //     .dblclick()
  //     .should('include.class', 'selected')
  //     .get('.icons')
  //     .children('button[type=button]')
  //     .should('have.length', 1);
  // });

  // doubleclick on graph-node
  // it('doubleclick on graph node', () => {
  //   cy.get('.react-flow__node-graph')
  //     .should('have.length', 3)
  //     .last()
  //     .dblclick();

  //   cy.get('.react-flow__node').should('not.have.length', 20);

  //   cy.get('h1')
  //     .get('.MuiBreadcrumbs-li')
  //     .should('have.length', 2)
  //     .first()
  //     .contains('tutorial_Graph')
  //     .click();

  //   cy.get('.react-flow__node').should('have.length', 20);
  // });

  // it('should drag and drop 2 nodes from add nodes into canvas', () => {
  //   const dataTransfer = new DataTransfer();
  //   cy.contains('Add Nodes').click();

  //   cy.contains('General').click();

  //   cy.get('.dndnode').last().trigger('dragstart', {
  //     dataTransfer,
  //   });

  //   cy.get('.react-flow').trigger('drop', {
  //     dataTransfer,
  //   });

  //   cy.get('.react-flow__node').should('have.length', 21);

  //   cy.contains('General')
  //     .parents('#add-nodes-accordion')
  //     .find('.dndnode')
  //     .first()
  //     .trigger('dragstart', {
  //       dataTransfer,
  //     });

  //   cy.get('.react-flow').trigger('drop', {
  //     dataTransfer,
  //   });

  //   cy.get('.react-flow__node').should('have.length', 22);
  // });

  // move node
  // it('should move a node in the canvas', () => {
  //   const dataTransfer = new DataTransfer();

  //   cy.get('.react-flow__node-graph').last().find('img').trigger('dragstart', {
  //     dataTransfer,
  //   });

  //   cy.get('.react-flow').last().trigger('drop', {
  //     dataTransfer,
  //   });
  //   cy.get('.react-flow__node').should('have.length', 22);
  // });

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

    cy.get('.react-flow__edge').should('have.length', 13);
  });

  // try to draw link between 2 inputs and 2 outputs
  it('not draws a link between 2 outputs', () => {
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

    cy.get('.react-flow__edge').should('have.length', 13);
  });

  it('not draws a link between 2 outputs', () => {
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

    cy.get('.react-flow__edge').should('have.length', 13);
  });

  // try to draw link between 2 already connected simple nodes, graph nodes, input-output nodes
  it('not draws a link between 2 already connected simple nodes', () => {
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

    cy.get('.react-flow__edge').should('have.length', 13);
  });

  // it('not draws a link between 2 already connected graph nodes', () => {
  //   cy.get('.react-flow__nodes')
  //     .children()
  //     .filter('.react-flow__node-graph')
  //     .first()
  //     .find('div[data-handleid="sr"]')
  //     .click();

  //   cy.get('.react-flow__nodes')
  //     .children()
  //     .filter('.react-flow__node-graph')
  //     .last()
  //     .find('div[data-handleid="tl"]')
  //     .click();

  //   cy.get('.react-flow__edge').should('have.length', 13);
  // });

  // delete a node by button and keyboard

  // delete a link by button and keyboard
});

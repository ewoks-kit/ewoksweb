/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('links in a graph', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.get('label')
      .should('include.text', 'Open Workflow')
      .parents('.MuiAutocomplete-root')
      .click()
      .get('input[type=text]')
      .type('tutorial_Graph');

    cy.contains('tutorial_Graph').parent().click();
    cy.window().should('have.property', '__state__');
    cy.get('.react-flow').contains('then...').parent().click();
  });

  it('changes links label and is reflected on the canvas', () => {
    cy.get('[data-cy="node-edge-label"]')
      .contains('then...')
      .should('have.value', 'then...')
      .click()
      .type('Always and forever...');

    cy.get('[data-cy="saveLabelComment"]').click();

    cy.get('.react-flow')
      .contains('then...Always and forever...')
      .should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) => store.getState().selectedElement.label)
      .as('label')
      .should('eq', 'then...Always and forever...');
  });

  it('changes links animated property to true and is shown on the canvas', () => {
    cy.contains('Styling Link').click();

    cy.contains('Animated').siblings().click();

    cy.get('.react-flow')
      .contains('then...')
      .parent()
      .parent()
      .should('include.class', 'animated');
  });

  it('changes links arrowHead property to arrowclosed and is shown on the canvas', () => {
    cy.get('.react-flow')
      .contains('then...Always and forever...')
      .parent()
      .siblings()
      .should('have.attr', 'marker-end', 'url(#type=arrow)');

    cy.contains('arrow').click({ force: true });
    cy.contains('arrowclosed').click({ force: true });

    // TODO: set text for a div element?
    // cy.contains('arrow')
    //   .click()
    //   .then((div) => (div.textContent = 'arrowclosed')); // .parent().click().select('arrowclosed');

    // TODO: setState?
    cy.window()
      .its('__state__')
      .then((store) =>
        store.setState({
          // ...store.getState(),
          // selectedElement: {
          //   ...store.getState().selectedElement,
          //   label: 'wdc',
          // },
        })
      );

    cy.get('.react-flow')
      .contains('then...Always and forever...')
      .parent()
      .siblings()
      .should('have.attr', 'marker-end', 'url(#type=arrowclosed)');
  });
});

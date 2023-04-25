before(() => {
  cy.loadApp();
});

it('selects a default node', () => {
  cy.get('.react-flow__nodes')
    .children()
    .filter('.react-flow__node-ppfmethod')
    .first()
    .click();
});

it('changes label of node', () => {
  cy.get('[data-cy="node-edge-label"]')
    .first()
    .should('be.visible')
    .click()
    .type('Always and forever...');

  cy.findByRole('button', { name: 'saveLabelComment' }).click();

  cy.get('.react-flow').contains('Always and forever...').should('be.visible');
});

it('changes comment of node', () => {
  cy.get('[data-cy="node-edge-label"]')
    .last()
    .should('be.visible')
    .click()
    .type('Always and forever comment...');

  cy.findByRole('button', { name: 'saveLabelComment' }).click();

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .click();

  cy.contains('Always and forever comment...');
});

it('changes withImage of node true->false->true', () => {
  cy.contains('Styling Node').click();

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 3);

  cy.get('input[name="withImage"]').click();

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 2);

  cy.get('input[name="withImage"]').click();

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 3);
});

it('changes withLabel of node true->false->true', () => {
  cy.get('.react-flow').contains('Always and forever...').parent().as('node');

  cy.get('input[name="withLabel"]').click();

  cy.get('@node').children().should('have.length', 3);

  cy.get('input[name="withLabel"]').click();

  cy.get('@node').children().should('have.length', 4);

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 3);
});

it('changes width of node', () => {
  cy.get('.react-flow').contains('Always and forever...').parent().as('node');

  cy.get('span[role="slider"]').as('sliderThumb');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuenow').and('eq', '100');

  cy.get('@sliderThumb').click().type('{end}');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuenow').and('eq', '300');
});

it('changes moreHandles of node true->false->true', () => {
  cy.get('.react-flow').contains('Always and forever...').parent().as('node');

  cy.get('@node').children('.react-flow__handle').should('have.length', 2);

  cy.contains('More handles').siblings('span').click();

  cy.get('@node').children('.react-flow__handle').should('have.length', 4);

  cy.get('@node')
    .children('#choice')
    .should('have.length', 1)
    .children('.react-flow__handle')
    .should('have.length', 2);

  cy.contains('More handles').siblings('span').click();

  cy.get('@node').children('.react-flow__handle').should('have.length', 2);
});

it('clones a node by button', () => {
  cy.get('.react-flow__node').should('have.length', 17);
  cy.get('[data-cy="iconMenu"]').click();
  cy.contains('Clone Node').click();

  cy.get('.react-flow__node').should('have.length', 18);
});

it('deletes a node by button and keyboard', () => {
  cy.get('.react-flow__node').should('have.length', 18);

  cy.contains('Delete Node').click();

  cy.get('.react-flow__node').should('have.length', 17);
  cy.get('.react-flow')
    .contains('Always and forever...')
    .parent()
    .should('have.length', 1);
});

// TODO: find a way to set a color from the firefox color picker
// TODO: changing the state with setState wont show on the canvas border attr???
// it('changes color of node', () => {
//   cy.get('.react-flow').contains('Always and forever...').parent().as('node');

//   cy.contains('Color').siblings().first().click();
//   cy.contains('custom').should('be.visible');
//   cy.get('input[type=color]').invoke('val', '#ff0000').trigger('change');

//   cy.get('@node')
//     .parent()
//     .should('have.attr', 'style')
//     .and('include', 'border: 2px solid rgb(233, 235, 247)');

//   cy.get('@node')
//     .parent()
//     .should('have.attr', 'style')
//     .and('include', 'border: 2px solid rgb(0, 0, 0)');

// });

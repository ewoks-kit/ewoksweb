// TODO: Skip for onlyEditRelease
describe.skip('structure and basics for edit workflows', () => {
  before(() => {
    cy.visit('http://localhost:3000/edit');
  });

  it('displays the Execution History', () => {
    cy.get('p').should('include.text', 'Execution History');
  });

  it('should be able to open and close Execution History and see the buttons', () => {
    cy.contains('Execution History').parents('.MuiButtonBase-root').click();

    cy.contains('Execution History')
      .parents('.MuiAccordion-root')
      .children()
      .find('button')
      .should('have.length', 2)
      .last()
      .should('have.text', 'Clean all');

    cy.get('.MuiSwitch-root').should('have.length', 0);

    cy.contains('Execution History')
      .parents('.MuiAccordion-root')
      .children()
      .find('button')
      .should('have.length', 2)
      .first()
      .should('have.text', 'All Executions')
      .click();

    cy.get('.MuiSwitch-root').should('have.length', 2);
  });
});

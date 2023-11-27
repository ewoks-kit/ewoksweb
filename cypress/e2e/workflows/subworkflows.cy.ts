it('should open the workflow given its id as query parameter', () => {
  cy.visit('http://localhost:3000/edit?workflow=tutorial_Graph');
  cy.hasNavBarLabel('tutorial_Graph');
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/edit');
  });
});

it('opens a new tab when doubleclick on a subworkflow', () => {
  cy.loadApp();
  cy.findByRole('button', { name: 'Close task drawer' }).click();
  cy.waitForStableDOM();

  cy.window().then((window) => {
    cy.stub(window, 'open').as('open');
  });

  cy.get('[data-id="Editing-Graph-Node-Link"]').dblclick();

  cy.get('@open').should(
    'have.been.calledOnceWithExactly',
    'http://localhost:3000/edit?workflow=Editing-Graph-Node-Link',
    '_blank',
  );
});

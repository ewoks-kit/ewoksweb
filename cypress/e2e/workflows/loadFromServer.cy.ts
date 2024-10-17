beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('opens the tutorial_Graph on the canvas', () => {
  cy.loadGraph('tutorial_Graph');

  cy.hasNavBarLabel('tutorial_Graph');
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);
});

it('opens an empty workflow when clicking on New Workflow after a workflow was loaded', () => {
  cy.loadGraph('tutorial_Graph');
  cy.hasNavBarLabel('tutorial_Graph');
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);

  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: /^New workflow/ }).click();

  cy.hasNavBarLabel('Untitled workflow (unsaved)');
  cy.get('.react-flow__edge').should('have.length', 0);
  cy.get('.react-flow__node').should('have.length', 0);
  cy.contains('tutorial_Graph').should('not.exist');
});

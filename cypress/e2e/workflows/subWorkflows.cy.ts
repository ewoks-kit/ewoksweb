beforeEach(() => {
  cy.loadApp();
});

it('navigates to a subgraph, a subsubgraph and back', () => {
  cy.hasBreadcrumbs(['tutorial_Graph']);
  cy.get('.react-flow__node').should('have.length', 16);
  cy.get('.react-flow__edge').should('have.length', 12);

  // Navigate to Editing-Graph-Node-Link subgraph
  cy.findByRole('button', {
    name: /^Double-click for editing Graph-Node-Link/,
  }).dblclick();
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['tutorial_Graph', 'Editing-Graph-Node-Link']);
  cy.get('.react-flow__node').should('have.length', 21);
  cy.get('.react-flow__edge').should('have.length', 17);

  // Navigate to Styling-Nodes-Links subgraph
  cy.findByRole('button', {
    name: /^Double-click for styling NODES and LINKS/,
  }).dblclick();
  cy.waitForStableDOM();

  cy.hasBreadcrumbs([
    'tutorial_Graph',
    'Editing-Graph-Node-Link',
    'Styling-Nodes-Links',
  ]);
  cy.get('.react-flow__node').should('have.length', 3);
  cy.get('.react-flow__edge').should('have.length', 2);

  // Go back to tutorial graph
  cy.findByRole('link', { name: 'tutorial_Graph' }).click();
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['tutorial_Graph']);
  cy.get('.react-flow__node').should('have.length', 16);
  cy.get('.react-flow__edge').should('have.length', 12);
});

it('loads a different workflow even if inside a subgraph', () => {
  cy.hasBreadcrumbs(['tutorial_Graph']);

  // Navigate to Editing-Graph-Node-Link subgraph
  cy.findByRole('button', {
    name: /^Double-click for editing Graph-Node-Link/,
  }).dblclick();
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['tutorial_Graph', 'Editing-Graph-Node-Link']);

  // Load an unrelated workflow
  cy.loadGraph('WhatIsEwoks');

  cy.hasBreadcrumbs(['WhatIsEwoks']);
  cy.findByRole('heading', { name: 'breadcrumb' }).within(() => {
    cy.contains('tutorial_Graph').should('not.exist');
  });
});

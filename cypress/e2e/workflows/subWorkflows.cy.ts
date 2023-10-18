beforeEach(() => {
  cy.loadApp();
});

it('navigates to a subgraph, a subsubgraph and back', () => {
  cy.hasBreadcrumbs(['tutorial_Graph']);
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);

  // Navigate to Editing-Graph-Node-Link subgraph
  cy.findByRole('button', {
    name: /^Double-click for editing Graph-Node-Link/,
  }).dblclick();
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['tutorial_Graph', 'Editing-Graph-Node-Link']);
  cy.hasVisibleNodes(21);
  cy.hasVisibleEdges(17);

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
  cy.hasVisibleNodes(3);
  cy.hasVisibleEdges(2);

  // Go back to tutorial graph
  cy.findByRole('link', { name: 'tutorial_Graph' }).click();
  cy.waitForStableDOM();

  cy.hasBreadcrumbs(['tutorial_Graph']);
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);
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

import { nanoid } from 'nanoid';

it('should open the workflow given its id as query parameter', () => {
  cy.visit('http://localhost:3000/edit?workflow=tutorial_Graph');
  cy.hasNavBarLabel('tutorial_Graph');
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);

  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/edit');
  });
});

it('saves two empty workflows and uses the one as a subworkflow to the other ', () => {
  cy.loadAppWithoutGraph();
  cy.window().then((window) => {
    cy.stub(window, 'open').as('open');
  });

  const subworkflow = nanoid();
  const rootWorkflow = nanoid();
  cy.saveNewWorkflow(subworkflow);
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: /^New workflow/ }).click();

  cy.findByRole('button', { name: 'General' }).should('be.visible');
  cy.findByRole('button', { name: 'General' }).click();
  cy.findByRole('button', { name: 'subworkflow' }).should('be.visible');
  cy.dragNodeInCanvas('subworkflow');

  cy.contains('h2.MuiDialogTitle-root', 'Add subworkflow').should('be.visible');
  cy.findByRole('combobox', {
    name: 'Select workflow',
  }).type(subworkflow);

  cy.findByRole('option', { name: subworkflow }).click();
  cy.waitForStableDOM();

  // Try to open the subworkflow
  cy.findByRole('button', { name: new RegExp(`^${subworkflow}`) }).dblclick();
  cy.get('@open').should(
    'have.been.calledOnceWithExactly',
    `http://localhost:3000/edit?workflow=${subworkflow}`,
    '_blank',
  );

  cy.get('.react-flow__node').should('have.length', 1);
  cy.get('.react-flow__node-graph').should('have.length', 1);

  cy.saveNewWorkflow(rootWorkflow);

  cy.deleteWorkflow(subworkflow);

  // Opens the workflow containing a non-existent subworkflow and sees the error message
  cy.loadGraph(rootWorkflow);

  cy.get('.react-flow__node').should('have.length', 1);
  cy.contains(
    `Workflow with id: ${subworkflow} is not available in the list of workflows.`,
  );

  cy.deleteWorkflow(rootWorkflow);
});

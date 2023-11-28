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

it('saves two empty workflows and uses the one as a subworkflow to the other ', () => {
  cy.loadAppWithoutGraph();
  const id1 = nanoid();
  const id2 = nanoid();
  cy.saveWorkflow(id1);
  cy.openNewWorkflow();
  cy.saveWorkflow(id2);

  cy.findByRole('button', { name: 'General' }).should('be.visible');
  cy.findByRole('button', { name: 'General' }).click();
  cy.findByRole('button', { name: 'subworkflow' }).should('be.visible');
  cy.dragNodeInCanvas('subworkflow');

  cy.contains('h2.MuiDialogTitle-root', 'Add subworkflow').should('be.visible');
  cy.findByRole('combobox', {
    name: 'Select workflow',
  }).type(id1);

  cy.findByRole('option', { name: id1 }).click();
  cy.waitForStableDOM();
  cy.findByRole('button', { name: 'Save workflow to server' }).click();

  // Deletes the workflow used as a subworkflow
  cy.deleteWorkflow(id1);

  // Opens the workflow containing a non-existent subworkflow and sees the error message
  cy.loadGraph(id2);

  cy.get('.react-flow__node').should('have.length', 1);
  cy.contains(
    `Workflow with id: ${id1} is not available in the list of workflows.`,
  );

  cy.deleteWorkflow(id2);
});

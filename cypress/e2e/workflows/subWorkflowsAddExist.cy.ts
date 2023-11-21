import { nanoid } from 'nanoid';

beforeEach(() => {
  cy.loadAppWithoutGraph();
});

const id1 = nanoid();
const id2 = nanoid();

it('saves two empty workflows and uses the one as a subworkflow to the other ', () => {
  cy.saveEmptyWorkflow(id1);
  cy.openNewWorkflow();
  cy.saveEmptyWorkflow(id2);

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

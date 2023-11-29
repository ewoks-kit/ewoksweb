import { nanoid } from 'nanoid';

beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('displays the canvas', () => {
  cy.get('.react-flow').should('be.visible');
  cy.get('.react-flow__controls').should('be.visible');
  cy.get('.react-flow__background').should('be.visible');
  cy.get('.react-flow__attribution').should('be.visible');

  cy.get('p').should(
    'include.text',
    'Drag and drop tasks here to start building your workflow,or use Quick Open to open an existing workflow.',
  );
});

it('opens the tutorial_Graph on the canvas', () => {
  cy.loadGraph('tutorial_Graph');

  cy.hasNavBarLabel('tutorial_Graph');
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);
});

// Skip this test until unsaved modifications can be properly tracked
it.skip('will not open the dialog for name after clicking new', () => {
  cy.findByRole('dialog').should('not.exist');

  cy.get('[aria-controls="navbar-dropdown-menu"]').click();

  cy.get('#navbar-dropdown-menu').within(() => {
    cy.contains('[role="menuitem"]', 'New workflow').click();
  });

  cy.findByRole('dialog').should('not.exist');
  cy.get('body').click();
  cy.waitForStableDOM();
});

it('saves an empty workflow on the server, reloads and deletes it', () => {
  cy.get('.react-flow__edge').should('have.length', 0);
  cy.get('.react-flow__node').should('have.length', 0);
  const id = nanoid();

  cy.saveNewWorkflow(id);

  cy.loadGraph(id);

  cy.hasNavBarLabel(id);
  cy.findByLabelText('Workflow title').within(() => {
    cy.contains('tutorial_Graph').should('not.exist');
  });

  cy.deleteWorkflow(id);

  cy.contains(id).should('not.exist');
  cy.get('p').should(
    'include.text',
    'Drag and drop tasks here to start building your workflow,or use Quick Open to open an existing workflow.',
  );
});

it('cannot delete or clone a workflow with an empty canvas', () => {
  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Clone Workflow' }).should(
    'not.be.enabled',
  );
  cy.findByRole('menuitem', { name: 'Delete Workflow' }).should(
    'not.be.enabled',
  );
});

it('opens a "New workflow" dialog when asking to clone the workflow', () => {
  cy.loadGraph('tutorial_Graph');

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Clone Workflow' }).click();
  cy.waitForStableDOM();

  cy.findByRole('dialog').within(() => {
    cy.findAllByRole('heading', {
      name: 'Give the new workflow identifier',
    }).should('be.visible');
  });
});

it('opens an empty workflow when clicking on New Workflow after a workflow was loaded', () => {
  cy.loadGraph('tutorial_Graph');
  cy.hasNavBarLabel('tutorial_Graph');
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);

  cy.openNewWorkflow();

  cy.hasNavBarLabel('Untitled workflow (unsaved)');
  cy.get('.react-flow__edge').should('have.length', 0);
  cy.get('.react-flow__node').should('have.length', 0);
  cy.contains('tutorial_Graph').should('not.exist');
});

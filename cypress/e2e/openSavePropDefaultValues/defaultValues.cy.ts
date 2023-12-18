import { nanoid } from 'nanoid';
import {
  addPUTInterceptor,
  emptyWorkflow,
  populatedLinkWorkflow,
  populatedNodeWorkflow,
  simpleLinkWorkflow,
  simpleNodeWorkflow,
  withCategoryCommentLabelWorkflow,
} from './utils';

beforeEach(() => {
  cy.loadAppWithoutGraph();
});

const id = nanoid();

it('Saves an empty workflow', () => {
  cy.intercept('POST', 'api/workflows', (req) => {
    expect(req.body).to.deep.equal(emptyWorkflow(id));
  });
  cy.saveNewWorkflow(id);
});

it('Saves an empty existing workflow', () => {
  cy.loadGraph(id);
  cy.intercept('PUT', `api/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal(emptyWorkflow(id));
  });

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Saves workflow comment, category and label', () => {
  cy.loadGraph(id);
  cy.intercept('PUT', `api/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal(withCategoryCommentLabelWorkflow(id));
  });
  cy.findByRole('textbox', { name: 'Edit label' }).click().type(id);
  cy.findByRole('textbox', { name: 'Edit comment' })
    .click()
    .type('graph comment');
  cy.findByRole('textbox', { name: 'Edit category' })
    .click()
    .type('graph category');

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Opens and saves workflow after deleting comment, category and label', () => {
  cy.intercept('GET', `api/workflow/${id}`).as('workflowRequest');

  cy.loadGraph(id);

  cy.wait('@workflowRequest').then((interception) => {
    cy.log('Request intercepted successfully');
    cy.wrap(interception.response?.body).should(
      'deep.equal',
      withCategoryCommentLabelWorkflow(id),
    );
  });

  cy.intercept('PUT', `api/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal({ graph: { id }, nodes: [], links: [] });
  });

  cy.findByRole('textbox', { name: 'Edit label' }).clear();
  cy.findByRole('textbox', { name: 'Edit comment' }).clear();
  cy.findByRole('textbox', { name: 'Edit category' }).clear();

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Opens and saves a skeleton node right after dropping it on canvas', () => {
  cy.intercept('GET', `api/workflow/${id}`).as('workflowRequest');

  cy.loadGraph(id);

  cy.wait('@workflowRequest').then((interception) => {
    const responseBody = interception.response?.body;
    cy.wrap(responseBody).should('deep.equal', emptyWorkflow(id));
  });

  addPUTInterceptor(id, simpleNodeWorkflow(id));

  cy.get('.react-flow__node').should('have.length', 0);

  cy.findByRole('button', { name: 'General' }).click();
  cy.dragNodeInCanvas('taskSkeleton');

  cy.get('.react-flow__node').should('have.length', 1);

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Opens and saves a skeleton node after populating it', () => {
  cy.intercept('GET', `api/workflow/${id}`).as('workflowRequest');

  cy.loadGraph(id);

  cy.wait('@workflowRequest').then((interception) => {
    const removedPositionworkflow = Cypress._.cloneDeep(
      interception.response?.body,
    );
    Cypress._.each(removedPositionworkflow.nodes, (node) => {
      if (node.uiProps && node.uiProps.position) {
        delete node.uiProps.position;
      }
    });

    cy.wrap(removedPositionworkflow).should(
      'deep.equal',
      simpleNodeWorkflow(id),
    );
  });

  addPUTInterceptor(id, populatedNodeWorkflow(id));

  cy.get('.react-flow__node').should('have.length', 1);
  cy.findAllByRole('button', { name: 'taskSkeleton' })
    .filter('.react-flow__node')
    .as('node', { type: 'static' })
    .click();

  cy.findByRole('textbox', { name: 'Edit label' }).clear().type('theNewLabel');
  cy.findByRole('textbox', { name: 'Edit comment' })
    .clear()
    .type('node comment');

  cy.findByRole('heading', { name: 'Default Inputs' })
    .parent()
    .as('defaultInputsSection');

  cy.get('@defaultInputsSection').within(() => {
    cy.findByRole('button', { name: 'Add entry' }).click();
  });
  cy.get('[data-cy="inputInEditableCell"]').first().type('default_input');
  cy.get('[data-cy="inputInEditableCell"]').last().type('isaString');
  cy.findByRole('checkbox', { name: 'More handles' }).check();
  cy.findByRole('checkbox', { name: 'With image' }).uncheck();

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Creates a link and saves it', () => {
  cy.intercept('GET', `api/workflow/${id}`).as('workflowRequest');

  cy.loadGraph(id);

  cy.wait('@workflowRequest').then((interception) => {
    const removedPositionworkflow = Cypress._.cloneDeep(
      interception.response?.body,
    );
    Cypress._.each(removedPositionworkflow.nodes, (node) => {
      if (node.uiProps && node.uiProps.position) {
        delete node.uiProps.position;
      }
    });

    cy.wrap(removedPositionworkflow).should(
      'deep.equal',
      populatedNodeWorkflow(id),
    );
  });

  cy.get('.react-flow__node').should('have.length', 1);

  cy.findByRole('button', { name: 'General' }).click();
  cy.dragNodeInCanvas('taskSkeleton');

  cy.get('.react-flow__node').should('have.length', 2);

  cy.waitForStableDOM();

  cy.get(`[data-handleid="sr"][data-nodeid="taskSkeleton0"]`).click({
    force: true,
  });

  cy.get(`[data-handleid="tl"][data-nodeid="taskSkeleton1"]`).click({
    force: true,
  });

  cy.get('.react-flow__edge').should('have.length', 1);

  addPUTInterceptor(id, simpleLinkWorkflow(id));

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

it('Saves a populated link', () => {
  cy.intercept('GET', `api/workflow/${id}`).as('workflowRequest');

  cy.loadGraph(id);

  cy.wait('@workflowRequest').then((interception) => {
    const removedPositionworkflow = Cypress._.cloneDeep(
      interception.response?.body,
    );
    Cypress._.each(removedPositionworkflow.nodes, (node) => {
      if (node.uiProps && node.uiProps.position) {
        delete node.uiProps.position;
      }
    });

    cy.wrap(removedPositionworkflow).should(
      'deep.equal',
      simpleLinkWorkflow(id),
    );
  });

  addPUTInterceptor(id, populatedLinkWorkflow(id));

  cy.get('.react-flow__edge').first().click({ force: true });
  cy.findByRole('combobox', { name: 'Label' }).click().type('linkLabel');

  cy.findByRole('textbox', { name: 'Edit comment' })
    .click()
    .type('linkComment');

  cy.findByLabelText('Map all Data').uncheck();
  cy.contains('Required').siblings().first().click();

  cy.findByRole('complementary').within(() => {
    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1).click();
        cy.get('[data-cy="inputInEditableCell"]')
          .first()
          .type('sourceDataMapping');
        cy.get('[data-cy="inputInEditableCell"]')
          .last()
          .type('targetDataMapping');
      });

    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 2);
  });

  cy.findByRole('table', { name: 'editable table' }).within(() => {
    cy.contains('Add').should('have.length', 1).click();

    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 1);
    cy.get('[data-cy="inputInEditableCell"]').first().type('outputConditions');

    cy.findByRole('combobox').should('have.text', 'bool');

    cy.findByRole('radio', { name: 'false' }).should('be.checked');

    cy.findByRole('radio', { name: 'true' }).click();
    cy.findByRole('radio', { name: 'true' }).should('be.checked');
  });

  cy.get('[aria-labelledby="linkTypeLabel"]').click();

  cy.contains('straight').click();

  cy.contains('arrowclosed').click({ force: true });
  cy.contains('none').click({ force: true });

  cy.contains('Animated').siblings().click();

  cy.findByRole('button', { name: 'Save workflow to server' }).click();
});

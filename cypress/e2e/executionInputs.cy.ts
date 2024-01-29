import type { RouteHandler } from 'cypress/types/net-stubbing';

beforeEach(() => {
  cy.loadAppWithoutGraph();
  cy.loadGraph('demo');

  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: /^Execute workflow/ }).click();
});

function expectRequestBodyToDeepEqual(expectation: unknown): RouteHandler {
  return (req) => {
    expect(req.body).to.deep.equal(expectation);

    // Prevent request from reaching the server since we don't want execution events to be created
    // https://docs.cypress.io/api/commands/intercept#Providing-a-stub-response-with-reqreply
    req.reply({});
  };
}

it('should not add inputs by default', () => {
  cy.intercept(
    `api/execute/demo`,
    expectRequestBodyToDeepEqual({
      execute_arguments: {},
    }),
  );

  cy.findByRole('button', { name: 'Save & Execute' }).click();
});

it('should change the engine', () => {
  cy.findByRole('combobox', { name: 'Change execution engine' }).click();
  cy.findByRole('option', { name: 'pypushflow' }).click();

  cy.intercept(
    `api/execute/demo`,
    expectRequestBodyToDeepEqual({
      execute_arguments: { engine: 'ppf' },
    }),
  );

  cy.findByRole('button', { name: 'Save & Execute' }).click();
});

it('should add inputs for all nodes', () => {
  cy.findByRole('button', { name: 'Add entry' }).click();

  cy.findByRole('combobox', { name: 'Change target nodes' }).select(
    'All nodes',
  );
  cy.findByRole('textbox', { name: 'Edit input name' }).type('filename');
  cy.findByRole('textbox', { name: 'Edit input value' }).type('/data/test.h5');

  cy.intercept(
    `api/execute/demo`,
    expectRequestBodyToDeepEqual({
      execute_arguments: {
        inputs: [{ name: 'filename', value: '/data/test.h5', all: true }],
      },
    }),
  );

  cy.findByRole('button', { name: 'Save & Execute' }).click();
});

it('should add inputs for all input nodes', () => {
  cy.findByRole('button', { name: 'Add entry' }).click();

  cy.findByRole('combobox', { name: 'Change target nodes' }).select(
    'All input nodes',
  );
  cy.findByRole('textbox', { name: 'Edit input name' }).type('filename');
  cy.findByRole('textbox', { name: 'Edit input value' }).type('/data/test.h5');

  cy.intercept(
    `api/execute/demo`,
    expectRequestBodyToDeepEqual({
      execute_arguments: {
        inputs: [{ name: 'filename', value: '/data/test.h5' }],
      },
    }),
  );

  cy.findByRole('button', { name: 'Save & Execute' }).click();
});

// TODO: VALUE SHOULD NOT BE SERIALIZED AS STRING
it.skip('should add inputs for a specific node', () => {
  cy.findByRole('button', { name: 'Add entry' }).click();

  cy.findByRole('combobox', { name: 'Change target nodes' }).select(
    'ewokscore.tests.examples.tasks.sumtask.SumTask (task1)',
  );

  cy.findByRole('combobox', { name: 'Change input type' }).click();
  cy.findByRole('option', { name: 'number' }).click();

  cy.findByRole('combobox', { name: 'Edit input name' }).type('delay');
  cy.findByRole('textbox', { name: 'Edit input value' }).type('6');

  cy.intercept(
    `api/execute/demo`,
    expectRequestBodyToDeepEqual({
      execute_arguments: {
        inputs: [{ name: 'delay', value: 6, id: 'task1' }],
      },
    }),
  );

  cy.findByRole('button', { name: 'Save & Execute' }).click();
});

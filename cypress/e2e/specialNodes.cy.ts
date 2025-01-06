import { isEqualWith } from 'lodash';
import { nanoid } from 'nanoid';

beforeEach(() => {
  cy.loadAppWithoutGraph();
});

const id = nanoid();

const expectedWorkflow = {
  graph: {
    id,
    uiProps: {
      notes: [
        {
          id: 'Note0',
          position: {
            x: 0,
            y: 0,
          },
        },
      ],
    },
    input_nodes: [
      {
        id: 'In0',
        node: 'Out0',
        uiProps: {
          position: {
            x: 0,
            y: 0,
          },
        },
      },
      {
        id: 'In1',
        node: null,
        uiProps: {
          position: {
            x: 0,
            y: 0,
          },
        },
      },
    ],
    output_nodes: [
      {
        id: 'Out0',
        node: 'In0',
        uiProps: {
          position: {
            x: 0,
            y: 0,
          },
        },
      },
      {
        id: 'Out1',
        node: null,
        uiProps: {
          position: {
            x: 0,
            y: 0,
          },
        },
      },
    ],
  },
  nodes: [],
  links: [],
};

it('Saves special nodes', () => {
  cy.findByRole('button', { name: 'General' }).click();

  cy.dragNodeInCanvas('note');
  cy.findByRole('button', { name: 'Note0' }).click({ force: true });

  cy.dragNodeInCanvas('graphInput');
  cy.dragNodeInCanvas('graphOutput');
  cy.waitForStableDOM();
  cy.findByRole('button', { name: 'In0' })
    .find('.react-flow__handle-right')
    .click({ force: true });
  cy.findByRole('button', { name: 'Out0' })
    .find('.react-flow__handle-left')
    .click({ force: true });

  cy.dragNodeInCanvas('graphInput');
  cy.dragNodeInCanvas('graphOutput');

  cy.intercept('POST', 'api/**/workflows', (req) => {
    // Skip check of the `position` field since it depends on viewport
    const bodyIsEqualToExpected = isEqualWith(
      req.body,
      expectedWorkflow,
      (_, __, key) => (key === 'position' ? true : undefined),
    );
    expect(bodyIsEqualToExpected).to.be.true;

    req.reply({});
  });

  cy.saveNewWorkflow(id);
});

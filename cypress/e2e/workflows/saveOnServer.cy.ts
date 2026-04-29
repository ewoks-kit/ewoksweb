import { nanoid } from 'nanoid';

beforeEach(() => {
  cy.loadAppWithoutGraph();
});

it('does not ask for a name when clicking on "New Workflow"', () => {
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

  cy.intercept('POST', 'api/**/workflows', (req) => {
    expect(req.body).to.deep.equal({ graph: { id }, nodes: [], links: [] });
  });
  cy.saveNewWorkflow(id);

  cy.loadGraph(id);

  cy.hasNavBarLabel(id);
  cy.findByRole('heading', { name: 'tutorial_Graph' }).should('not.exist');

  // It detects no changes when reloading
  cy.intercept('PUT', `api/**/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal({ graph: { id }, nodes: [], links: [] });
  });
  cy.findByRole('button', {
    name: 'Save workflow to server: no changes',
  }).click();

  cy.deleteWorkflow(id);

  cy.contains(id).should('not.exist');
  cy.get('p').should(
    'include.text',
    'Drag and drop tasks here to start building your workflow,or use Quick Open to open an existing workflow.',
  );
});

it('cannot delete or "Save as" a workflow if no workflow is loaded', () => {
  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Save as...' }).should('not.be.enabled');
  cy.findByRole('menuitem', { name: 'Delete workflow' }).should(
    'not.be.enabled',
  );
});

it('asks for a workflow name when clicking on "Save As"', () => {
  cy.loadGraph('tutorial_Graph');

  cy.findByRole('button', { name: 'Open menu with more actions' }).click();
  cy.findByRole('menuitem', { name: 'Save as...' }).click();
  cy.waitForStableDOM();

  cy.findByRole('dialog').within(() => {
    cy.findByRole('heading', {
      name: 'Give the new workflow name',
    }).should('be.visible');
  });
});

it('saves a workflow with comment, category and label and saves a clean workflow after deleting them', () => {
  const id = nanoid();

  cy.findByRole('textbox', { name: 'Edit label' }).type('graph label');
  cy.findByRole('textbox', { name: 'Edit comment' }).type('graph comment');
  cy.findByRole('textbox', { name: 'Edit category' }).type('graph category');

  cy.intercept('POST', `api/**/workflows`, (req) => {
    expect(req.body).to.deep.equal({
      graph: {
        id,
        label: 'graph label',
        category: 'graph category',
        uiProps: { comment: 'graph comment' },
      },
      nodes: [],
      links: [],
    });
  });
  cy.saveNewWorkflow(id);

  cy.intercept('PUT', `api/**/workflow/${id}`, (req) => {
    expect(req.body).to.deep.equal({ graph: { id }, nodes: [], links: [] });
  });

  cy.findByRole('textbox', { name: 'Edit label' }).clear();
  cy.findByRole('textbox', { name: 'Edit comment' }).clear();
  cy.findByRole('textbox', { name: 'Edit category' }).clear();
  cy.waitForStableDOM();

  cy.findByRole('button', {
    name: /Save workflow to server/,
  }).click();

  cy.deleteWorkflow(id);
});

it('saves a workflow with an empty skeleton node, and saves the workflow after populating the node', () => {
  const id = nanoid();

  cy.findByRole('button', { name: 'General' }).click();
  cy.dragNodeInCanvas('taskSkeleton');
  cy.get('.react-flow__node').should('have.length', 1);

  cy.intercept('POST', `api/**/workflows`, (req) => {
    // Delete unreliable position property
    delete req.body.nodes[0].uiProps.position;

    expect(req.body).to.deep.equal({
      graph: {
        id,
      },
      nodes: [
        {
          id: 'taskSkeleton0',
          task_type: 'method',
          task_identifier: 'taskSkeleton',
          uiProps: {},
        },
      ],
      links: [],
    });
  });

  cy.saveNewWorkflow(id);

  cy.findAllByRole('button', { name: 'taskSkeleton0' })
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

  cy.findByRole('textbox', { name: 'Edit input name' }).type('default_input');
  cy.findByRole('textbox', { name: 'Edit input value' }).type('isaString');

  cy.findByRole('checkbox', { name: 'More handles' }).check();
  cy.findByRole('checkbox', { name: 'With image' }).uncheck();

  cy.intercept('PUT', `api/**/workflow/${id}`, (req) => {
    // Delete unreliable position property
    delete req.body.nodes[0].uiProps.position;

    expect(req.body).to.deep.equal({
      graph: {
        id,
      },
      nodes: [
        {
          id: 'taskSkeleton0',
          label: 'theNewLabel',
          task_type: 'method',
          task_identifier: 'taskSkeleton',
          default_inputs: [{ name: 'default_input', value: 'isaString' }],
          uiProps: {
            comment: 'node comment',
            moreHandles: true,
            withImage: false,
          },
        },
      ],
      links: [],
    });
  });

  cy.findByRole('button', {
    name: /Save workflow to server/,
  }).click();

  cy.deleteWorkflow(id);
});

it('saves a workflow with a link, and saves the workflow after populating the link', () => {
  const id = nanoid();

  cy.findByRole('button', { name: 'General' }).click();
  cy.dragNodeInCanvas('taskSkeleton');
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

  cy.intercept('POST', `api/**/workflows`, (req) => {
    // Delete unreliable position property
    delete req.body.nodes[0].uiProps.position;
    delete req.body.nodes[1].uiProps.position;

    expect(req.body).to.deep.equal({
      graph: { id },
      nodes: [
        {
          id: 'taskSkeleton0',
          task_type: 'method',
          task_identifier: 'taskSkeleton',
          uiProps: {},
        },
        {
          id: 'taskSkeleton1',
          task_type: 'method',
          task_identifier: 'taskSkeleton',
          uiProps: {},
        },
      ],
      links: [
        {
          source: 'taskSkeleton0',
          target: 'taskSkeleton1',
        },
      ],
    });
  });

  cy.saveNewWorkflow(id);
  cy.waitForStableDOM();

  cy.get('.react-flow__edge').first().click({ force: true });
  cy.findByRole('combobox', { name: 'Label' }).click().type('linkLabel');

  cy.findByRole('textbox', { name: 'Edit comment' })
    .click()
    .type('linkComment');

  cy.findByRole('complementary').within(() => {
    cy.contains('Data Mapping')
      .siblings()
      .within(() => {
        cy.contains('Add').should('have.length', 1).click();
        cy.findByRole('textbox', { name: 'Edit source' }).type(
          'sourceDataMapping',
        );
        cy.findByRole('textbox', { name: 'Edit target' }).type(
          'targetDataMapping',
        );
      });
  });

  cy.findByRole('table', { name: 'editable table' }).within(() => {
    cy.contains('Add').should('have.length', 1).click();

    cy.findByRole('textbox', { name: 'Edit input name' }).type(
      'outputConditions',
    );

    cy.findByRole('combobox').should('have.value', 'bool');

    cy.findByRole('radio', { name: 'False' }).should('be.checked');

    cy.findByRole('radio', { name: 'True' }).click();
    cy.findByRole('radio', { name: 'True' }).should('be.checked');
  });

  cy.get('[aria-labelledby="linkTypeLabel"]').click();

  cy.contains('straight').click();

  cy.contains('arrowclosed').click({ force: true });
  cy.contains('none').click({ force: true });

  cy.contains('Animated').siblings().click();

  cy.intercept('PUT', `api/**/workflow/${id}`, (req) => {
    // Delete unreliable position property
    delete req.body.nodes[0].uiProps.position;
    delete req.body.nodes[1].uiProps.position;

    expect(req.body).to.deep.equal({
      graph: { id },
      nodes: [
        {
          id: 'taskSkeleton0',
          task_type: 'method',
          task_identifier: 'taskSkeleton',
          uiProps: {},
        },
        {
          id: 'taskSkeleton1',
          task_type: 'method',
          task_identifier: 'taskSkeleton',
          uiProps: {},
        },
      ],
      links: [
        {
          source: 'taskSkeleton0',
          target: 'taskSkeleton1',
          data_mapping: [
            {
              source_output: 'sourceDataMapping',
              target_input: 'targetDataMapping',
            },
          ],
          conditions: [{ source_output: 'outputConditions', value: true }],
          on_error: false,
          uiProps: {
            label: 'linkLabel',
            comment: 'linkComment',
            type: 'straight',
            animated: true,
            markerEnd: 'none',
          },
        },
      ],
    });
  });
  cy.findByRole('button', {
    name: /Save workflow to server/,
  }).click();

  cy.deleteWorkflow(id);
});

it('saves default inputs with the correct type', () => {
  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.dragNodeInCanvas('ewokscore.tests.examples.tasks.sumtask.SumTask');

  cy.get('.react-flow__node').click();

  cy.findByRole('table', { name: 'editable table' }).within(() => {
    cy.findByRole('button', { name: 'Add entry' }).click();
    cy.findAllByRole('combobox', { name: 'Edit input name' }).last().type('a');
    cy.findAllByRole('combobox', { name: 'Change input type' })
      .last()
      .select('number');
    cy.findAllByRole('spinbutton', { name: 'Edit input value' })
      .last()
      .type('1.7567e2');

    cy.findByRole('button', { name: 'Add entry' }).click();
    cy.findAllByRole('combobox', { name: 'Edit input name' }).last().type('b');
    cy.findAllByRole('combobox', { name: 'Change input type' })
      .last()
      .select('string');
    cy.findAllByRole('textbox', { name: 'Edit input value' }).last().type('1');

    cy.findByRole('button', { name: 'Add entry' }).click();
    cy.findAllByRole('combobox', { name: 'Edit input name' }).last().type('c');
    cy.findAllByRole('combobox', { name: 'Change input type' })
      .last()
      .select('null');

    cy.findByRole('button', { name: 'Add entry' }).click();
    cy.findAllByRole('combobox', { name: 'Edit input name' }).last().type('d');
    cy.findAllByRole('combobox', { name: 'Change input type' })
      .last()
      .select('bool');
    cy.findByRole('radio', { name: 'true' }).click();

    cy.findByRole('button', { name: 'Add entry' }).click();
    cy.findAllByRole('combobox', { name: 'Edit input name' }).last().type('0');
    cy.findAllByRole('combobox', { name: 'Change input type' })
      .last()
      .select('number');
    cy.findAllByRole('spinbutton', { name: 'Edit input value' })
      .last()
      .type('0');
  });

  cy.intercept('POST', 'api/**/workflows', (req) => {
    expect(req.body.nodes[0].default_inputs).to.deep.equal([
      { name: 'a', value: 175.67 },
      { name: 'b', value: '1' },
      { name: 'c', value: null },
      { name: 'd', value: true },
      { name: 0, value: 0 },
    ]);

    return req.reply({});
  }).as('saveRequest');

  cy.saveNewWorkflow(nanoid());

  cy.wait('@saveRequest');
});

it('saves correctly the `required` field for a link', () => {
  const id = nanoid();

  cy.findByRole('button', { name: 'General' }).click();
  cy.dragNodeInCanvas('taskSkeleton');
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
  cy.saveNewWorkflow(id);
  cy.waitForStableDOM();

  cy.get('.react-flow__edge').first().click({ force: true });

  const tests = [
    { radioName: 'False', expected: false },
    { radioName: 'True', expected: true },
    { radioName: 'Default', expected: null },
  ];
  cy.intercept('PUT', `api/**/workflow/${id}`).as('saveRequest');

  tests.forEach(({ radioName, expected }) => {
    cy.findByRole('radiogroup', { name: 'Required' }).within(() => {
      cy.findByRole('radio', { name: radioName }).click();
    });

    cy.findByRole('button', {
      name: /Save workflow to server/,
    }).click();
    cy.wait('@saveRequest').then((interception) => {
      expect(interception.request.body.links[0].required).to.equal(expected);
    });
    cy.waitForStableDOM();
  });

  cy.deleteWorkflow(id);
});

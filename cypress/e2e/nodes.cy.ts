beforeEach(() => {
  cy.loadApp();
  cy.findByRole('button', { name: 'Close task drawer' }).click();
  cy.waitForStableDOM();
  cy.findAllByRole('button', { name: 'ewoksweb' })
    .filter('.react-flow__node')
    .as('node', { type: 'static' })
    .click();
});

it('changes label of node', () => {
  cy.findByRole('textbox', { name: 'Edit label' })
    .click()
    .type('Always and forever...');

  cy.get('.react-flow').contains('Always and forever...').should('be.visible');
});

it('fallbacks on id when there is no label', () => {
  cy.findByRole('textbox', { name: 'Edit label' }).click().clear();

  cy.get('@node').within(() => {
    cy.contains('taskSkeleton0');
  });
});

it('changes comment of node', () => {
  cy.findByRole('textbox', { name: 'Edit comment' })
    .click()
    .type('Always and forever comment...');

  cy.get('@node').click();
  cy.findByRole('textbox', { name: 'Edit comment' }).should(
    'have.value',
    'Always and forever comment...',
  );
});

it('shows/hides the node icon', () => {
  cy.findByLabelText('With image').should('be.checked');
  cy.get('@node').within(() => {
    cy.findByRole('img').should('be.visible');
  });

  cy.findByLabelText('With image').uncheck();
  cy.waitForStableDOM();
  cy.get('@node').within(() => {
    cy.findByRole('img').should('not.exist');
  });
});

it('changes moreHandles of node true->false->true', () => {
  cy.findByRole('checkbox', { name: 'More handles' })
    .as('handleCheckbox')
    .should('not.be.checked');

  cy.get('@node').within(() => {
    cy.get('.react-flow__handle').should('have.length', 2);
  });

  cy.get('@handleCheckbox').check();
  cy.get('@node').within(() => {
    cy.get('.react-flow__handle').should('have.length', 6);
  });

  cy.get('@handleCheckbox').uncheck();
  cy.get('@node').within(() => {
    cy.get('.react-flow__handle').should('have.length', 2);
  });
});

it('deletes a node by button and keyboard', () => {
  cy.get('.react-flow__node').should('have.length', 16);

  cy.get('@node').click();

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: /^Delete Node/ }).click();

  cy.get('.react-flow__node').should('have.length', 15);

  // Broken since ReactFlow update. To try after RF updates.
  // cy.get('.react-flow__node').first().click().type('{del}');
  // cy.get('.react-flow__node').should('have.length', 14);
});

it('duplicates a node by button and keyboard', () => {
  cy.get('.react-flow__node').should('have.length', 16);

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: /^Duplicate Node/ }).click();

  cy.get('.react-flow__node').should('have.length', 17);

  cy.get('@node').click().type('{ctrl}d');

  cy.get('.react-flow__node').should('have.length', 18);
});

it('changes the icon', () => {
  cy.loadApp();

  cy.get('.react-flow__nodes')
    .children()
    .filter('.react-flow__node-ppfmethod')
    .last()
    .as('node');

  // Can be underneath another node
  cy.get('@node').click({ force: true });

  cy.findByRole('combobox', { name: 'Change node icon' }).should(
    'have.value',
    'Use default',
  );
  cy.get('@node').within(() => {
    cy.findByRole('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFC0lEQVR4nO2a308UVx',
      );
  });

  cy.findByRole('combobox', { name: 'Change node icon' }).select('sum.png');
  cy.waitForStableDOM();

  cy.get('@node').within(() => {
    cy.findByRole('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAA7DAAA',
      );
  });

  cy.wait(1000);
  cy.findByRole('combobox', { name: 'Change node icon' })
    .should('not.be.disabled') // Needed to wait the combobox to be ready again after selection
    .select('Use default');
  cy.waitForStableDOM();

  cy.get('@node').within(() => {
    cy.findByRole('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFC0lEQVR4nO2a308UVx',
      );
  });
});

it('should drag and drop a node from add nodes into canvas', () => {
  cy.get('.react-flow__node').should('have.length', 16);

  cy.findByRole('button', { name: 'Open task drawer' }).click();
  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.dragNodeInCanvas('ewokscore.tests.examples.tasks.sumtask.SumTask');

  cy.get('.react-flow__node').should('have.length', 17);
});

it('adds and delete a new default input', () => {
  cy.findByRole('heading', { name: 'Default Inputs' }).should('be.visible');

  cy.findByRole('heading', { name: 'Default Inputs' })
    .parent()
    .as('defaultInputsSection');

  cy.get('@defaultInputsSection').within(() => {
    cy.findAllByRole('row').should('have.length', 2); // Header + Button
    cy.findByRole('button', { name: 'Add entry' }).click();
    cy.findAllByRole('row').should('have.length', 3); // Header + New Row + Button
  });

  cy.findByRole('textbox', { name: 'Edit input name' }).type('Always');
  cy.findByRole('textbox', { name: 'Edit input value' }).type('and forever');

  cy.get('@defaultInputsSection').within(() => {
    cy.findAllByRole('row').should('have.length', 3);
    cy.findByRole('button', { name: 'Remove row' }).click();
    cy.findAllByRole('row').should('have.length', 2);
  });
});

it('opens the duplicates Task form when node is selected', () => {
  cy.get('.react-flow').contains('ewoksweb').parent().click({ force: true });

  cy.waitForStableDOM();

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Create Task from Node' }).click();

  cy.findByRole('dialog', { name: 'Create task' }).should('be.visible');

  cy.findByRole('button', { name: 'Cancel' }).click({ force: true });
});

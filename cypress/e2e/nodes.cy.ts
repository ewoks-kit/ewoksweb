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

it('shows/hides the node icon/label', () => {
  cy.findByLabelText('With label').should('be.checked');
  cy.findByLabelText('With image').should('be.checked');
  cy.get('@node').within(() => {
    cy.findByRole('img').should('be.visible');
    cy.findByText('ewoksweb').should('be.visible');
  });

  cy.findByLabelText('With label').uncheck();
  cy.waitForStableDOM();
  cy.get('@node').within(() => {
    cy.findByRole('img').should('be.visible');
    cy.findByText('ewoksweb').should('not.exist');
  });

  cy.findByLabelText('With image').uncheck();
  cy.waitForStableDOM();
  cy.get('@node').within(() => {
    cy.findByRole('img').should('not.exist');
    cy.findByText('e').should('be.visible'); // label is cropped
  });

  cy.findByLabelText('With label').check();
  cy.waitForStableDOM();
  cy.get('@node').within(() => {
    cy.findByRole('img').should('not.exist');
    cy.findByText('ewoksweb').should('be.visible');
  });
});

it('changes width of node', () => {
  cy.findByRole('slider').as('sliderThumb');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuenow').and('eq', '100');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuemin').and('eq', '40');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuemax').and('eq', '300');

  cy.get('@sliderThumb')
    .trigger('mousedown', { button: 0, force: true })
    .trigger('mousemove', {
      clientX: 1000,
      force: true,
    })
    .wait(200)
    .trigger('mouseup', { force: true });

  cy.get('@sliderThumb').should('have.attr', 'aria-valuenow').and('eq', '300');
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
  cy.findByRole('menuitem', { name: 'Delete Node delete' }).click();

  cy.get('.react-flow__node').should('have.length', 15);

  // cy.get('.react-flow__node').first().click().type('{del}');

  // cy.get('.react-flow__node').should('have.length', 14);
});

it('clones a node by button', () => {
  cy.get('.react-flow__node').should('have.length', 16);

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Clone Node ctrl+v' }).click();

  cy.get('.react-flow__node').should('have.length', 17);
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

  cy.get('[data-cy="inputInEditableCell"]')
    .should('exist')
    .should('be.visible');

  cy.get('[data-cy="inputInEditableCell"]').should('have.length', 2);

  cy.get('[data-cy="inputInEditableCell"]').first().type('Always');
  cy.get('[data-cy="inputInEditableCell"]').last().type('and forever');

  cy.get('@defaultInputsSection').within(() => {
    cy.findAllByRole('row').should('have.length', 3);
    cy.findByRole('button', { name: 'Remove row' }).click();
    cy.findAllByRole('row').should('have.length', 2);
  });
});

it('opens the clone Task form when node is selected', () => {
  cy.get('.react-flow').contains('ewoksweb').parent().click({ force: true });

  cy.waitForStableDOM();

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Create Task from Node' }).click();

  cy.findByRole('dialog', { name: 'Create task' }).should('be.visible');

  cy.findByRole('button', { name: 'Cancel' }).click({ force: true });
});

// TODO: move node - dragstart seems to grasp the inner and creates a ghost
it.skip('should move a node in the canvas', () => {
  // const dataTransfer = new DataTransfer();

  // cy.get('.react-flow__node-graph').last().trigger('dragstart', {
  //   dataTransfer,
  // });

  // cy.get('.react-flow').last().trigger('drop', {
  //   dataTransfer,
  // });
  cy.get('.react-flow__node-graph')
    .last()
    .click()
    .trigger('mousedown', { button: 0 })
    .wait(100)
    .then(($node) => {
      const initialPosition = $node.position();
      const startX = initialPosition.left;
      const startY = initialPosition.top;

      cy.get('.react-flow__node-graph')
        .last()
        .trigger('mousemove', {
          clientX: startX - 100,
          clientY: startY - 100,
          force: true,
        })
        .wait(100)
        .trigger('mouseup', { force: true })
        .wait(100);

      cy.get('.react-flow__node-graph')
        .last()
        .then(($movedNode) => {
          const newPosition = $movedNode.position();
          const movedX = newPosition.left;
          const movedY = newPosition.top;

          expect(movedX).to.not.equal(startX);
          expect(movedY).to.not.equal(startY);
        });
      cy.get('.react-flow__node').should('have.length', 19);
    });
});

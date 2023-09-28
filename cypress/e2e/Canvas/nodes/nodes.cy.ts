beforeEach(() => {
  cy.loadApp();
  cy.findByRole('button', { name: 'Close task drawer' }).click();
  cy.waitForStableDOM();
  cy.findAllByRole('button', { name: 'ewoksweb' })
    .filter('.react-flow__node')
    .as('node')
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
    'Always and forever comment...'
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
  cy.get('@node').within(() => {
    cy.findByRole('img').should('be.visible');
    cy.findByText('ewoksweb').should('not.exist');
  });

  cy.findByLabelText('With image').uncheck();
  cy.get('@node').within(() => {
    cy.findByRole('img').should('not.exist');
    cy.findByText('e').should('be.visible'); // label is cropped
  });

  cy.findByLabelText('With label').check();
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

  cy.get('@sliderThumb').then(($slider) => {
    const { top, bottom } = $slider[0].getBoundingClientRect();
    const yPos = (top + bottom) / 2;

    cy.get('@sliderThumb')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 1000, clientY: yPos })
      .trigger('mouseup', { force: true });

    cy.get('@sliderThumb')
      .should('have.attr', 'aria-valuenow')
      .and('not.eq', '100');

    cy.get('@sliderThumb')
      .should('have.attr', 'aria-valuenow')
      .and('eq', '300');
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
  cy.get('.react-flow__node').should('have.length', 17);

  cy.get('@node').click().type('{del}');

  cy.get('.react-flow__node').should('have.length', 16);

  cy.get('.react-flow__node').first().click();

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Delete Node' }).click();

  cy.get('.react-flow__node').should('have.length', 15);
});

it('clones a node by button', () => {
  cy.get('.react-flow__node').should('have.length', 17);

  cy.findByRole('button', { name: 'Open edit actions menu' }).click();
  cy.findByRole('menuitem', { name: 'Clone Node' }).click();

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
    'Use default'
  );
  cy.get('@node').within(() => {
    cy.findByRole('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFC0lEQVR4nO2a308UVx'
      );
  });

  cy.findByRole('combobox', { name: 'Change node icon' }).select('sum.png');
  cy.waitForStableDOM();

  cy.get('@node').within(() => {
    cy.findByRole('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAA7DAAA'
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
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAFC0lEQVR4nO2a308UVx'
      );
  });
});

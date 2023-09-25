before(() => {
  cy.loadApp();
});

it('selects a default node', () => {
  cy.findByRole('button', { name: 'Close task drawer' }).click();
  cy.waitForStableDOM();
  cy.get('.react-flow__nodes')
    .children()
    .filter('.react-flow__node-ppfmethod')
    .first()
    .click({ force: true });
});

it('changes label of node', () => {
  cy.findByRole('textbox', { name: 'Edit label' })
    .click()
    .type('Always and forever...');

  cy.get('.react-flow').contains('Always and forever...').should('be.visible');
});

it('changes comment of node', () => {
  cy.findByRole('textbox', { name: 'Edit comment' })
    .click()
    .type('Always and forever comment...');

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .click();

  cy.contains('Always and forever comment...');
});

it('changes withImage of node true->false->true', () => {
  cy.findByRole('heading', { name: 'Appearance' }).click();

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 3);

  cy.get('input[name="withImage"]').click();

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 2);

  cy.get('input[name="withImage"]').click();

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 3);
});

it('changes withLabel of node true->false->true', () => {
  cy.get('.react-flow').contains('Always and forever...').parent().as('node');

  cy.get('input[name="withLabel"]').click();

  cy.get('@node').children().should('have.length', 3);

  cy.get('input[name="withLabel"]').click();

  cy.get('@node').children().should('have.length', 4);

  cy.get('.react-flow')
    .contains('Always and forever...')
    .should('be.visible')
    .siblings()
    .should('have.length', 3);
});

it('changes width of node', () => {
  cy.get('.react-flow').contains('Always and forever...').parent().as('node');

  cy.get('span[role="slider"]').as('sliderThumb');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuenow').and('eq', '100');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuemin').and('eq', '40');

  cy.get('@sliderThumb').should('have.attr', 'aria-valuemax').and('eq', '300');

  cy.get('@sliderThumb').then(($slider) => {
    const slider = $slider[0] as HTMLInputElement;

    const { left, right, top, bottom } = $slider[0].getBoundingClientRect();
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
  cy.get('.react-flow').contains('Always and forever...').parent().as('node');

  cy.get('@node').children('.react-flow__handle').should('have.length', 2);

  cy.contains('More handles').siblings('span').click();

  cy.get('@node').children('.react-flow__handle').should('have.length', 4);

  cy.get('@node')
    .children('#choice')
    .should('have.length', 1)
    .children('.react-flow__handle')
    .should('have.length', 2);

  cy.contains('More handles').siblings('span').click();

  cy.get('@node').children('.react-flow__handle').should('have.length', 2);
});

it('deletes a node by button and keyboard', () => {
  cy.get('.react-flow__node').should('have.length', 17);

  cy.get('.react-flow')
    .contains('Always and forever...')
    .parent()
    .should('have.length', 1)
    .click()
    .type('{del}');

  cy.get('.react-flow__node').should('have.length', 16);

  cy.get('.react-flow__node').first().click();
  cy.get('[aria-controls="editSidebar-dropdown-menu"]').click();
  cy.contains('Delete Node').click();

  cy.get('.react-flow__node').should('have.length', 15);
});

it('clones a node by button', () => {
  cy.get('.react-flow__node').first().click({ force: true });

  cy.get('#editSidebar-dropdown-menu').within(() => {
    cy.contains('[role="sidebarMenuItem"]', 'Clone Node').click();
  });

  cy.get('.react-flow__node').should('have.length', 16);
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

  cy.findByRole('combobox', { name: 'Change node icon' }).select('down.svg');
  cy.waitForStableDOM();

  cy.get('@node').within(() => {
    cy.findByRole('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHR'
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

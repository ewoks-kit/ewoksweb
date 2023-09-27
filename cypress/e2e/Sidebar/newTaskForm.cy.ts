import { nanoid } from 'nanoid';

describe('new Task form', () => {
  let selectedButton: JQuery<HTMLElement>; // Declare a local variable for the button reference
  beforeEach(() => {
    cy.loadAppWithoutGraph();

    cy.findByRole('button', { name: 'Open menu with more actions' }).click();
    cy.findByRole('menuitem', { name: 'Create new task' }).click();
    cy.waitForStableDOM();
  });

  it('prevents creating new task without id or type', () => {
    cy.findByRole('button', { name: 'Save Task' }).click();

    cy.findByText('Please give a task identifier !').should('be.visible');

    cy.findByRole('textbox', { name: 'Identifier' }).type('My_new_task');

    cy.findByRole('button', { name: 'Save Task' }).click();

    cy.findByText('Please give a task type !').should('be.visible');
  });

  it('creates a new class task with no inputs/outputs', () => {
    const id = nanoid();
    cy.findByRole('textbox', { name: 'Identifier' }).type(id);

    cy.findByRole('button', { name: /^Task type/ }).click();
    cy.findByRole('option', { name: 'class' }).click();

    cy.findByRole('textbox', { name: 'Category' }).type('Cypress_test');

    cy.findByRole('button', { name: 'Save Task' }).click();

    cy.findByRole('button', { name: 'Cypress_test' }).click();
    cy.findByRole('button', { name: id })
      .should('be.visible')
      .then(($button) => {
        selectedButton = $button;
      });
  });

  it('creates a new class task with inputs and outputs', () => {
    const id = nanoid();
    cy.findByRole('textbox', { name: 'Identifier' }).type(id);

    cy.findByRole('button', { name: /^Task type/ }).click();
    cy.findByRole('option', { name: 'class' }).click();

    cy.findByRole('textbox', { name: 'Category' }).type('Cypress_test');

    cy.findByRole('textbox', { name: 'Required inputs' }).type(
      'arg0, arg1, arg2'
    );
    cy.findByRole('textbox', { name: 'Optional inputs' }).type(
      'opt_arg0, opt_arg1'
    );
    cy.findByRole('textbox', { name: 'Outputs' }).type('results');

    cy.findByRole('button', { name: 'Save Task' }).click();

    cy.findByRole('button', { name: 'Cypress_test' }).click();
    cy.findByRole('button', { name: id })
      .scrollIntoView()
      .should('be.visible')
      .then(($button) => {
        selectedButton = $button;
      });
  });

  it('creates a new class task with no category', () => {
    const id = nanoid();
    cy.findByRole('textbox', { name: 'Identifier' }).type(id);

    cy.findByRole('button', { name: /^Task type/ }).click();
    cy.findByRole('option', { name: 'class' }).click();

    cy.findByRole('button', { name: 'Save Task' }).click();

    cy.findByRole('button', { name: 'No category defined' }).click();
    cy.findByRole('button', { name: id })
      .should('be.visible')
      .then(($button) => {
        selectedButton = $button;
      });
  });

  afterEach(() => {
    if (selectedButton) {
      cy.wrap(selectedButton).should('be.visible').click();

      cy.findByRole('button', { name: 'Delete task' }).click();
      cy.findByRole('button', { name: 'Yes' }).should('be.visible').click();
      cy.wrap(selectedButton).should('not.exist');
    }
  });
});

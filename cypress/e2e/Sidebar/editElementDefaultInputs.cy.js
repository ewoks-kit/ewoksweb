/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('links in a graph', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.get('label')
      .should('include.text', 'Open Workflow')
      .parents('.MuiAutocomplete-root')
      .click()
      .get('input[type=text]')
      .type('tutorial_Graph');

    cy.contains('tutorial_Graph').parent().click();
    cy.window().should('have.property', '__state__');
  });

  it('click on a node and see Default Inputs', () => {
    cy.get('.react-flow').contains('Press NEW').parent().click();

    cy.contains('Default Inputs').should('be.visible');
  });

  it('insert and undo/redo a new Default Input', () => {
    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          0
        )
      );

    cy.get('[data-cy="editButtonEditableTable"]').should('not.exist');

    cy.get('[data-cy="addDefaultInputsButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          1
        )
      );

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(
          store.getState().selectedElement.default_inputs[0]
        ).to.deep.equal({ id: '', name: '', value: '' })
      );

    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          0
        )
      );

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          1
        )
      );
  });

  it('type and undo/redo a new Default Input', () => {
    cy.contains('Default Inputs').should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          1
        )
      );

    cy.get('[data-cy="addDefaultInputsButton"]').click();

    cy.contains(
      'Please fill in the empty line before addining another!'
    ).should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          1
        )
      );

    cy.get('[data-cy="autocompleteInputInEditableCell"]').should('not.exist');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="editButtonEditableTable"]').click();

    cy.get('[data-cy="autocompleteInputInEditableCell"]').should(
      'have.length',
      1
    );
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="autocompleteInputInEditableCell"]').type('Always');
    cy.get('[data-cy="inputInEditableCell"]').type('and forever');

    cy.get('[data-cy="doneEditingButtonEditableTable"]').click();

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(
          store.getState().selectedElement.default_inputs[0]
        ).to.deep.equal({ id: 'Always', name: 'Always', value: 'and forever' })
      );

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) => store.getState().selectedElement.default_inputs)
      .as('data_mapping')
      .should('have.length', 1);

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.get('[data-cy="inputInEditableCell"]').should('not.exist');

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(
          store.getState().selectedElement.default_inputs[0]
        ).to.deep.equal({ id: '', name: '', value: '' })
      );

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(
          store.getState().selectedElement.default_inputs[0]
        ).to.deep.equal({ id: 'Always', name: 'Always', value: 'and forever' })
      );

    cy.get('[data-cy="deleteButtonEditableTable"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          0
        )
      );

    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.default_inputs).to.have.length(
          0
        )
      );
  });
});

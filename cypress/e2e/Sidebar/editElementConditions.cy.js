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

  it('click and undo/redo sidebar on_error', () => {
    cy.get('.react-flow').contains('then...').parent().click();

    cy.contains('on_error').should('be.visible');
    cy.contains('Conditions').should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.on_error).to.equal(false)
      );

    cy.get('[data-cy="onErrorCheckbox"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.on_error).to.equal(true)
      );

    cy.contains('Conditions').should('not.exist');

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.on_error).to.equal(false)
      );

    cy.contains('Conditions').should('be.visible');

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.on_error).to.equal(true)
      );
  });

  it('insert and undo/redo a new Data Mapping', () => {
    cy.get('[data-cy="onErrorCheckbox"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
          0
        )
      );

    cy.get('[data-cy="editButtonEditableTable"]').should('not.exist');

    cy.get('[data-cy="addConditionsButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
          1
        )
      );

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.conditions[0]
        ).to.deep.equal({ id: '', name: '', value: false })
      );

    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
          0
        )
      );

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
          1
        )
      );
  });

  it('type and undo/redo a new Condition', () => {
    cy.contains('Conditions').should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
          1
        )
      );

    cy.get('[data-cy="addConditionsButton"]').click();

    cy.contains(
      'Please fill in the empty line before addining another!'
    ).should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
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
    cy.get('[data-cy="radioInEditableCell"]')
      .children('label')
      .first()
      .children('span')
      .first()
      .click();

    cy.get('[data-cy="doneEditingButtonEditableTable"]').click();

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.window()
      .its('__state__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.conditions[0]
        ).to.deep.equal({
          source_output: 'Always',
          value: 'true',
        })
      );

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) => store.getState().selectedElement.data.conditions)
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
          store.getState().selectedElement.data.conditions[0]
        ).to.deep.equal({ id: '', name: '', value: false })
      );

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.conditions[0]
        ).to.deep.equal({
          source_output: 'Always',
          value: 'true',
        })
      );

    cy.get('[data-cy="deleteButtonEditableTable"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
          0
        )
      );

    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__state__')
      .then((store) =>
        expect(store.getState().selectedElement.data.conditions).to.have.length(
          0
        )
      );
  });
});

/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('edit links dataMapping', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.get('label')
      .should('include.text', 'Open workflow')
      .parents('.MuiAutocomplete-root')
      .click()
      .get('input[type=text]')
      .type('tutorial_Graph');

    cy.contains('tutorial_Graph').parent().click();
    cy.window().should('have.property', '__useStore__');
  });

  it('click and undo/redo sidebar Map all Data', () => {
    cy.get('.react-flow').contains('web app?').parent().click();

    cy.contains('Map all Data').should('be.visible');

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(store.getState().selectedElement.data.map_all_data).to.equal(
          true
        )
      );

    cy.get('[data-cy="mapAllDataCheckbox"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(store.getState().selectedElement.data.map_all_data).to.equal(
          false
        )
      );

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(store.getState().selectedElement.data.map_all_data).to.equal(
          true
        )
      );

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(store.getState().selectedElement.data.map_all_data).to.equal(
          false
        )
      );
  });

  it('insert and undo/redo a new Data Mapping', () => {
    cy.contains('Data Mapping').should('be.visible');

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(0)
      );

    cy.get('[data-cy="editButtonEditableTable"]').should('not.exist');

    cy.get('[data-cy="addDataMappingButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(1)
      );

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping[0]
        ).to.deep.equal({ id: '', name: '', value: '' })
      );

    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(0)
      );

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(1)
      );
  });

  it('type and undo/redo a new Data Mapping', () => {
    cy.contains('Data Mapping').should('be.visible');

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(1)
      );

    cy.get('[data-cy="addDataMappingButton"]').click();

    cy.contains(
      'Please fill in the empty line before addining another!'
    ).should('be.visible');

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(1)
      );

    cy.get('[data-cy="inputInEditableCell"]').should('not.exist');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="editButtonEditableTable"]').click();

    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 2);
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="inputInEditableCell"]').first().type('Always');
    cy.get('[data-cy="inputInEditableCell"]').last().type('and forever');

    cy.get('[data-cy="doneEditingButtonEditableTable"]').click();

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping[0]
        ).to.deep.equal({
          source_output: 'Always',
          target_input: 'and forever',
        })
      );

    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) => store.getState().selectedElement.data.data_mapping)
      .as('data_mapping')
      .should('have.length', 1);

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.get('[data-cy="inputInEditableCell"]').should('not.exist');

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping[0]
        ).to.deep.equal({ id: '', name: '', value: '' })
      );

    cy.get('[data-cy="redoButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping[0]
        ).to.deep.equal({
          source_output: 'Always',
          target_input: 'and forever',
        })
      );

    cy.get('[data-cy="deleteButtonEditableTable"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(0)
      );

    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();

    cy.window()
      .its('__useStore__')
      .then((store) =>
        expect(
          store.getState().selectedElement.data.data_mapping
        ).to.have.length(0)
      );
  });
});

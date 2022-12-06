/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('draw links', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.window().should('have.property', '__useStore__');
  });

  it('on load it fetches icons from server', () => {
    cy.window()
      .its('__useStore__')
      .then((store) => store.getState().allIcons)
      .should('not.have.length', 0);
  });

  it('icons appear on tasks correctly', () => {
    cy.contains('General').click();

    cy.get('[data-cy="add-nodes-category-General"]')
      .find('.dndnode')
      .first()
      .children('span')
      .children('span')
      .should('have.text', 'taskSkeleton')
      .siblings('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAGaUlEQVR4nO2aX0xT'
      );

    cy.get('[data-cy="add-nodes-category-General"]')
      .find('.dndnode')
      .eq(1)
      .children('span')
      .children('span')
      .should('have.text', 'graphOutput')
      .siblings('img')
      .should('have.attr', 'src')
      .should(
        'include',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9'
      );
  });

  it('should upload an icon and appear on the list - form disk???', () => {});
  it('should delete an icon and disappear from the list', () => {});
});

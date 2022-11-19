/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

import Canvas from '../../src/Components/Canvas/Canvas';
import IconMenu from '../../src/Components/Sidebar/IconMenu';
import Dashboard from '../../src/layout/Dashboard';
import { ReactFlowProvider } from 'react-flow-renderer';

describe('Canvas.cy.ts', () => {
  it('mounts', () => {
    cy.mount(
      <IconMenu />
      // <ReactFlowProvider>
      //   <Canvas />
      // </ReactFlowProvider>
    );
    cy.get('svg').should('have.length', 1).click();

    cy.contains('New Task').click();
    cy.contains('Category').type('the best category');
  });
});

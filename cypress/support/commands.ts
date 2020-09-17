/* eslint-disable @typescript-eslint/no-namespace, no-redeclare */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { Store } from '@ngxs/store';

import 'cypress-shadow-dom';
import './store.commands';
import './general.commands';
import './player-controls.commands';

// Must be declared global to be detected by typescript (allows import/export)
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Get one or more DOM elements by data-cy attribute.
       *
       * @param {string} id - data-cy attribute value.
       */
      getCy(id: string): Chainable<Subject>;
    }
  }
  interface Window {
    store: Store;
  }
}

Cypress.Commands.add('getCy', (id: string) => cy.get(`[data-cy=${id}]`));


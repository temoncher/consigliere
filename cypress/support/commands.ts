/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { Store, ActionType } from '@ngxs/store';

import 'cypress-shadow-dom';
import './store.commands';
import './general.commands';
import './player-controls.commands';
import { PlayerControlsOptions } from '../models/player-controls-options.interface';

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
      /**
       * 1. Locate to application page.
       * 2. Locate to table tab.
       * 3. Click new game button.
       * 4. Click proceed button.
       *
       */
      startGame(): void;
      /**
       * Pick one of player controls menu options.
       *
       * @param {PlayerControlsOptions} options - player number and action type.
       */
      playerControlsChoose(options: PlayerControlsOptions): void;
      /**
       * Dispatches store action.
       *
       * @param {ActionType} action - store action.
       */
      dispatch<T extends ActionType>(action: T): void;
    }
  }
  interface Window {
    store: Store;
  }
}

Cypress.Commands.add('getCy', (id: string) => cy.get(`[data-cy=${id}]`));


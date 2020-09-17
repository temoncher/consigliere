import { ActionType } from '@ngxs/store';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Dispatches store action.
       *
       * @param {ActionType} action - store action.
       */
      dispatch<T extends ActionType>(action: T): void;
    }
  }
}

Cypress.Commands.add('dispatch', <T extends ActionType>(action: T) => cy.window()
  .then((windowObject) => {
    const { store } = windowObject;

    store.dispatch(action);
  }));

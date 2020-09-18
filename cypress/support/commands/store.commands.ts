declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Dispatches store action.
       *
       * @param {ActionType} action - store action.
       */
      dispatch(action: any): void;
    }
  }
}

Cypress.Commands.add('dispatch', (action: any) => cy.window()
  .then((windowObject) => {
    const { store } = windowObject;

    store.dispatch(action);
  }));

export {};

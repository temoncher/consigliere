import { ActionType } from '@ngxs/store';

// eslint-disable-next-line arrow-body-style
Cypress.Commands.add('dispatch', <T extends ActionType>(action: T) => {
  return cy.window()
    .then((windowObject) => {
      const { store } = windowObject;

      store.dispatch(action);
    });
});

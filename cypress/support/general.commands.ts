import { localhost } from '../constants/urls';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * 1. Locate to application page.
       * 2. Locate to table tab.
       * 3. Click new game button.
       * 4. Click proceed button.
       *
       */
      startGame(): void;
    }
  }
}

Cypress.Commands.add('startGame', () => {
  cy.visit(localhost);

  cy.wait(500);
  cy.get('#new-game-button')
    .click();

  cy.wait(500);
  cy.get('#proceed-button')
    .click();
});

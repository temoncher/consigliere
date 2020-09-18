import { Chance } from 'chance';

const chance = new Chance();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * ! Should be used, when preparation modal is opened
       * Opens guest prompt and adds guest to players array.
       *
       * @param {string} [nickname] - guest's nickname(creates random nickname if not specified)
       */
      addGuest(nickname: string): void;
    }
  }
}

Cypress.Commands.add('addGuest', (nickname: string) => {
  /* Click add guest */
  cy.wait(500);
  cy.getCy('add-guest-item')
    .click();

  /* Add guest prompt */
  cy.wait(1000);
  cy.get('#nickname-input')
    .click()
    .clear()
    .type(nickname, { delay: 100 })
    .should('have.value', nickname);
  cy.get('.submit-button')
    .click(); // Accept button
});

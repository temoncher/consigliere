declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * ! Should be used, when preparation modal is opened
       * Opens guest prompt and adds guest to players array.
       *
       * @param {string} [nickname] - guest's nickname(creates random nickname if not specified)
       */
      addGuest(nickname: string, delay?: number): void;
    }
  }
}

Cypress.Commands.add('addGuest', (nickname: string, delay: number = 2000) => {
  /* Click add guest */
  cy.getCy('add-guest-item')
    .wait(delay)
    .click();

  /* Add guest prompt */
  cy.get('#nickname-input')
    .wait(delay)
    .click()
    .clear()
    .type(nickname, { delay: 100 })
    .should('have.value', nickname);
  cy.get('.submit-button')
    .click(); // Accept button
});

export {};

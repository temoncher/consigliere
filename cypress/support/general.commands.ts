import { localhost } from '../constants/urls';

Cypress.Commands.add('startGame', () => {
  cy.visit(localhost);

  cy.wait(500);
  cy.get('#new-game-button')
    .click();

  cy.wait(500);
  cy.get('#proceed-button')
    .click();
});

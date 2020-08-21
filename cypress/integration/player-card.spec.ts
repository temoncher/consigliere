import { localhost } from './urls';

describe('Player card', () => {
  beforeEach(() => {
    cy.visit(localhost);

    cy.wait(500);
    cy.get('#new-game-button')
      .click();

    cy.wait(500);
    cy.get('#proceed-button')
      .click();
  });
});

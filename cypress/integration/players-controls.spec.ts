import { localhost } from './urls';

describe('Players bar', () => {
  beforeEach(() => {
    cy.visit(localhost);
  });

  it('should be visible and contain 10 cards', () => {
    cy.wait(500);
    cy.get('#new-game-button')
      .click();

    cy.wait(500);
    cy.get('#proceed-button')
      .click();

    cy.get('.player-controls')
      .find('#player-controls__slider')
      .should('be.visible')
      .find('app-small-player-card')
      .should('have.length', 10);
  });

  it.only('should show/hide on button click', () => {
    cy.wait(500);
    cy.get('#new-game-button')
      .click();

    cy.wait(500);
    cy.get('#proceed-button')
      .click();

    cy.get('.toggle-controls-button')
      .find('ion-icon')
      .should('have.attr', 'name', 'chevron-up');

    cy.wait(500);
    cy.get('.toggle-controls-button')
      .click();

    cy.get('.toggle-controls-button')
      .find('ion-icon')
      .should('have.attr', 'name', 'chevron-down');

    cy.get('.player-controls')
      .find('#player-controls__slider')
      .should('not.be.visible');

    cy.wait(500);
    cy.get('.toggle-controls-button')
      .click();

    cy.get('.player-controls')
      .find('#player-controls__slider')
      .should('be.visible');

  });
});

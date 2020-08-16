import { localhost } from './urls';

describe('Game menu', () => {
  beforeEach(() => {
    cy.visit(localhost);

    cy.wait(500);
    cy.get('#new-game-button')
      .click();

    cy.wait(500);
    cy.get('#proceed-button')
      .click();
  });

  it('should show/hide roles', () => {
    // open menu
    cy.get('#menu-button')
      .click();

    cy.wait(500);
    cy.get('ion-menu[menuid=game-menu]')
      .should('be.visible')
      .find('.toggle-roles-option')
      .first()
      .should('be.visible')
      .click();

    // find all mafia cards
    cy.get('.player-controls')
      .find('#player-controls__slider')
      .should('be.visible')
      .find('.background-color-dark', { includeShadowDom: true })
      .should('have.length', 3);

    // find don card
    cy.get('.player-controls')
      .find('#don-label', { includeShadowDom: true })
      .should('have.length', 1);

    // find sherrif card
    cy.get('.player-controls')
      .find('#sheriff-label', { includeShadowDom: true })
      .should('have.length', 1);

    // close menu
    cy.get('#menu-button')
      .click();

    cy.wait(500);
    cy.get('ion-menu[menuid=game-menu]')
      .should('be.visible')
      .find('.toggle-roles-option')
      .first()
      .should('be.visible')
      .click();

    // find all mafia cards
    cy.get('.player-controls')
      .find('#player-controls__slider')
      .should('be.visible')
      .find('.background-color-dark', { includeShadowDom: true })
      .should('have.length', 0);

    // find don card
    cy.get('.player-controls')
      .find('#don-label', { includeShadowDom: true })
      .should('have.length', 0);

    // find sherrif card
    cy.get('.player-controls')
      .find('#sheriff-label', { includeShadowDom: true })
      .should('have.length', 0);
  });
});

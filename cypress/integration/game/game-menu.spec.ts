describe('[Game] Menu', () => {
  beforeEach(() => {
    cy.startGame();
  });

  it('should show/hide roles', () => {
    // open menu
    cy.getCy('game-menu-button')
      .click();

    cy.wait(500);
    cy.get('ion-menu[menuid=game-menu]')
      .should('be.visible')
      .find('.toggle-roles-option')
      .first()
      .should('be.visible')
      .click();

    // find all mafia cards
    cy.getCy('player-controls')
      .find('.background-color-dark', { includeShadowDom: true })
      .should('have.length', 3);

    // find don card
    cy.getCy('player-controls')
      .find('#don-label', { includeShadowDom: true })
      .should('have.length', 1);

    // find sherrif card
    cy.getCy('player-controls')
      .find('#sheriff-label', { includeShadowDom: true })
      .should('have.length', 1);

    // close menu
    cy.getCy('game-menu-button')
      .click();

    cy.wait(500);
    cy.get('ion-menu[menuid=game-menu]')
      .should('be.visible')
      .find('.toggle-roles-option')
      .first()
      .should('be.visible')
      .click();

    // find all mafia cards
    cy.getCy('player-controls')
      .find('.background-color-dark', { includeShadowDom: true })
      .should('have.length', 0);

    // find don card
    cy.getCy('player-controls')
      .find('#don-label', { includeShadowDom: true })
      .should('have.length', 0);

    // find sherrif card
    cy.getCy('player-controls')
      .find('#sheriff-label', { includeShadowDom: true })
      .should('have.length', 0);
  });
});

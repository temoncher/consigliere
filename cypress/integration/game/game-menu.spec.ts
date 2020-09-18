describe.skip('[Game] Menu', () => {
  beforeEach(() => {
    cy.startGame();
  });

  it('should show/hide roles', () => {
    cy.log('Toggling roles...');
    cy.wait(1000);
    cy.getCy('game-menu-button')
      // ERROR: cannot read property offsetWidth of undefined
      .click();

    cy.wait(1000);
    cy.get('ion-menu[menuid=game-menu]')
      .should('be.visible')
      .find('.toggle-roles-option')
      .should('be.visible')
      .click();

    cy.log('Verifying number of mafia...');
    cy.getCy('player-controls')
      .find('.background-color-dark', { includeShadowDom: true })
      .should('have.length', 3);

    cy.log('Verifying don...');
    cy.getCy('player-controls')
      .find('#don-label', { includeShadowDom: true })
      .should('have.length', 1);

    cy.log('Verifying sheriff...');
    cy.getCy('player-controls')
      .find('#sheriff-label', { includeShadowDom: true })
      .should('have.length', 1);

    cy.log('Toggling roles...');
    cy.getCy('game-menu-button')
      .click();

    cy.wait(500);
    cy.get('ion-menu[menuid=game-menu]')
      .should('be.visible')
      .find('.toggle-roles-option')
      .first()
      .should('be.visible')
      .click();

    cy.log('Verifying all mafia is hidden...');
    cy.getCy('player-controls')
      .find('.background-color-dark', { includeShadowDom: true })
      .should('have.length', 0);

    cy.log('Verifying don is hidden...');
    cy.getCy('player-controls')
      .find('#don-label', { includeShadowDom: true })
      .should('have.length', 0);

    cy.log('Verifying sheriff is hidden...');
    cy.getCy('player-controls')
      .find('#sheriff-label', { includeShadowDom: true })
      .should('have.length', 0);
  });
});

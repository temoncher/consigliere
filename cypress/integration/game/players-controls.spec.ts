describe('[Game] Players controls', () => {
  beforeEach(() => {
    cy.startGame();
  });

  it('should be visible and contain 10 cards with numbers from 1 to 10', () => {
    cy.getCy('player-controls')
      .find('#player-controls__slider')
      .should('be.visible')
      .find('app-small-player-card')
      .should('have.length', 10)
      .each((card, cardIndex) => {
        const cardShadowRoot = card.get()[0].shadowRoot;
        const cardContent = cardShadowRoot?.querySelector('ion-card-content');

        expect(cardContent).contain(cardIndex + 1);
      });
  });

  it('should show/hide on button click', () => {
    cy.get('.toggle-controls-button')
      .find('ion-icon')
      .should('have.attr', 'name', 'chevron-up');

    cy.wait(500);
    cy.get('.toggle-controls-button')
      .click();

    cy.get('.toggle-controls-button')
      .find('ion-icon')
      .should('have.attr', 'name', 'chevron-down');

    cy.getCy('player-controls')
      .find('#player-controls__slider')
      .should('not.be.visible');

    cy.wait(500);
    cy.get('.toggle-controls-button')
      .click();

    cy.getCy('player-controls')
      .find('#player-controls__slider')
      .should('be.visible');
  });

  it('should assign falls', () => {
    cy.getCy('player-controls')
      .find('falls-label', { includeShadowDom: true })
      .should('have.length', 0);

    cy.playerControlsChoose({
      playerNumber: 1,
      action: 'assignFall',
    });

    cy.getCy('player-controls')
      .find('app-small-player-card')
      .first()
      .find('.falls-label', { includeShadowDom: true })
      .should('contain.text', 1);

    cy.playerControlsChoose({
      playerNumber: 1,
      action: 'assignFall',
    });

    cy.getCy('player-controls')
      .find('app-small-player-card')
      .first()
      .find('.falls-label', { includeShadowDom: true })
      .should('contain.text', 2);
  });

  it('should kick players', () => {
    cy.getCy('player-controls')
      .find('.quit-overlay', { includeShadowDom: true })
      .should('have.length', 0);

    cy.playerControlsChoose({
      playerNumber: 1,
      action: 'kick',
    });

    cy.getCy('player-controls')
      .find('.quit-overlay', { includeShadowDom: true })
      .should('have.length', 1)
      .first()
      .should('contain.text', '0н');

    cy.playerControlsChoose({
      playerNumber: 3,
      action: 'kick',
    });

    cy.getCy('player-controls')
      .find('.quit-overlay', { includeShadowDom: true })
      .should('have.length', 2)
      .last()
      .should('contain.text', '0н');
  });

  it('should refresh players', () => {
    cy.playerControlsChoose({
      playerNumber: 1,
      action: 'assignFall',
    });
    cy.playerControlsChoose({
      playerNumber: 1,
      action: 'assignFall',
    });

    cy.playerControlsChoose({
      playerNumber: 1,
      action: 'refresh',
    });

    cy.getCy('player-controls')
      .find('falls-label', { includeShadowDom: true })
      .should('have.length', 0);

    cy.playerControlsChoose({
      playerNumber: 3,
      action: 'kick',
    });

    cy.playerControlsChoose({
      playerNumber: 3,
      action: 'refresh',
    });

    cy.getCy('player-controls')
      .find('.quit-overlay', { includeShadowDom: true })
      .should('have.length', 0);
  });
});

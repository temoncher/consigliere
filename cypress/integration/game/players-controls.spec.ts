import { PlayerControlsAction } from '@shared/models/table/player-controls-action.enum';

describe('[Game] Players controls', () => {
  beforeEach(() => {
    cy._startGame();
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

    cy.wait(1000);
    cy.get('.toggle-controls-button')
      .click();

    cy.get('.toggle-controls-button')
      .find('ion-icon')
      .should('have.attr', 'name', 'chevron-down');

    cy.getCy('player-controls')
      .find('#player-controls__slider')
      .should('not.be.visible');

    cy.wait(1000);
    cy.get('.toggle-controls-button')
      .click();

    cy.getCy('player-controls')
      .find('#player-controls__slider')
      .should('be.visible');
  });

  it('should assign falls', () => {
    cy.log('Checking if all falls are clear...');
    cy.getCy('player-controls')
      .find('falls-label', { includeShadowDom: true })
      .should('have.length', 0);

    cy.log('Assigning first fall to a player...');
    cy.playerControlsChoose({
      playerNumber: 1,
      action: PlayerControlsAction.FALL,
    });

    cy.log('Checking if first fall is assigned correctly...');
    cy.getCy('player-controls')
      .find('app-small-player-card')
      .first()
      .find('.falls-label', { includeShadowDom: true })
      .should('contain.text', 1);

    cy.log('Assigning second fall to a player...');
    cy.playerControlsChoose({
      playerNumber: 1,
      action: PlayerControlsAction.FALL,
    });

    cy.log('Checking if second fall is assigned correctly...');
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
      action: PlayerControlsAction.KICK,
    });

    cy.getCy('player-controls')
      .find('.quit-overlay', { includeShadowDom: true })
      .should('have.length', 1)
      .first()
      .should('contain.text', '0н');

    cy.playerControlsChoose({
      playerNumber: 3,
      action: PlayerControlsAction.KICK,
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
      action: PlayerControlsAction.FALL,
    });
    cy.playerControlsChoose({
      playerNumber: 1,
      action: PlayerControlsAction.FALL,
    });

    cy.playerControlsChoose({
      playerNumber: 1,
      action: PlayerControlsAction.REFRESH,
    });

    cy.getCy('player-controls')
      .find('falls-label', { includeShadowDom: true })
      .should('have.length', 0);

    cy.playerControlsChoose({
      playerNumber: 3,
      action: PlayerControlsAction.KICK,
    });

    cy.playerControlsChoose({
      playerNumber: 3,
      action: PlayerControlsAction.REFRESH,
    });

    cy.getCy('player-controls')
      .find('.quit-overlay', { includeShadowDom: true })
      .should('have.length', 0);
  });
});

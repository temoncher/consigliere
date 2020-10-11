import { PlayersState } from '@/table/store/players/players.state';

import { Role } from '~types/role.enum';

describe('[Game] Night', () => {
  beforeEach(() => {
    cy._startGame();
  });

  it('should show game stage and day number on the toolbar', () => {
    cy.get('ion-toolbar')
      .should('contain.text', 'Ночь')
      .should('contain.text', 0);
  });
});

// TODO: update this test
describe.skip('[Game] Night - Give roles', () => {
  beforeEach(() => {
    cy._startGame();
  });

  it('should contain ten cards with players\' numbers', () => {
    cy.get('.give-roles')
      .find('app-small-player-card')
      .should('have.length', 10)
      .each((card, cardIndex) => {
        const cardShadowRoot = card.get()[0].shadowRoot;
        const cardContent = cardShadowRoot?.querySelector('ion-card-content');

        expect(cardContent).contain(cardIndex + 1);
      });
  });

  it('should contain center player card', () => {
    cy.window()
      .then(({ store }) => {
        const playerNumber = 1;
        const players = store.selectSnapshot(PlayersState.getPlayers);
        const firstPlayer = players.find((player) => player.number === playerNumber);

        cy.get('.give-roles')
          .find('.player-card', { includeShadowDom: true })
          .should('have.length', 1)
          .should('contain.text', 1)
          .should('contain.text', firstPlayer.nickname);
      });
  });

  it('should show/hide player\'s role on center card click', () => {
    cy.window()
      .then(({ store }) => {
        const showRoleText = 'Нажмите, чтобы увидеть роль';
        const playerNumber = 1;
        const players = store.selectSnapshot(PlayersState.getPlayers);
        const firstPlayer = players.find((player) => player.number === playerNumber);

        cy.get('.give-roles')
          .find('.player-card', { includeShadowDom: true })
          .should('contain.text', showRoleText)
          .click()
          .should('contain.text', firstPlayer.role)
          .click()
          .should('contain.text', showRoleText);
      });
  });

  it('should navigate to next player card after hiding role', () => {
    cy.window()
      .then(({ store }) => {
        const playerNumber = 1;
        const players = store.selectSnapshot(PlayersState.getPlayers);
        const startingPlayer = players.find((player) => player.number === playerNumber);
        const nextPlayer = players.find((player) => player.number === playerNumber + 1);

        cy.get('.give-roles')
          .find('.player-card', { includeShadowDom: true })
          .should('contain.text', startingPlayer.number)
          .should('contain.text', startingPlayer.nickname)
          .click()
          .click()
          .should('contain.text', nextPlayer.number)
          .should('contain.text', nextPlayer.nickname);
      });
  });

  it('should navigate to another player\'s card by clicking small card', () => {
    cy.window()
      .then(({ store }) => {
        const playerNumber = 3;
        const players = store.selectSnapshot(PlayersState.getPlayers);
        const chosenPlayer = players.find((player) => player.number === playerNumber);

        cy.get('.give-roles')
          .find('app-small-player-card')
          .find('ion-card', { includeShadowDom: true })
          .contains(chosenPlayer.number)
          .click();

        cy.get('.give-roles')
          .find('.player-card', { includeShadowDom: true })
          .should('contain.text', chosenPlayer.nickname)
          .should('contain.text', chosenPlayer.number);
      });
  });

  it('should navigate to don stage', () => {
    cy.get('ion-toolbar')
      .should('be.visible')
      .find('#next-stage-button')
      .should('be.visible')
      .should('contain.text', 'Дон')
      .click();

    cy.get('app-don')
      .should('be.visible');
  });
});

// TODO: update this test
describe.skip('[Game] Night - Don', () => {
  beforeEach(() => {
    cy._startGame();

    cy.get('ion-toolbar')
      .should('be.visible')
      .find('#next-stage-button')
      .should('be.visible')
      .click();
  });

  it('should contain don card', () => {
    cy.get('app-don')
      .find('ion-icon[name=rose]')
      .should('be.visible');
  });

  it('should contain don nickname', () => {
    cy.window()
      .then(({ store }) => {
        const [don] = store.selectSnapshot(PlayersState.getPlayersByRoles([Role.DON]));

        cy.get('app-don')
          .should('contain.text', don.nickname);
      });
  });

  it('should navigate to sheriff stage', () => {
    cy.get('ion-toolbar')
      .should('be.visible')
      .find('#next-stage-button')
      .should('be.visible')
      .should('contain.text', 'Шериф')
      .click();

    cy.get('app-sheriff')
      .should('be.visible');
  });
});

// TODO: update this test
describe.skip('[Game] Night - Sheriff', () => {
  beforeEach(() => {
    cy._startGame();

    cy.get('ion-toolbar')
      .should('be.visible')
      .find('#next-stage-button')
      .should('be.visible')
      .click()
      .click();
  });

  it('should contain sheriff card', () => {
    cy.get('app-sheriff')
      .find('ion-icon[name=star]')
      .should('be.visible');
  });

  it('should contain don nickname', () => {
    cy.window()
      .then(({ store }) => {
        const [sheriff] = store.selectSnapshot(PlayersState.getPlayersByRoles([Role.SHERIFF]));

        cy.get('app-sheriff')
          .should('contain.text', sheriff.nickname);
      });
  });

  it('should navigate start new day', () => {
    cy.get('ion-toolbar')
      .should('be.visible')
      .find('#next-stage-button')
      .should('be.visible')
      .should('contain.text', 'Утро')
      .click();

    cy.url()
      .should('include', 'day');

    cy.get('app-day')
      .should('be.visible');
  });
});

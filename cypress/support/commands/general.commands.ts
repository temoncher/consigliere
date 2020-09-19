import { localhost } from '@e2e/constants/urls';
import { dummyHost, dummyPlayers } from '@shared/store/game/players/players-mocks';
import { PlayersStateModel } from '@shared/store/game/players/players.state';

import { EmptyAction } from '../empty.action';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * ! Programmatically
       * 1. Visit to application page.
       * 2. Navigate to table tab.
       * 3. Fill players and host
       * 4. Click proceed button.
       *
       */
      _startGame(delay?: number): void;
      /**
       * 1. Visit to application page.
       * 2. Navigate to table tab.
       * 3. Fill players and host
       * 4. Click proceed button.
       *
       */
      startGame(delay?: number): void;
    }
  }
}

Cypress.Commands.add('_startGame', (delay: number = 1000) => {
  cy.visit(localhost);

  cy.getCy('new-game-button')
    .click();

  cy.window()
    .then(({ store }) => {
      const storeSnapshot = store.snapshot();
      const newPlayersState: PlayersStateModel = {
        ...storeSnapshot.game.players,
        host: dummyHost,
        players: dummyPlayers,
      };

      store.reset({
        ...storeSnapshot,
        game: {
          ...storeSnapshot.game,
          players: newPlayersState,
        },
      });

      store.dispatch(new EmptyAction());

      cy.wait(delay);
      cy.getCy('proceed-button')
        .click();
    });
});

Cypress.Commands.add('startGame', (delay: number = 1000) => {
  cy.visit(localhost);

  cy.getCy('new-game-button')
    .click();

  cy.log('Adding host...');
  cy.getCy('add-host-item')
    .click();

  cy.addGuest(dummyHost.nickname, delay);

  cy.log('Adding players...');

  dummyPlayers.forEach((player) => {
    cy.getCy('add-player-item')
      .click({ force: true });

    cy.addGuest(player.nickname, delay);

    cy.getCy('change-role')
      .eq(player.number - 1)
      .click()
      .wait(delay)
      .getCy(player.role)
      .click();
  });

  cy.getCy('proceed-button')
    .click();
});

import { localhost } from '@e2e/constants/urls';
import { dummyHost, dummyPlayers } from '@shared/store/game/players/players-mocks';
import { PlayersStateModel } from '@shared/store/game/players/players.state';

import { EmptyAction } from '../empty.action';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * 1. Locate to application page.
       * 2. Locate to table tab.
       * 3. Click new game button.
       * 4. Click proceed button.
       *
       */
      startGame(): void;
    }
  }
}

Cypress.Commands.add('startGame', () => {
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

      cy.getCy('proceed-button')
        .click();
    });
});

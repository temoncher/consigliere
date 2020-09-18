import { localhost } from '@e2e/constants/urls';
import { Player } from '@shared/models/player.model';
import { AddPlayer, SetHost } from '@shared/store/game/players/players.actions';
import { Chance } from 'chance';

const chance = new Chance();

describe('[Game] Lobby', () => {
  beforeEach(() => {
    cy.visit(localhost);

    /* Menu */
    cy.getCy('new-game-button')
      .click();
  });

  it('should add host', () => {
    const hostName = chance.first();

    /* Click add host */
    cy.getCy('add-host-item')
      .click();

    cy.log('Adding guest player...');
    cy.addGuest(hostName);

    cy.log('Checking if host has the same name...');
    cy.getCy('host-card')
      .should('contain', hostName);
  });

  it('should change host', () => {
    const hostName = chance.first();
    const newHostName = chance.first();

    cy.window()
      .then(({ store }) => {
        store.dispatch(new SetHost(new Player({
          nickname: hostName,
          user: { id: 'host-id' },
        })));

        /* Lobby */
        cy.getCy('change-host-button')
          .click();

        cy.addGuest(newHostName);

        /* Lobby */
        cy.getCy('host-card')
          .should('contain', newHostName);
      });
  });

  it('should add guest player', () => {
    const playerName = chance.first();

    cy.getCy('add-player-item')
      .click();

    /* Lobby */
    cy.addGuest(playerName);
  });

  it('should remove player', () => {
    cy.window()
      .then(({ store }) => {
        store.dispatch(new AddPlayer(new Player({
          nickname: chance.first(),
          user: {
            id: 'user-id',
          },
        })));

        /* Lobby */
        cy.get('.player-list__item')
          .first()
          .should('contain', '1')
          .find('[name=close]')
          .click({ force: true }); // Workaround to click not visible element (scroll problem)

        cy.get('.player-list__item')
          .should('have.length', 0);
      });
  });
});

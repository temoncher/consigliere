import { localhost } from '@e2e/constants/urls';
import { Chance } from 'chance';

import { Player } from '@/shared/models/player.model';
import { AddPlayer, SetHost } from '@/table/store/players/players.actions';

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
          user: {
            uid: 'host-id',
            nickname: 'host-nickname',
          },
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

    cy.addGuest(playerName);
  });

  it('should remove player', () => {
    cy.window()
      .then(({ store }) => {
        store.dispatch(new AddPlayer(new Player({
          nickname: chance.first(),
          user: {
            uid: 'user-id',
            nickname: 'user-nickname',
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

  it('should change player\'s role', () => {
    cy.window()
      .then(({ store }) => {
        store.dispatch(new AddPlayer(new Player({
          nickname: chance.first(),
          user: {
            uid: 'user-id',
            nickname: 'user-nickname',
          },
        })));

        cy.log('Changin role to Don...');
        cy.get('.player-list__item')
          .first()
          .getCy('change-role')
          .click()
          .wait(1000)
          .getCy(Role.DON)
          .click();

        cy.log('Checking if role is assigned correctly...');
        cy.get('.player-list__item')
          .should('contain.text', Role.DON);

        cy.log('Changin role to Sheriff...');
        cy.get('.player-list__item')
          .first()
          .getCy('change-role')
          .click()
          .wait(1000)
          .getCy(Role.SHERIFF)
          .click();

        cy.log('Checking if role is reassigned correctly...');
        cy.get('.player-list__item')
          .should('contain.text', Role.SHERIFF);
      });
  });
});

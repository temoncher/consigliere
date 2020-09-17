import { PlayerControlsOptions } from '../models/player-controls-options.interface';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Pick one of player controls menu options.
       *
       * @param {PlayerControlsOptions} options - player number and action type.
       */
      playerControlsChoose(options: PlayerControlsOptions): void;
    }
  }
}

Cypress.Commands.add('playerControlsChoose', ({ playerNumber, action }: PlayerControlsOptions) => {
  let isControlsStateChanged = false;

  cy.get('.toggle-controls-button')
    .find('ion-icon')
    .then(($icon) => {
      if ($icon.attr('name') === 'chevron-down') {
        $icon.click();
        isControlsStateChanged = true;
      }
    });

  cy.getCy('player-controls')
    .find('app-small-player-card')
    .eq(playerNumber - 1)
    .find('ion-card', { includeShadowDom: true })
    .first()
    .click();

  cy.wait(500);
  cy.get('app-player-menu')
    .then(($menu) => {
      switch (action) {
        case 'assignFall':
          return $menu.find('.assign-fall-option');
        case 'kick':
          return $menu.find('.kick-option');
        case 'refresh':
          return $menu.find('.refresh-option');
        default:
          return $menu;
      }
    })
    .click();

  if (isControlsStateChanged) {
    cy.get('.toggle-controls-button')
      .find('ion-icon')
      .click();
  }
});

import { PlayerControlsOptions } from '@e2e/models/player-controls-options.interface';

import { PlayerControlsAction } from '@/table/models/player-controls-action.enum';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * ! Should be used when player controls is present on the page
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
    .click();

  cy.wait(1000);
  cy.get('app-player-menu')
    .then(($menu) => {
      switch (action) {
        case PlayerControlsAction.FALL:
          return $menu.find('.assign-fall-option');
        case PlayerControlsAction.KICK:
          return $menu.find('.kick-option');
        case PlayerControlsAction.REFRESH:
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

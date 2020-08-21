import { PlayerControlsOptions } from '../models/player-controls-options.interface';

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

  cy.get('.player-controls')
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

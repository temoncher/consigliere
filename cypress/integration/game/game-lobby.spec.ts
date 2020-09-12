import { Chance } from 'chance';

import { localhost } from '../../constants/urls';

const chance = new Chance();

describe('[Game] Lobby', () => {
  beforeEach(() => {
    cy.visit(localhost);
  });

  it('should render 4 tabs', () => {
    cy.contains('Поиск');
    cy.contains('Клубы');
    cy.contains('Стол');
    cy.contains('Профиль');
  });

  it('should render preparation phase', () => {
    cy.get('#new-game-button')
      .click();

    cy.get('.host-card')
      .should('contain', 'Ведущий');
    cy.get('#change-host-button');
    cy.get('#proceed-button');
  });

  it('should remove player', () => {
    /* Menu */
    cy.get('#new-game-button')
      .click();

    /* Lobby */
    cy.get('.player-list__item')
      .first()
      .should('contain', '1')
      .find('[name=close]')
      .click({ force: true }); // Workaround to click not visible element (scroll problem)

    cy.get('.add-new')
      .should('contain', 'Добавить нового игрока');
  });

  it('should add guest and change host', () => {
    const name = chance.first();

    /* Menu */
    cy.get('#new-game-button')
      .click();

    /* Lobby */
    cy.get('#change-host-button')
      .click();

    /* Players list modal */
    cy.wait(1000);
    cy.get('.add-new')
      .should('contain', 'Добавить гостя')
      .click();

    /* Add guest prompt */
    cy.wait(1000);
    cy.get('.alert-wrapper')
      .should('contain', 'Как обращаться к новому ведущему?');
    cy.get('#alert-input-2-0')
      .click()
      .clear()
      .type(name, { delay: 100 })
      .should('have.value', name);
    cy.get(':nth-child(2) > .alert-button-inner')
      .click(); // Accept button

    /* Lobby */
    cy.get('.host-card')
      .find('ion-label')
      .should('contain', name);
  });
});

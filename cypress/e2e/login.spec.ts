import { dataTestId } from '../../src/utils/dataTestIds';

describe('Login', () => {
  beforeEach('Given that the user is on the start page, and is not logged in', () => {
    cy.visit('/');
  });

  it('The user should be able to log in', () => {
    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).click({ force: true });

    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).contains('Test User');
  });
});

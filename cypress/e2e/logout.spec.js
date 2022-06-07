import { dataTestId } from '../../src/utils/dataTestIds';

describe('Logout', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The user should be able to log out', () => {
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).click({ force: true });

    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).should('not.exist');
  });
});

import { dataTestId } from '../../src/utils/dataTestIds';

describe('User', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.myProfileLink}]`).click();
  });

  it('The user should be able to see their user details', () => {
    cy.get('[data-testid=user-role-app-admin]').should('be.visible');
    cy.get('[data-testid=user-role-institution-admin]').should('be.visible');
    cy.get('[data-testid=user-role-curator]').should('be.visible');
    cy.get('[data-testid=user-role-creator]').should('be.visible');
  });
});

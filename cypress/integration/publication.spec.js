describe('Publication', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to go to the registration page for publication if logged in', () => {
    cy.get('[data-testid=login-button]').click({ force: true });
    cy.get('[data-testid=menu]').should('be.visible');
    cy.get('[data-testid=menu]').contains('Test User');

    cy.get('[data-testid=new-registration-button]').click({ force: true });
    cy.url().should('include', '/resources/new');
  });

  it('The user should not be able to go to the registration page for publication if not logged in', () => {
    cy.visit('/resources/new');
    cy.get('[data-testid=401]').should('be.visible');
  });
});

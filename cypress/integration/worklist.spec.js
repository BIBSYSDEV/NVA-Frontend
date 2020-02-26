describe('Worklist', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
  });

  it('The user should be able to view worklist', () => {
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.get('[data-testid=menu-my-worklist-button]').click({ force: true });
    cy.url().should('include', '/worklist');

    cy.get('[data-testid=for-approval-button]').click({ force: true });
    cy.get('[data-testid=doi-requests-button]').click({ force: true });
  });
});

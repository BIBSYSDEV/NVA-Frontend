describe('User opens their Public Profile from My Publications Page', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The User should be able to open their public profile from the page My Publications', () => {
    // Open My Publications
    cy.get('[data-testid=my-publications]').click({ force: true });

    // Open Public Profile
    cy.get('[data-testid=public-profile-button]').click({ force: true });
    cy.url().should('include', '/user');
  });
});

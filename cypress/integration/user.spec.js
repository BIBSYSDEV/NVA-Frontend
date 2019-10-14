describe('A user logs in with Feide', () => {
  it('Given that the user is logged in', () => {
    cy.visit('/');
    cy.get('[data-cy=menu]').contains('Test User');
  });
  it('When they click their user details in the navigation bar', () => {
    cy.get('[data-cy=menu]').click();
  });
  it(' And they select Profile', () => {
    cy.get('[data-cy=user-profile-button]').click();
  });
  it(' Then they see their details', () => {
    cy.get('[data-cy=user-name]').contains('Test User');
    cy.get('[data-cy=user-id]').contains('testuser@unit.no');
    cy.get('[data-cy=user-email]').contains('testuser@unit.no');
    cy.get('[data-cy=user-institution]').contains('unit');
    cy.get('[data-cy=user-role]').contains('Publisher');
  });
});

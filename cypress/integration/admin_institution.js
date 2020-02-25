describe('User opens Admin Institutions Page', () => {
  before('Given that the user is logged in as Application administrator:', () => {
    cy.visit('/');
    cy.mocklogin(); //TODO: set role app administrator
  });

  it('The User should be able to open institution-admin-page from menu', () => {
    // Open admin-inst-page
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-admin-institution-button]').click({ force: true });

    cy.contains('Institutt for osteloff');
    cy.contains('Kjetil');
    cy.contains('27.01.1780');

    // Open new-inst-page
    cy.get('[data-testid=add-institution-button]').click({ force: true });
  });
});

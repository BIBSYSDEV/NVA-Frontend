describe('User', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.get('[data-cy=menu]').contains('Test User');
  });

  it('The user should be able to see their user details', () => {
    cy.get('[data-cy=menu]').click({ force: true });
    cy.get('[data-cy=user-profile-button]').click({ force: true });

    cy.get('[data-cy=user-name]').contains('Test User');
    cy.get('[data-cy=user-id]').contains('testuser@unit.no');
    cy.get('[data-cy=user-email]').contains('testuser@unit.no');
    cy.get('[data-cy=user-institution]').contains('unit');
    cy.get('[data-cy=user-applications]').contains('NVA, BIRD');
    cy.get('[data-cy=user-role]').contains('Publisher');
  });

  it('The user should be able to connect to their ORCID account if they are successfully logged into ORCID', () => {
    cy.visit('/user');
    cy.get('[data-cy=open-orcid-modal]').click({ force: true });
    cy.get('[data-cy=connect-to-orcid]').click({ force: true });

    cy.visit('/user?code=123456');
    cy.get('[data-cy=orcid-info]').contains('https://orcid.org/0000-0001-2345-6789');
  });

  it('The user should see an error message if they are not successfully logged into ORCID', () => {
    // need to set language to english in order to check that the error message is correct
    cy.get('[data-cy=language-selector] .MuiSelect-root').click({ force: true });
    cy.get('[data-cy=user-language-en]').click({ force: true });

    cy.visit('/user?error=some_error');
    cy.get('[data-cy=snackbar]').contains('ORCID login failed');
  });
});

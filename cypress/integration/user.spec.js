describe('User', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.get('[data-testid=login-button]').click({ force: true });
    cy.get('[data-testid=menu]').contains('Test User');
  });

  it('The user should be able to see their user details', () => {
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=user-profile-button]').click({ force: true });

    // need to set language to english in order to check that the translated values are correct
    cy.get('[data-testid=language-selector] .MuiSelect-root').click({ force: true });
    cy.get('[data-testid=user-language-en-US]').click({ force: true });

    cy.get('[data-testid=user-name]').contains('Test User');
    cy.get('[data-testid=user-id]').contains('tu@unit.no');
    cy.get('[data-testid=user-email]').contains('testuser@unit.no');
    cy.get('[data-testid=user-institution]').contains('unit');
    cy.get('[data-testid=user-applications]').contains('NVA');
    cy.get('[data-testid=user-role]').contains('Publisher');
  });

  it('The user should be able to connect to their ORCID account if they are successfully logged into ORCID', () => {
    cy.get('[data-testid=open-orcid-modal]').click({ force: true });
    cy.get('[data-testid=connect-to-orcid]').click({ force: true });

    cy.get('[data-testid=orcid-info]').contains('https://sandbox.orcid.org/0000-0001-2345-6789');
  });
});

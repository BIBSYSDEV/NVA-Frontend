describe('User opens their Public Profile from My Publications Page', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The User should be able to open their public profile from the page My Publications', () => {
    // connect author
    cy.get('[data-testid=connect-author-modal]').click({ force: true });
    cy.get('[data-testid=author-radio-button]')
      .eq(1)
      .click({ force: true })
      .contains('Test User');
    cy.get('[data-testid=connect-author-button]').click({ force: true });

    // connect orcid
    cy.get('[data-testid=open-orcid-modal]').click({ force: true });
    cy.get('[data-testid=connect-to-orcid]').click({ force: true });

    // Open My Publications
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-publications-button').click({ force: true });

    // Open Public Profile
    cy.get('[data-testid=public-profile-button]').click({ force: true });
    cy.contains('testuser@unit.no');
    cy.contains('https://sandbox.orcid.org/0000-0001-2345-6789');
  });
});

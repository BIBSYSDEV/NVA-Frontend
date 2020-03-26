describe('User', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The user should be able to see their user details', () => {
    cy.get('[data-testid=user-name]').contains('Test User');
    cy.get('[data-testid=user-id]').contains('tu@unit.no');
    cy.get('[data-testid=user-email]').contains('testuser@unit.no');
    cy.get('[data-testid=user-role]').contains('Publisher');
  });
});

describe('User connects to their Authority', () => {
  beforeEach('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The user should be able to connect to an authority and an orcid on the start page when no authority is connected', () => {
    cy.get('[data-testid=logo]').click({ force: true });

    cy.wait(5000);

    // connect author
    cy.get('[data-testid=connect-author-modal]').click({ force: true });
    cy.get('[data-testid=author-radio-button]')
      .eq(1)
      .click({ force: true })
      .contains('Test User');
    cy.get('[data-testid=connect-author-button]').click({ force: true });
    cy.get('[data-testid=modal_next]').click({ force: true });

    // connect orcid
    cy.get('[data-testid=connect-to-orcid]').click({ force: true });

    // check that author is connected
    cy.get('[data-testid=author-connected-info]').should('be.visible');

    // check that ORCID is connected
    cy.get('[data-testid=orcid-info]').contains('https://sandbox.orcid.org/0000-0001-2345-6789');
  });

  it('The user should be able to connect an authority to their profile', () => {
    // connect author
    cy.get('[data-testid=connect-author-modal]').click({ force: true });
    cy.get('[data-testid=author-radio-button]')
      .eq(1)
      .click({ force: true })
      .contains('Test User');
    cy.get('[data-testid=connect-author-button]').click({ force: true });

    // check that author is connected
    cy.get('[data-testid=author-connected-info]').should('be.visible');
  });
});

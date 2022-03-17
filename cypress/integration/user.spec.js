import { dataTestId } from '../../src/utils/dataTestIds';

describe('User', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).click();
  });

  it('The user should be able to see their user details', () => {
    cy.get('[data-testid=user-name]').contains('Test User');
    cy.get('[data-testid=user-id]').contains('tu@unit.no');
    cy.get('[data-testid=user-email]').contains('testuser@unit.no');
    cy.get('[data-testid=user-role-app-admin]').should('be.visible');
    cy.get('[data-testid=user-role-institution-admin]').should('be.visible');
    cy.get('[data-testid=user-role-curator]').should('be.visible');
    cy.get('[data-testid=user-role-creator]').should('be.visible');
  });
});

describe('User connects to their Authority', () => {
  beforeEach('Given that the user is logged in:', () => {
    cy.visit('/');
  });

  it('The user should be able to connect to an authority and an orcid on the start page when no authority is connected', () => {
    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).click({ force: true });

    // connect author
    cy.get('[data-testid=connect-author-modal]').click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.contributors.authorRadioButton}]`)
      .eq(1)
      .click({ force: true })
      .contains('Test User');
    cy.get(`[data-testid=${dataTestId.registrationWizard.contributors.selectUserButton}]`).click({ force: true });
    cy.get('[data-testid=modal_next]').click({ force: true });

    // connect orcid
    cy.get('[data-testid=connect-to-orcid]').click({ force: true });

    // check that ORCID is connected
    cy.get('[data-testid=orcid-info]').contains('https://sandbox.orcid.org/0000-0001-2345-6789');
  });
});

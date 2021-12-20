import { dataTestId } from '../../src/utils/dataTestIds';

describe('My profile: Institutions', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).click();
  });

  it('The user should be able to add an institution to their profile', () => {
    // add institution
    cy.get('[data-testid=add-new-institution-button]').click({ force: true });
    cy.get(`[data-testid=${dataTestId.organization.searchField}]`).click({ force: true }).type('ntnu');
    cy.get('.MuiAutocomplete-option').contains('Norwegian University of Science and Technology').click({ force: true });
    cy.get(`[data-testid=${dataTestId.organization.subSearchField}]`).click({ force: true }).type('health');
    cy.contains('Faculty of Medicine and Health Sciences').click({ force: true });
    cy.get('[data-testid=institution-add-button]').click({ force: true });

    // check that institution is added to user profile
    cy.get('[data-testid=institution-presentation]').should('be.visible');
    cy.contains('Norwegian University of Science and Technology').should('be.visible');
    cy.contains('Faculty of Medicine and Health Sciences').should('be.visible');
  });

  it('The user should be able to remove an insitution from their profile', () => {
    cy.get(
      '[data-testid=button-delete-institution-https\\:\\/\\/api\\.cristin\\.no\\/v2\\/units\\/194\\.65\\.20\\.10]'
    ).click({
      force: true,
    });
    cy.get('[data-testid=accept-button]').click({ force: true });
    cy.contains('Allmennmedisinsk forskningsenhet i Trondheim').should('not.exist');
  });
});

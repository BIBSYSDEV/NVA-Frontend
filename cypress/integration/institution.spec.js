import { dataTestId } from '../../src/utils/dataTestIds';

describe('My profile: Institutions', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).click();
  });

  it('The user should be able to add an institution to their profile', () => {
    // add institution
    cy.get('[data-testid=add-new-institution-button]').click();
    cy.get(`[data-testid=${dataTestId.organization.searchField}]`).click().type('sikt');
    cy.get('.MuiAutocomplete-option').contains('Sikt').click();
    cy.get(`[data-testid=${dataTestId.organization.subSearchField}]`).click().type('research');
    cy.contains('The Research and Education Resources Division').click();
    cy.get('[data-testid=institution-add-button]').click();

    // check that institution is added to user profile
    cy.get('[data-testid=institution-presentation]').should('be.visible');
    cy.contains('Sikt - Norwegian Agency for Shared Services in Education and Research').should('be.visible');
    cy.contains('The Research and Education Resources Division').should('be.visible');
  });

  it('The user should be able to remove an insitution from their profile', () => {
    cy.get('[data-testid^=button-delete-institution]').eq(1).click();
    cy.get('[data-testid=accept-button]').click();
    cy.contains('Allmennmedisinsk forskningsenhet i Trondheim').should('not.exist');
  });
});

import { dataTestId } from "../../src/utils/dataTestIds";

describe('Registration: Contributors', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to open the Add Contributor modal', () => {
    cy.mocklogin();

    // navigate to Contributors
    cy.get('[data-testid=new-registration]').click({ force: true });

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });

    // click Add Contributor button
    cy.get('[data-testid=add-Creator]').click({ force: true });

    // verify that there is a search field
    cy.get(`[data-testid=${dataTestId.registrationWizard.contributors.searchField}] input`).should('be.visible');
  });
});

import { RoleName } from '../../src/types/user.types';
import { mockMessages } from '../../src/utils/testfiles/mockRegistration';
import { getRegistrationIdentifier } from "../../src/utils/registration-helpers"

describe('My messages', () => {
  beforeEach(() => {
    cy.visit('/my-profile');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.CREATOR]);
    cy.get('[data-testid=my-messages]').click({ force: true });
  });

  it('The Creator should be able to view my messages', () => {
    cy.url().should('include', '/my-messages');
  });

  it('The Creator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const identifier = getRegistrationIdentifier(mockMessages[0].publication.id);
    cy.get(`[data-testid=message-${identifier}]`).click();
    cy.get(`[data-testid=go-to-registration-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}/public`);
  });
});

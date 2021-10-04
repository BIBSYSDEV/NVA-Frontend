import { RoleName } from '../../src/types/user.types';
import { mockMessages } from '../../src/utils/testfiles/mockRegistration';
import { dataTestId } from '../../src/utils/dataTestIds';
import { getRegistrationIdentifier } from "../../src/utils/registration-helpers"

describe('Worklist', () => {
  beforeEach(() => {
    cy.visit('/my-profile');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.CURATOR]);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.worklistLink}]`).click({ force: true });
  });

  it('The Curator should be able to view worklist', () => {
    cy.url().should('include', '/worklist');
  });

  it('The Curator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const identifier = getRegistrationIdentifier(mockMessages[0].publication.id);
    cy.get(`[data-testid=message-${identifier}]`).click();
    cy.get(`[data-testid=go-to-registration-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}/public`);
  });
});

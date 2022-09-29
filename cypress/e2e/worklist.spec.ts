import { RoleName } from '../../src/types/user.types';
import { mockTicketCollection } from '../../src/utils/testfiles/mockRegistration';
import { dataTestId } from '../../src/utils/dataTestIds';
import { getRegistrationIdentifier } from '../../src/utils/registration-helpers';

describe('Worklist', () => {
  before(() => {
    cy.visit('/my-profile');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.Curator]);
    cy.get(`[data-testid=${dataTestId.header.worklistLink}]`).click();
  });

  it('The Curator should be able to view worklist', () => {
    cy.url().should('include', '/worklist');
  });

  it('The Curator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const { id } = mockTicketCollection.tickets[0].publication;
    const identifier = getRegistrationIdentifier(id);
    cy.get(`[data-testid=message-${identifier}]`).click();
    cy.get(`[data-testid=go-to-registration-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}/public`);
  });
});

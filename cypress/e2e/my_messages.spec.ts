import { RoleName } from '../../src/types/user.types';
import { mockMessages } from '../../src/utils/testfiles/mockRegistration';
import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';
import { getRegistrationIdentifier } from '../../src/utils/registration-helpers';

describe('My messages', () => {
  beforeEach(() => {
    cy.visit('/my-profile');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.Creator]);

    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.messagesLink}]`).click();
  });

  it('The Creator should be able to view my messages', () => {
    cy.url().should('include', UrlPathTemplate.MyPageMessages);
  });

  it('The Creator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const { id } = mockMessages[0].publication;
    const identifier = getRegistrationIdentifier(id);

    cy.get(`[data-testid=message-${identifier}]`).click();
    cy.get(`[data-testid=go-to-registration-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}/public`);
  });
});

import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

const allRoles = Object.values(RoleName);

// The logged-in header is on every authenticated screen, so a defect here is
// multiplied across the app. The mock login lives only in Redux and does not
// survive a reload, so everything here happens on one page load.
describe('Accessibility: authenticated chrome', { retries: 0 }, () => {
  beforeEach('Given that the user is logged in with every role', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('be.visible');
    cy.setUserRolesInRedux(allRoles);
  });

  it('The logged-in header should have no new accessibility violations', () => {
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).should('be.visible');
    cy.checkA11yWithBaseline('header-logged-in');
  });

  it('The opened user menu should have no new accessibility violations', () => {
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
    cy.checkA11yWithBaseline('header-menu-open');
  });
});

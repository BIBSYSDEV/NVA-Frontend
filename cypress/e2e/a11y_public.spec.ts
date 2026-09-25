import { UrlPathTemplate } from '../../src/utils/urlPaths';
import { authenticatedA11yRoutes, isA11yTemplateExcused, publicA11yRoutes } from '../support/a11y-routes';

// axe results are deterministic given a stable DOM, so the global retries.runMode
// would only mask a load race while multiplying CI time on the specs most likely
// to fail. The readyTestId assertion handles the race instead.
describe('Accessibility: public pages', { retries: 0 }, () => {
  it('Every route is either swept for accessibility or explicitly excused', () => {
    const sweptTemplates = [...publicA11yRoutes, ...authenticatedA11yRoutes].map((route) => route.template);
    const unaccountedTemplates = Object.values(UrlPathTemplate).filter(
      (template) => !sweptTemplates.includes(template) && !isA11yTemplateExcused(template)
    );

    expect(
      unaccountedTemplates,
      'New routes must be added to publicA11yRoutes/authenticatedA11yRoutes, or to notYetSweptA11yTemplates in cypress/support/a11y-routes.ts'
    ).to.deep.equal([]);
  });

  publicA11yRoutes.forEach((route) => {
    it(`The ${route.snapshot} page should have no new accessibility violations`, () => {
      cy.visit(route.path);
      cy.get(route.readySelector).should('be.visible');
      cy.checkA11yWithBaseline(route.snapshot);
    });
  });

  it('The not-found page should have no new accessibility violations', () => {
    cy.visit('/this-route-does-not-exist', { failOnStatusCode: false });
    cy.get('[data-testid="404"]').should('be.visible');
    cy.checkA11yWithBaseline('not-found');
  });
});

import { mockProject } from '../../src/utils/testfiles/mockProjects';

describe('Registration: Description', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to add and remove projects', () => {
    cy.mocklogin();

    cy.get('[data-testid=new-registration]').click({ force: true });

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=project-search-input]').click({ force: true }).type(mockProject.title.substring(0, 5));
    cy.get(`[data-testid="project-option-${mockProject.id}"]`).click({ force: true });
    cy.get(`[data-testid="project-chip-${mockProject.id}"]`).should('exist');

    cy.get(`[data-testid="project-chip-${mockProject.id}"]`).children().eq(1).click({ force: true });
    cy.get(`[data-testid="project-chip-${mockProject.id}"]`).should('not.exist');
  });
});

import { mockProjectSearch } from '../../src/utils/testfiles/mockProjects';
import { dataTestId } from '../../src/utils/dataTestIds';

describe('Registration: Description', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to add and remove projects', () => {
    cy.mocklogin();

    cy.get('[data-testid=new-registration]').click();

    cy.startRegistrationWithDoi();

    const projectToAdd = mockProjectSearch.hits[1];
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.projectSearchField}] input`)
      .click()
      .type(projectToAdd.title.substring(0, 4));
    cy.get(`[data-testid="project-option-${projectToAdd.id}"]`).click();
    cy.get(`[data-testid="project-chip-${projectToAdd.id}"]`).should('exist');

    cy.get(`[data-testid="project-chip-${projectToAdd.id}"]`).children().eq(1).click();
    cy.get(`[data-testid="project-chip-${projectToAdd.id}"]`).should('not.exist');
  });
});

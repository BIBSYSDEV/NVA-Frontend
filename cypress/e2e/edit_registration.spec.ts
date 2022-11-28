import { JournalType } from '../../src/types/publicationFieldNames';
import { dataTestId } from '../../src/utils/dataTestIds';

describe('User opens an item in the My Registrations list', () => {
  beforeEach('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();

    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsLink}]`).click();
  });

  it('The User should be able to edit an item in the My Registrations list', () => {
    // Edit registration
    // Description tab
    cy.get('[data-testid=edit-registration-12345678]').click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.titleField}] input`).should(
      'have.value',
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );

    // Resource Type tab
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(JournalType.Article)}]`).should(
      'be.visible'
    );

    // Contributors tab
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.contains('Test User');

    // Files and licenses tab
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
  });
});

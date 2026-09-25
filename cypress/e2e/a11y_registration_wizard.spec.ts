import { dataTestId } from '../../src/utils/dataTestIds';

const wizardTabs = [
  {
    snapshot: 'registration-wizard-description',
    stepButton: dataTestId.registrationWizard.stepper.descriptionStepButton,
  },
  {
    snapshot: 'registration-wizard-resource-type',
    stepButton: dataTestId.registrationWizard.stepper.resourceStepButton,
  },
  {
    snapshot: 'registration-wizard-contributors',
    stepButton: dataTestId.registrationWizard.stepper.contributorsStepButton,
  },
  { snapshot: 'registration-wizard-files', stepButton: dataTestId.registrationWizard.stepper.filesStepButton },
];

// The wizard cannot be reached by URL: the mock login lives only in Redux, so a
// cy.visit would drop it and redirect. It has to be navigated to through the UI,
// the same way registration_validation.spec.ts does.
describe('Accessibility: registration wizard', { retries: 0 }, () => {
  beforeEach('Given that the user is logged in and editing a registration', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.registrationsAccordion}]`).click();
    cy.get('[data-testid=edit-registration-4327439]').click({ force: true });
  });

  wizardTabs.forEach((tab) => {
    it(`The ${tab.snapshot} tab should have no new accessibility violations`, () => {
      cy.get(`[data-testid=${tab.stepButton}]`).click({ force: true });
      // Confirms the step actually became active before scanning, rather than
      // scanning whichever tab happened to still be rendered.
      cy.get(`[data-testid=${tab.stepButton}] .Mui-active`).should('exist');
      cy.checkA11yWithBaseline(tab.snapshot);
    });
  });

  // This registration is deliberately incomplete, so the tabs render Yup
  // validation errors — a state a plain route sweep never reaches.
  it('The wizard should have no new accessibility violations while showing validation errors', () => {
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.descriptionStepButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.titleField}] p.Mui-error`).should('be.visible');
    cy.checkA11yWithBaseline('registration-wizard-validation-errors');
  });
});

import { dataTestId } from '../../src/utils/dataTestIds';

describe('Registration', () => {
  beforeEach(() => {
    cy.visit('/registration');
  });

  it('The user should be able to start registration with a DOI link', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });
    cy.url().should('include', '/registration');

    cy.get(`[data-testid=${dataTestId.registrationWizard.new.linkAccordion}]`).click();
    cy.get('[data-testid=new-registration-link-field] input').type('https://doi.org/10.1098/rspb.2018.0085');
    cy.get('[data-testid=doi-search-button]').click({ force: true });
    cy.contains(
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );

    cy.get(`[data-testid=${dataTestId.registrationWizard.new.startRegistrationButton}]`).filter(':visible').click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.datePublishedField}]`).should('be.visible');
    cy.get('[data-testid=error-tab]').should('have.length', 0);
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.titleField}] input`).should(
      'have.value',
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );
  });

  it('The user should be able to start registration by uploading a file', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });
    cy.url().should('include', '/registration');

    cy.get(`[data-testid=${dataTestId.registrationWizard.new.fileAccordion}]`).click();

    cy.mockFileUpload();

    cy.fixture('img.jpg').as('file');
    cy.get('input[type=file]').first().selectFile('@file', { force: true });
    cy.get('[data-testid=uploaded-file]').should('be.visible');

    cy.get(`[data-testid=${dataTestId.registrationWizard.new.startRegistrationButton}]`).filter(':visible').click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.datePublishedField}]`).should('be.visible');
    cy.get('[data-testid=error-tab]').should('have.length', 0);
  });

  it('The user should be able to start empty registration', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });
    cy.url().should('include', '/registration');

    cy.get(`[data-testid=${dataTestId.registrationWizard.new.emptyRegistrationAccordion}]`).click();

    cy.get(`[data-testid=${dataTestId.registrationWizard.new.startRegistrationButton}]`).filter(':visible').click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.datePublishedField}]`).should('be.visible');
    cy.get('[data-testid=error-tab]').should('have.length', 0);
  });

  it('The user should not be able to go to the registration page for registration if not logged in', () => {
    cy.get('[data-testid=forbidden]').should('be.visible');
  });
});

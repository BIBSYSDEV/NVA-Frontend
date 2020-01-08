describe('Publication: References', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to navigate to References if a publication is started', () => {
    loginAndSetLanguage();

    // need to set language to english in order to check that the translated values are correct
    cy.get('[data-testid=language-selector] .MuiSelect-root').click({ force: true });
    cy.get('[data-testid=user-language-en-US]').click({ force: true });

    // ignore the modal in this test
    window.localStorage.setItem('showAuthorityModal', 'false');
    window.localStorage.setItem('showOrcidModal', 'false');

    // navigate to References (update this when functionality for starting a registration is done)
    cy.get('[data-testid=new-publication-button]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });

    cy.get('[data-testid=reference_type]')
      .click({ force: true })
      .type(' '); //makes the select options open
    cy.get('[data-testid=reference_type-book]').should('be.visible');
    cy.get('[data-testid=reference_type-book]').click({ force: true });
    cy.get('[data-testid=reference_type-heading]').contains('Book');
  });
});

const loginAndSetLanguage = () => {
  // log in
  cy.get('[data-testid=login-button]').click({ force: true });
  cy.get('[data-testid=menu]').should('be.visible');
  cy.get('[data-testid=menu]').contains('Test User');

  // set language
  cy.get('[data-testid=menu]').click({ force: true });
  cy.get('[data-testid=user-profile-button]').click({ force: true });
};

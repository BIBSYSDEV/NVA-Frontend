describe('Publication: Submission', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to navigate to submission tab', () => {
    cy.mocklogin();

    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-new-publication-button]').click({ force: true });

    cy.startPublicationWithDoi();

    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });
    cy.contains(
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );
  });
});

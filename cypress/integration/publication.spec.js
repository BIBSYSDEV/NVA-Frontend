describe('Publication', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/publications');
  });

  it('The user should be able to start registration with a DOI link', () => {
    cy.get('[data-testid=menu-login-button]').click({ force: true });

    cy.get('[data-testid=new-publication-button]').click({ force: true });
    cy.url().should('include', '/publication');

    cy.get('[data-testid=new-publication-link]').click({ force: true });
    cy.get('[data-testid=new-publication-link-input]').type('https://doi.org/10.1098/rspb.2018.0085');
    cy.get('[data-testid=doi-search-button]').click({ force: true });
    cy.contains(
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );

    cy.get('[data-testid=publication-link-next-button]').click({ force: true });
    cy.get('[data-testid=publication-title-input]').should(
      'have.value',
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );
  });

  it('The user should not be able to go to the registration page for publication if not logged in', () => {
    cy.get('[data-testid=404]').should('be.visible');
  });
});

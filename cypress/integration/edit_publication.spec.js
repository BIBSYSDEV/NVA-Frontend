describe('User opens an item in the My Publication list', () => {
  beforeEach('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The User should be able to edit an item in the My Publications list', () => {
    // Open My Publications
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-publications-button]').click({ force: true });

    // Edit publication
    // Description tab
    cy.get('[data-testid=edit-publication-12345678]').click({ force: true });
    cy.get('[data-testid=publication-title-input]').should(
      'have.value',
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );

    // Reference tab
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.contains('Publication in Journal');

    // Contributors tab
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.contains('Test User');

    // Files and licenses tab
    // TODO: Commented out until publisher is added to new data model
    // cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
    // cy.contains('Osteloff book publisher');

    // Submission tab
    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });
    cy.contains(
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );
  });
});

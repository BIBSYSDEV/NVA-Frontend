describe('User opens an item in the My Registrations list', () => {
  beforeEach('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The User should be able to edit an item in the My Registrations list', () => {
    // Open My Registrations
    cy.get('[data-testid=my-registrations]').click({ force: true });

    // Edit registration
    // Description tab
    cy.get('[data-testid=edit-registration-12345678]').click({ force: true });
    cy.get('[data-testid=registration-title-field] input').should(
      'have.value',
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );

    // Resource Type tab
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.contains('Contribution to journal');

    // Contributors tab
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.contains('Test User');

    // Files and licenses tab
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
  });
});

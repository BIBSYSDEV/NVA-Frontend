describe('User opens an item in the My Publication list', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The User should be able to edit an item in the My Publications list', () => {
    // connect author
    cy.get('[data-testid=connect-author-modal]').click({ force: true });
    cy.get('[data-testid=author-radio-button]').eq(1).click({ force: true }).contains('Test User');
    cy.get('[data-testid=connect-author-button]').click({ force: true });

    // connect orcid
    cy.get('[data-testid=open-orcid-modal]').click({ force: true });
    cy.get('[data-testid=connect-to-orcid]').click({ force: true });

    // Open My Publications
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-publications-button]').click({ force: true });

    // Edit publication
    // Description tab
    cy.get('[data-testid=edit-publication-12345678]').click({ force: true });
    cy.contains('Description');

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
    cy.contains('Optimalisert osteloffproduksjon i 2019');
  });
});

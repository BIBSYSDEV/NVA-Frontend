describe.skip('Registration: Resource type: Chapter', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to fill out the form for chapter type', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });

    // choose Report type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' '); //makes the select options open
    cy.get('[data-testid=publication-instance-type-Chapter]').should('be.visible');
    cy.get('[data-testid=publication-instance-type-Chapter]').click({ force: true });

    cy.get('[data-testid=publication-instance-type-heading]').contains('Chapter');

    // fill out number of page-number fields
    cy.get('[data-testid=chapter-pages-from]').type('1');
    cy.get('[data-testid=chapter-pages-to]').type('42');

    cy.get('[data-testid=nvi-chapter]').should('be.visible');
  });
});

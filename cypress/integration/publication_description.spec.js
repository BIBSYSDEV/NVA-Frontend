describe('Publication: Description', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to add and remove projects', () => {
    cy.mocklogin();

    cy.get('[data-testid=new-publication]').click({ force: true });

    cy.startPublicationWithDoi();

    cy.get('[data-testid=project-search-input]').click({ force: true }).type('phd');

    const projectName = 'PhD prosjekt: Selvbestemmelse uten ord';
    cy.contains(projectName).click({ force: true });
    cy.get('[data-testid=project-chip]').contains(projectName);

    cy.get('[data-testid=project-chip]').children().eq(1).click({ force: true });

    cy.get('[data-testid=project-chip]').should('not.exist');
  });
});

describe('My profile: Institutions', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The user should be able to add an institution to their profile', () => {
    // connect author
    cy.get('[data-testid=connect-author-modal]').click({ force: true });
    cy.get('[data-testid=author-radio-button]')
      .eq(1)
      .click({ force: true })
      .contains('Test User');
    cy.get('[data-testid=connect-author-button]').click({ force: true });

    // add institution
    cy.get('[data-testid=add-new-institution-button]').click({ force: true });
    cy.get('[data-testid=autosearch-institution]')
      .click({ force: true })
      .type('ntnu');
    cy.get('.MuiAutocomplete-option')
      .contains('Norges teknisk-naturvitenskapelige universitet')
      .click({ force: true });
    cy.get('[data-testid=unit-selector-0]')
      .click({ force: true })
      .type(' ');
    cy.contains('Fakultet for medisin og helsevitenskap').click({ force: true });
    cy.get('[data-testid=unit-selector-1]')
      .click({ force: true })
      .type(' ');
    cy.contains('Institutt for samfunnsmedisin og sykepleie').click({ force: true });

    cy.get('[data-testid=institution-add-button]').click({ force: true });

    // check that institution is added to user profile
    cy.get('[data-testid=institution-presentation]').should('be.visible');
    cy.contains('Norges teknisk-naturvitenskapelige universitet').should('be.visible');
    cy.contains('Fakultet for medisin og helsevitenskap').should('be.visible');
    cy.contains('Institutt for samfunnsmedisin og sykepleie').should('be.visible');
  });

  it('The user should be able to remove an insitution from their profile', () => {
    cy.get('[data-testid=button-delete-institution-194\\.65\\.20\\.10]').click({ force: true });

    cy.get('Fakultet for medisin og helsevitenskap').should('not.exist');
  });
});

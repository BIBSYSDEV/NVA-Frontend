describe('My profile: Institutions', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The user should be able to add an institution to their profile', () => {
    // add institution
    cy.get('[data-testid=add-new-institution-button]').click({ force: true });
    cy.get('[data-testid=autocomplete-institution]').click({ force: true }).type('norwegian univ');
    cy.get('.MuiAutocomplete-option').contains('Norwegian University of Science and Technology').click({ force: true });
    cy.get('[data-testid=unit-selector]').eq(0).click({ force: true }).type('health');
    cy.contains('Faculty of Medicine and Health Sciences').click({ force: true });
    cy.get('[data-testid=unit-selector]').eq(1).click({ force: true }).type('health');
    cy.contains('Department of Public Health and Nursing').click({ force: true });
    cy.get('[data-testid=unit-selector]').eq(2).click({ force: true }).type(' ');
    cy.contains('Allmennmedisinsk forskningsenhet i Trondheim').click({ force: true });

    cy.get('[data-testid=institution-add-button]').click({ force: true });

    // check that institution is added to user profile
    cy.get('[data-testid=institution-presentation]').should('be.visible');
    cy.contains('Norwegian University of Science and Technology').should('be.visible');
    cy.contains('Faculty of Medicine and Health Sciences').should('be.visible');
    cy.contains('Department of Public Health and Nursing').should('be.visible');
    cy.contains('Allmennmedisinsk forskningsenhet i Trondheim').should('be.visible');
  });

  it('The user should be able to remove an insitution from their profile', () => {
    cy.get('[data-testid=button-delete-institution-194\\.65\\.20\\.10]').click({ force: true });

    cy.get('Fakultet for medisin og helsevitenskap').should('not.exist');
  });
});

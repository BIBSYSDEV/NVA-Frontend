describe('A user logs in and views their user details', () => {
  it('Given that the user is logged in', () => {
    cy.visit('/');
    cy.get('[data-cy=menu]').contains('Test User');
  });
  it('When they click their user details in the navigation bar', () => {
    cy.get('[data-cy=menu]').click({ force: true });
  });
  it('And they select Profile', () => {
    cy.get('[data-cy=user-profile-button]').click({ force: true });
  });
  it('Then they see their details', () => {
    cy.get('[data-cy=user-name]').contains('Test User');
    cy.get('[data-cy=user-id]').contains('testuser@unit.no');
    cy.get('[data-cy=user-email]').contains('testuser@unit.no');
    cy.get('[data-cy=user-institution]').contains('unit');
    cy.get('[data-cy=user-applications]').contains('NVA, DLR');
    cy.get('[data-cy=user-role]').contains('Publisher');
  });
});

describe('A user connects her ORCID to her account', () => {
  it('Given that the user is logged in and navigated to the user page', () => {
    cy.visit('/user');
  });
  it('When they click the connect to ORCID button to open the modal', () => {
    cy.get('[data-cy=open-orcid-modal]').click({ force: true });
  });
  it('And they click the connect to ORCID button', () => {
    cy.get('[data-cy=connect-to-orcid]').click({ force: true });
  });
  it('And they are redirected to ORCID', () => {
    // mocked during testing
  });

  it('And the ORCID connection is successful', () => {
    cy.visit('/user?code=123456');
  });
  it('Then they see their ORCID in the user page', () => {
    cy.get('[data-cy=orcid-info]').contains('https://orcid.org/0000-0001-2345-6789');
  });
  it('When the ORCID connection is unsuccessful', () => {
    // need to set language to english in order to check that the error message is correct
    cy.get('[data-cy=language-selector] .MuiSelect-root').click({ force: true });
    cy.get('[data-cy=user-language-en]').click({ force: true });

    cy.visit('/user?error=some_error');
  });
  it('Then they should get an errormessage', () => {
    cy.get('[data-cy=snackbar]').contains('ORCID login failed');
  });
});

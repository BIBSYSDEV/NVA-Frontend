import { setUser } from '../../src/redux/actions/userActions';
import { mockUser } from '../../src/utils/testfiles/mock_feide_user';

// Weird array format for affiliation is due to current format delivered by FEIDE
const userWithAffiliations = { ...mockUser, 'custom:affiliation': '[member, employee, staff]' };
const userWithoutAffiliations = { ...mockUser, 'custom:affiliation': '[]' };

describe('Menu', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.get('[data-testid=menu]').click({ force: true });
  });

  it('User with affiliations should see menu options', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.dispatch(setUser(userWithAffiliations));
      });

    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=menu-my-publications-button]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('be.visible');
    cy.get('[data-testid=menu-my-worklist-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
    cy.get('[data-testid=new-publication-button]').should('be.visible');
  });

  it('User without affiliations should not see menu options', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.dispatch(setUser(userWithoutAffiliations));
      });

    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
    cy.get('[data-testid=menu-my-publications-button]').should('not.be.visible');
    cy.get('[data-testid=menu-my-worklist-button]').should('not.be.visible');
    cy.get('[data-testid=new-publication-button]').should('not.be.visible');
  });

  it('User without affiliations should get 404-message when visiting protected URLs', () => {
    cy.window()
      .its('store')
      .then(store => {
        store.dispatch(setUser(userWithoutAffiliations));
      });

    cy.visit('/publication');
    cy.contains('404');

    cy.visit('/my-publications');
    cy.contains('404');

    cy.visit('/admin-institutions');
    cy.contains('404');

    cy.visit('/worklist');
    cy.contains('404');
  });
});

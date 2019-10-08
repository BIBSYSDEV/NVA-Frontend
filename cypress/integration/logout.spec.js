describe('A user logs out from NVA application', () =>{
    it('Given that the user is logged in', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Test User');
    });
    it('When they click on the log-out button', () => {
        cy.contains('Logout').click();
    });
    it('Then they are logged out of the NVA application', () => {
        cy.contains('login');
        cy.contains('Test User').should('not.exist');
    });
});


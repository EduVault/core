/// <reference types="Cypress" />

describe('Index Page', () => {
  // it('should be able to ping server', async () => {
  //   const response = await cy.request('/api/ping');
  //   expect(response).to.have.property('status', 200);
  //   expect(response.body).to.have.property('content', 'pong');
  // });
  it('should contain a login element', () => {
    cy.visit('/login');

    cy.contains('Login with EduVault');
    cy.get('#eduvault-button').click();

    cy.get('button:contains("Continue with Password")').should('be.disabled');
    const emailInput = cy.get('input[type=email]').should('exist');
    emailInput.type('123@123.123');
    const passwordInput = cy.get('input[type=password]').should('exist');
    passwordInput.type('123@123.123');
    cy.get('button:contains("Continue with Password")')
      .should('not.be.disabled')
      .click();
  });
});

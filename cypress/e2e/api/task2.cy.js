/// <reference types="cypress" />
import homePage from '../../page-objects/pages/HomePage';
import signInForm from '../../page-objects/forms/SignInForm';
import garagePage from '../../page-objects/pages/GaragePage';

const email = Cypress.env("USER_EMAIL");
const password = Cypress.env("USER_PASSWORD");

describe('Profile page - Intercept username', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/users/profile', (req) => {
      req.reply((res) => {
        res.body.data.name = 'Polar';
        res.body.data.lastName = 'Bear';
      });
    }).as('getUserProfile');
    
    homePage.open();
    homePage.clickSignInButton();
    signInForm.login(email, password);
    garagePage.verifyUrl();
  });

  it('should display "Polar Bear" as user name in the profile', () => {
    garagePage.clickProfileButton();
    cy.url().should('include', '/panel/profile');
    cy.wait('@getUserProfile');
    cy.get('.profile_name.display-4').should('contain', 'Polar Bear');
  });
});

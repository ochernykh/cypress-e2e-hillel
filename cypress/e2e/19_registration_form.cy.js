import {
  errorColor,
  getInput,
  generateUniqueEmail,
  validateErrorAppearance,
  openRegistrationForm,
  fillOrBlur,
} from "../support/registrationUtils";

import { testCases } from "../support/registrationValidationCases";

describe("Registration form validation", () => {
  beforeEach(() => {
    openRegistrationForm();
  });

  Object.entries(testCases).forEach(([fieldId, cases]) => {
    describe(`${fieldId} field`, () => {
      cases.forEach(({ value, error }) => {
        it(`should show "${error}" for input: "${value}"`, () => {
          const field = getInput(fieldId).clear();
          fillOrBlur(field, value);
          validateErrorAppearance(error, getInput(fieldId));
        });
      });
    });
  });

  describe("Repeat password mismatch", () => {
    it("should show error for mismatched repeat password", () => {
      getInput("signupPassword").type("Test1234");
      getInput("signupRepeatPassword").type("Mismatch123").blur();
      validateErrorAppearance(
        "Passwords do not match",
        getInput("signupRepeatPassword")
      );
    });
  });

  describe("Register button state", () => {
    it("should be disabled if not all required fields are filled", () => {
      getInput("signupName").type("John");
      getInput("signupLastName").type("Doe");
      cy.contains("button", "Register").should("be.disabled");
    });
  });

  describe("Successful registration", () => {
    it("registers with valid inputs", () => {
      const email = generateUniqueEmail();

      getInput("signupName").type("John");
      getInput("signupLastName").type("Doe");
      getInput("signupEmail").type(email);
      getInput("signupPassword").type("Test1234");
      getInput("signupRepeatPassword").type("Test1234");

      cy.contains("button", "Register").should("not.be.disabled").click();
      cy.url().should("include", "/panel/garage");
    });
  });
});

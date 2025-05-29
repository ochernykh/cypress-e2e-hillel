export const errorColor = "rgb(220, 53, 69)";

export const getInput = (id) => cy.get(`input#${id}`);

export const generateUniqueEmail = () => `user+${Date.now()}@example.com`;

export const validateErrorAppearance = (errorText, field) => {
  cy.contains(errorText)
    .should("be.visible")
    .and("have.css", "color", errorColor);
  field.should("have.css", "border-color", errorColor);
};

export const openRegistrationForm = () => {
  cy.visit("https://qauto.forstudy.space", {
    auth: { username: "guest", password: "welcome2qauto" },
  });
  cy.contains("button", "Sign up").click();
};

export const fillOrBlur = (field, value) => {
  if (value) {
    field.type(value).blur();
  } else {
    field.focus().blur();
  }
};

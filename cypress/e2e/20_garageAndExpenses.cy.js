import homePage from "../page-objects/pages/HomePage";
import signInForm from "../page-objects/forms/SignInForm";
import garagePage from "../page-objects/pages/GaragePage";
import fuelExpensesPage from "../page-objects/pages/FuelExpensesPage";
import carDeletionForm from "../page-objects/forms/CarDeletionForm";
import addCarModal from "../page-objects/forms/AddCarForm";
import { generateCarData } from "../utils/carDataGenerator";

const email = Cypress.env("USER_EMAIL");
const password = Cypress.env("USER_PASSWORD");

describe("Garage module", function () {
  let car, expense;

  before(function () {
    return cy.fixture("carBrands.json").then((brands) => {
      return cy.fixture("carModels.json").then((models) => {
        car = generateCarData(brands.data, models.data);
        const today = new Date();
        const formattedDate = today
          .toLocaleDateString("uk-UA")
          .replace(/\//g, ".");
        expense = {
          vehicle: `${car.brand} ${car.model}`,
          date: formattedDate,
          mileage: (parseInt(car.mileage) + 500).toString(),
          liters: "50",
          totalCost: "100000",
        };
      });
    });
  });

  beforeEach(function () {
    homePage.open();
    homePage.clickSignInButton();
    signInForm.login(email, password);
    garagePage.verifyUrl();
    garagePage.deleteAllCars();
  });

  describe("Main flow", function () {
    it("should add a new car", function () {
      garagePage.addCar(car);
      garagePage.verifyCarAdded(car);
    });

    it("should add a fuel expense and verify it is added", function () {
      fuelExpensesPage.open();
      fuelExpensesPage.addFuelExpense(expense);
      fuelExpensesPage.verifyExpenseAdded(expense);
    });

    it("should delete the car and verify it is removed", function () {
      garagePage.open();
      carDeletionForm.deleteCar();
      carDeletionForm.verifyCarDeleted();
    });
  });

  describe("Validation", function () {
    it("should not allow to add a car with negative mileage", () => {
      addCarModal.open();
      addCarModal.fillCarForm({
        brand: car.brand,
        model: car.model,
        mileage: "-123",
      });
      addCarModal.mileageInput.blur();

      addCarModal.mileageInput
        .should("have.class", "is-invalid")
        .and("have.class", "ng-invalid");

      cy.get(".invalid-feedback")
        .invoke("text")
        .then((txt) => {
          cy.log("Validation error:", txt.trim());
        });

      addCarModal.assertAddButtonDisabled();
    });

    it("should not allow to add a car without mileage", function () {
      addCarModal.open();
      addCarModal.fillCarForm({ brand: car.brand, model: car.model });
      addCarModal.clearMileageAndBlur();
      addCarModal.assertAddButtonDisabled();
      addCarModal.assertMileageErrorVisible();
    });

    it("should not allow to add a car with a very large mileage (edge case > 999999)", () => {
      addCarModal.open();
      addCarModal.fillCarForm({
        brand: car.brand,
        model: car.model,
        mileage: "1000000",
      });
      addCarModal.mileageInput.blur();
      addCarModal.mileageInput.should("have.class", "ng-invalid");
      addCarModal.mileageInput.invoke("attr", "class").then((classes) => {
        cy.log("Classes:", classes);
      });
      cy.get(".invalid-feedback")
        .invoke("text")
        .then((txt) => {
          cy.log("Validation error:", txt.trim());
        });

      addCarModal.assertAddButtonDisabled();
    });
  });
});

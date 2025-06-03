import BasePage from "./BasePage";

class GaragePage extends BasePage {
  get addCarButton() {
    return cy.get('button:contains("Add car")');
  }

  get carBrandSelect() {
    return cy.get("#addCarBrand");
  }

  get carModelSelect() {
    return cy.get("#addCarModel");
  }

  get carMileageInput() {
    return cy.get("#addCarMileage");
  }

  get saveCarButton() {
    return cy.contains(".modal-footer .btn-primary", "Add");
  }

  get profileButton() {
    return cy.get('a[routerlink = "profile"]');
  }

  deleteAllCars() {
    cy.get("body").then(($body) => {
      if ($body.find(".car_edit").length === 0) return;

      function deleteFirstCar() {
        cy.get(".car_edit").first().click();
        cy.get(".modal-content")
          .last()
          .within(() => {
            cy.contains("button", "Remove car").should("be.visible").click();
          });
        cy.get(".modal-content")
          .last()
          .within(() => {
            cy.contains("button", "Remove").should("be.visible").click();
          });
        cy.get("body").then(($b) => {
          if ($b.find(".car_edit").length) {
            deleteFirstCar();
          }
        });
      }
      deleteFirstCar();
    });
  }

  addCar(car) {
    this.addCarButton.should("be.visible").click();
    this.carBrandSelect.should("be.visible").select(car.brand);
    this.carModelSelect.should("be.visible").select(car.model);
    this.carMileageInput.should("be.visible").type(car.mileage);
    this.saveCarButton.should("be.visible").click();
  }

  verifyCarAdded(car) {
    cy.contains(".car_name.h2", car.model).should("be.visible");
    cy.contains(".car_base", car.brand).should("be.visible");
    cy.get(".icon.icon-edit").first().should("be.visible").click();
    cy.get("#addCarBrand").should("be.visible");
    cy.get("#addCarModel").should("be.visible");
    cy.get('span[aria-hidden="true"]').click();
  }

  verifyUrl() {
    cy.url().should("include", "/panel/garage");
  }

  clickProfileButton() {
    this.profileButton.click();
  }

  open() {
    super.open("/panel/garage");
  }
}

export default new GaragePage();

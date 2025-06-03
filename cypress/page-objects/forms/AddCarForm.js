class AddCarForm {
  get modal() {
    return cy.get(".modal-content");
  }

  get brandSelect() {
    return cy.get("#addCarBrand");
  }

  get modelSelect() {
    return cy.get("#addCarModel");
  }

  get mileageInput() {
    return cy.get("#addCarMileage");
  }

  clearMileageAndBlur() {
    this.mileageInput.clear().blur();
  }

  get addButton() {
    return cy.get(".modal-footer .btn-primary").contains("Add");
  }

  get cancelButton() {
    return cy.get(".modal-footer .btn-secondary");
  }

  get mileageValidationError() {
    return cy.get(".invalid-feedback").contains("Mileage cost required");
  }

  open() {
    cy.get("button").contains("Add car").click();
  }

  fillCarForm({ brand, model, mileage }) {
    if (brand) this.brandSelect.select(brand);
    if (model) this.modelSelect.select(model);
    if (mileage !== undefined) this.mileageInput.clear().type(mileage);
  }

  submit() {
    this.addButton.should("not.be.disabled").click();
  }

  cancel() {
    this.cancelButton.click();
  }

  clearMileage() {
    this.mileageInput.clear();
  }

  assertAddButtonDisabled() {
    this.addButton.should("be.disabled");
  }

  assertMileageErrorVisible() {
    this.mileageInput.should("have.class", "is-invalid");
    this.mileageValidationError.should("be.visible");
  }
}

export default new AddCarForm();

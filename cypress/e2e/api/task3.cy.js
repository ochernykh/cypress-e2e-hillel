/// <reference types="cypress" />
import carBrands from "../../fixtures/carBrands.json";
import carModels from "../../fixtures/carModels.json";

const email = Cypress.env("USER_EMAIL");
const password = Cypress.env("USER_PASSWORD");

describe("API Tests Using cypress-plugin-api", () => {
  let sidValue;
  let carId;

  before(() => {
    cy.api({
      method: "POST",
      url: "/api/auth/signin",
      body: { email, password, remember: true },
    }).then((response) => {
      expect(response.status).to.eq(200);
      const sidCookie = response.headers["set-cookie"].find((str) =>
        str.startsWith("sid=")
      );
      sidValue = sidCookie.split(";")[0].split("=")[1];
      cy.setCookie("sid", sidValue);
    });
  });

  it("should add a new car", () => {
    cy.api({
      method: "POST",
      url: "/api/cars",
      body: {
        carBrandId: carBrands.data[0].id,
        carModelId: carModels.data[3].id,
        mileage: 1111,
      },
      headers: {
        Cookie: `sid=${sidValue}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      const carData = response.body.data;
      expect(carData.brand).to.eq(carBrands.data[0].title);
      expect(carData.model).to.eq(carModels.data[3].title);
      expect(carData.mileage).to.eq(1111);
      carId = carData.id;
      cy.log(`Added car: ${carId}`);
    });
  });

  it("should update car mileage", () => {
    const newMileage = 1555;
    cy.api({
      method: "PUT",
      url: `/api/cars/${carId}`,
      body: { mileage: newMileage },
      headers: {
        Cookie: `sid=${sidValue}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.mileage).to.eq(newMileage);
      cy.log(`Updated car mileage: ${newMileage}`);
    });
  });

  it("should get specific car info", () => {
    cy.api({
      method: "GET",
      url: `/api/cars/${carId}`,
      headers: {
        Cookie: `sid=${sidValue}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property("id", carId);
      expect(response.body.data).to.have.property("mileage");
      expect(response.body.data).to.have.property("brand");
      expect(response.body.data).to.have.property("model");
      cy.log(`Car info: ${JSON.stringify(response.body.data)}`);
    });
  });

  it("should delete the car and verify deletion", () => {
    cy.api({
      method: "DELETE",
      url: `/api/cars/${carId}`,
      headers: {
        Cookie: `sid=${sidValue}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(`Deleted car id: ${carId}`);

      cy.api({
        method: "GET",
        url: `/api/cars/${carId}`,
        headers: {
          Cookie: `sid=${sidValue}`,
        },
        failOnStatusCode: false,
      }).then((verifyResp) => {
        expect(verifyResp.status).to.eq(404);
      });
    });
  });
});

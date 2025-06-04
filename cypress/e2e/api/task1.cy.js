/// <reference types="cypress" />

const email = Cypress.env("USER_EMAIL");
const password = Cypress.env("USER_PASSWORD");

describe("Garage API CRUD flow", () => {
  let carsIds = [];
  let carsInfo = {};

  function loginAndSetSid() {
    return cy
      .request({
        method: "POST",
        url: "https://qauto.forstudy.space/api/auth/signin",
        body: { email, password, remember: true },
      })
      .then((response) => {
        const sidCookie = response.headers["set-cookie"][0];
        const sidValue = sidCookie.split(";")[0].split("=")[1];
        cy.setCookie("sid", sidValue);
        return cy.wrap(sidValue);
      });
  }

  it("should add cars", () => {
    loginAndSetSid().then((sidValue) => {
      const carsToAdd = [
        { carBrandId: 1, carModelId: 4, mileage: 9999 }, // Audi A8
        { carBrandId: 3, carModelId: 14, mileage: 10000 }, // Ford Mondeo
        { carBrandId: 5, carModelId: 22, mileage: 15000 }, // Fiat Punto
      ];
      carsIds = [];
      carsInfo = {};

      cy.wrap(carsToAdd).each((car) => {
        cy.request({
          method: "POST",
          url: "https://qauto.forstudy.space/api/cars",
          body: car,
          headers: { Cookie: `sid=${sidValue}` },
        }).then((response) => {
          expect(response.status).to.eq(201);
          const carData = response.body.data;
          carsIds.push(carData.id);
          carsInfo[carData.id] = {
            brand: carData.brand,
            model: carData.model,
            mileage: carData.mileage,
          };
        });
      });
    });
  });

  it("should get user car list and validate", () => {
    loginAndSetSid().then((sidValue) => {
      cy.request({
        method: "GET",
        url: "https://qauto.forstudy.space/api/cars",
        headers: { Cookie: `sid=${sidValue}` },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const cars = response.body.data;
        expect(cars.length).to.be.gte(0);
      });
    });
  });

  it("should update mileage for each car", () => {
    loginAndSetSid().then((sidValue) => {
      cy.request({
        method: "GET",
        url: "https://qauto.forstudy.space/api/cars",
        headers: { Cookie: `sid=${sidValue}` },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const cars = response.body.data;
        cy.wrap(cars).each((car) => {
          const updatedMileage = car.mileage + 100;
          cy.request({
            method: "PUT",
            url: `https://qauto.forstudy.space/api/cars/${car.id}`,
            body: { mileage: updatedMileage },
            headers: { Cookie: `sid=${sidValue}` },
          }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body.data.mileage).to.eq(updatedMileage);
          });
        });
      });
    });
  });

  it("should get last added car info", () => {
    loginAndSetSid().then((sidValue) => {
      cy.request({
        method: "GET",
        url: "https://qauto.forstudy.space/api/cars",
        headers: { Cookie: `sid=${sidValue}` },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const cars = response.body.data;
        if (!cars.length) return; // no cars
        const lastCar = cars[cars.length - 1];
        cy.request({
          method: "GET",
          url: `https://qauto.forstudy.space/api/cars/${lastCar.id}`,
          headers: { Cookie: `sid=${sidValue}` },
        }).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.data.id).to.eq(lastCar.id);
        });
      });
    });
  });

  it("should delete all cars and verify", () => {
    loginAndSetSid().then((sidValue) => {
      cy.request({
        method: "GET",
        url: "https://qauto.forstudy.space/api/cars",
        headers: { Cookie: `sid=${sidValue}` },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const cars = response.body.data;
        cy.wrap(cars).each((car) => {
          cy.request({
            method: "DELETE",
            url: `https://qauto.forstudy.space/api/cars/${car.id}`,
            headers: { Cookie: `sid=${sidValue}` },
          }).then((resp) => {
            expect(resp.status).to.eq(200);
          });
        });
        cy.wait(500);
        cy.request({
          method: "GET",
          url: "https://qauto.forstudy.space/api/cars",
          headers: { Cookie: `sid=${sidValue}` },
        }).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body.data).to.be.empty;
        });
      });
    });
  });
});

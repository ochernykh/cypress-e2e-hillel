export function generateCarData(brands, models) {
  const brand = Cypress._.sample(brands);
  const modelsOfBrand = models.filter((m) => m.carBrandId === brand.id);
  const model = Cypress._.sample(modelsOfBrand);
  return {
    brand: brand.title,
    model: model.title,
    mileage: (Math.floor(Math.random() * 10000) + 5000).toString(),
  };
}

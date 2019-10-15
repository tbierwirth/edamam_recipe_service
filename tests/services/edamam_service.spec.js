var app = require('../../app');
var EdamamService = require('../../services/edamam_service').EdamamService

describe('Edamam Service', () => {
  test('should return response from Edamam Recipe Search API', () => {
    let food = "chicken"
    let edamam = new EdamamService(food)

    return edamam.getRecipes()
      .then(response => {
        let results = response['hits'][0]
        expect(response.hits.length).toBe(10)
        expect(results.recipe.label).toBe('Chicken Vesuvio')
        expect(results.recipe.source).toBe('Serious Eats')
        expect(results.recipe.yield).toBe(4.0)
      })
  });
  test('should return message if no recipes found', () => {
    let food = "krsse232r"
    let edamam = new EdamamService(food)

    return edamam.getRecipes()
      .then(response => {
        expect(response.hits.length).toBe(0)
      })
  });
});

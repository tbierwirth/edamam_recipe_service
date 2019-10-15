var EdamamService = require('../services/edamam_service').EdamamService
var recipes = require('../models').Recipe
const foodTypes = ['chicken', 'asparagus', 'pasta']

foodTypes.forEach(function(foodType) {
  let edamam = new EdamamService(foodType)
  return edamam.getRecipes()
  .then(async response => {
    let results = response.hits
    for (var i = 0; i < results.length; i++) {
      await recipes.findOrCreate({
        where: {
          name: results[i].recipe.label
        },
        defaults: {
          name: results[i].recipe.label,
          recipeUrl: results[i].recipe.url,
          calories: results[i].recipe.calories,
          servings: results[i].recipe.yield,
          caloriesPerServing: (results[i].recipe.calories / results[i].recipe.yield),
          carbohydrates: results[i].recipe.digest[1].total,
          protein: results[i].recipe.digest[2].total,
          fat: results[i].recipe.digest[0].total,
          ingredientCount: results[i].recipe.ingredients.length
        }
      })
    }
  })
})

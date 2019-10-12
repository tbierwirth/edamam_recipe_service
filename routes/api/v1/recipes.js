var express = require('express')
var router = express.Router()
var recipes = require('../../../models').Recipe
var EdamamService = require('../../../services/edamam_service').EdamamService

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var edamam = new EdamamService(req.query.food_type)
  return edamam.getRecipes()
  .then(response => {
    if (response.hits === []) {
      res.status(404).send({message: "No recipes found"})
    } else {
      let results = response.hits
      for (var i = 0; i < results.length; i++) {
        recipes.findOrCreate({where: { name: results[i].label},
          recipeUrl: results[i].url,
          calories: results[i].calories,
          servings: results[i].yield,
          carbohydrates: results[i].digest[1].total,
          protein: results[i].digest[2].total,
          fat: results[i].digest[0].total,
          ingredientCount: results[i].ingredients.length,
          prepTime: results[i].totalTime
        })
        .then(([recipe, created]) => {
          console.log(recipe.get({plain: true}))
          console.log(created)
      })
    }
  })
})



module.exports = router;

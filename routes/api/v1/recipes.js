var express = require('express')
var router = express.Router()
var recipes = require('../../../models').Recipe
var EdamamService = require('../../../services/edamam_service').EdamamService

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  recipes.findAll({
    attributes: [
      'name', 'recipeUrl', 'calories',
      'servings', 'carbohydrates', 'protein',
      'fat', 'ingredientCount'
    ]
  })
  .then(response => {
    res.status(200).send(response)
  })
  .catch(error => {
    res.status(404).send()
  })
})

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var edamam = new EdamamService(req.query.food_type)
  const recipes_created = []
  return edamam.getRecipes()
  .then(async response => {
    if (response.hits.length == 0) {
      res.status(404).send({message: "No recipes found"})
    } else {
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
            carbohydrates: results[i].recipe.digest[1].total,
            protein: results[i].recipe.digest[2].total,
            fat: results[i].recipe.digest[0].total,
            ingredientCount: results[i].recipe.ingredients.length
          }
        })
        .then(([recipe, created]) => {
          recipes_created.push(recipe.get({ plain: true }))
        })
      }
    }
  })
  .then(response => {
    res.status(201).send(recipes_created)
  })
})

module.exports = router;

var express = require('express')
var router = express.Router()
var recipes = require('../../../models').Recipe
var EdamamService = require('../../../services/edamam_service').EdamamService

<<<<<<< HEAD
router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var edamam = new EdamamService(req.query.food_type)
  return edamam.getRecipes()
  .then(response => {
    if (response.hits === []) {
      res.status(404).send({message: "No recipes exist"})
    } else {
      recipes.findAll({
        attributes: ['name', 'recipeUrl']
      })
      .then(response => {
        res.status(200).send(response)
      })
    }
  })
})

router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var edamam = new EdamamService(req.query.food_type)
  return edamam.getRecipes()
  .then(response => {
    if (response.hits === []) {
=======
router.post('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var edamam = new EdamamService(req.query.food_type)
  const recipes_created = []
  return edamam.getRecipes()
  .then(async response => {
    if (response.hits.length == 0) {
>>>>>>> 99706d32d22fb8f8b18a00fe841f80ca7749949c
      res.status(404).send({message: "No recipes found"})
    } else {
      let results = response.hits
      for (var i = 0; i < results.length; i++) {
<<<<<<< HEAD
        console.log(results[i])
        recipes.create({
          name: results[i].label,
          recipeUrl: results[i].url,
          calories: results[i].calories,
          servings: results[i].yield,
          carbohydrates: results[i].digest[1].total,
          protein: results[i].digest[2].total,
          fat: results[i].digest[0].total,
          ingredientCount: results[i].ingredients.length,
          prepTime: results[i].totalTime
        })
        .then(response => {
          // console.log('this is the response', response)
          res.status(201).send()
=======
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
>>>>>>> 99706d32d22fb8f8b18a00fe841f80ca7749949c
        })
      }
    }
  })
<<<<<<< HEAD
})

// recipes.findOrCreate({where: {name: results[i].label}}),
//   recipeUrl: results[i].url,
//   calories: results[i].calories,
//   servings: results[i].yield,
//   carbohydrates: results[i].digest[1].total,
//   protein: results[i].digest[2].total,
//   fat: results[i].digest[0].total,
//   ingredientCount: results[i].ingredients.length,
//   prepTime: results[i].totalTime
// .then(([recipe, created]) => {
//   console.log("this is the recipe", recipe.get)
//   // console.log(created)
// })


=======
  .then(response => {
    res.status(201).send(recipes_created)
  })
})

>>>>>>> 99706d32d22fb8f8b18a00fe841f80ca7749949c
module.exports = router;

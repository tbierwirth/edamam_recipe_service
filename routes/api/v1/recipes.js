var express = require('express')
var router = express.Router()
var recipes = require('../../../models').Recipe
var EdamamService = require('../../../services/edamam_service').EdamamService
var sequelize = require('sequelize')
const Op = sequelize.Op

router.get('/', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  recipes.findAll({
    attributes: [
      'name', 'recipeUrl', 'calories',
      'servings', 'carbohydrates', 'protein',
      'fat', 'food_type', 'ingredientCount'
    ]
  })
  .then(response => {
    res.status(200).send(response)
  })
  .catch(error => {
    res.status(404).send()
  })
})

router.get('/food_search', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  recipes.findAll({
    where: { food_type: req.query.food_type },
    attributes: [
      'name', 'recipeUrl', 'calories', 'servings'
    ]
  })
  .then(recipes => {
    if (recipes.length > 1) {
      res.status(200).send(JSON.stringify(recipes))
    } else {
      res.status(400).send({ message: "No recipes found for food type."})
    }
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
      let foodType = response.q
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
            food_type: foodType,
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
    if (recipes_created.length > 0) {
      res.status(201).send(recipes_created)
    }
  })
})

router.get('/calorie_search', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  const from = req.query.from
  const to = req.query.to
  return recipes.findAll({
    where: {
      caloriesPerServing: {
        [Op.between]: [from, to]
      }
    }
  }).then(results => {
    if (results.length == 0) {
      res.status(400).send({message: "No recipes found"})
    } else {
      res.status(200).send(results)
    }
  })
})

router.get('/sort', () => {
  res.setHeader("Content-Type", "application/json");
  var nutrient = req.query.nutrient
  return recipes.findAll({
    order: [[`${nutrient}`, 'DESC']]
  })
  .then(results => {
    if (results) {
      res.status(200).send(results)
    } else {
      res.status(400).send({message: "Please choose nutrient from carbohydrates, fat, or protein"})
    }
  })
  .catch(error => {
    res.status(400).send({message: "Please choose nutrient from carbohydrates, fat, or protein"})
  })
})

router.get('/average_calories', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  const food_type = req.query.food_type
  return recipes.findAll({
    where: {food_type: food_type},
    attributes: [[sequelize.fn('avg', sequelize.col('caloriesPerServing')), 'avgCaloriesPerServing']]
  }).then(results => {
    if (results[0].dataValues.avgCaloriesPerServing == null) {
      res.status(400).send({message: "No recipes found"})
    } else {
      average = Math.round(results[0].dataValues.avgCaloriesPerServing)
      res.status(200).send({average})
    }
  })
})

module.exports = router;

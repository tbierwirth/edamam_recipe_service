var app = require('../../app');
var shell = require('shelljs');
var request = require('supertest');
var recipe = require('../../models').Recipe

describe('api', () => {
  beforeAll(() => {
  shell.exec('npx sequelize db:create --env test')
  shell.exec('npx sequelize db:migrate --env test')
  });

  afterAll(() => {
    shell.exec('npx sequelize db:migrate:undo:all --env test')
    });

  describe('Test GET /api/v1/recipes/calorie_search', () => {
    test('should return recipes with 200-500 calories per serving', async () => {
      await recipe.bulkCreate([
        { name: 'Chicken Vesuvio', recipeUrl: 'www.recipe.com', calories: 4230, servings: 4, caloriesPerServing: 1080, carbohydrates: 178, protein: 231, fat: 275, ingredientCount: 11, food_type: 'chicken' },
        { name: 'Roast potatoes', recipeUrl: 'www.recipe.com', calories: 890, servings: 8, caloriesPerServing: 111, carbohydrates: 175, protein: 20, fat: 15, ingredientCount: 2, food_type: 'potatoes' },
        { name: 'Persian Chicken', recipeUrl: 'www.recipe.com', calories: 4107, servings: 5, caloriesPerServing: 821, carbohydrates: 60, protein: 164, fat: 341, ingredientCount: 10, food_type: 'chicken' },
        { name: 'Chicken Piccata', recipeUrl: 'www.recipe.com', calories: 1651, servings: 4, caloriesPerServing: 413, carbohydrates: 57, protein: 85, fat: 120, ingredientCount: 11, food_type: 'chicken' },
        { name: 'Candied Sweet Potatoes', recipeUrl: 'www.recipe.com', calories: 2170, servings: 8, caloriesPerServing: 271, carbohydrates: 411, protein: 34, fat: 47, ingredientCount: 3, food_type: 'potatoes' }
      ])

      return request(app).get('/api/v1/recipes/calorie_search').query({
        from: '200',
        to: '500'
      })
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(2)
      })
    })

    test('should return message if no recipes are returned', async () => {
      await recipe.bulkCreate([
        { name: 'Chicken Vesuvio', recipeUrl: 'www.recipe.com', calories: 4230, servings: 4, caloriesPerServing: 1080, carbohydrates: 178, protein: 231, fat: 275, ingredientCount: 11 },
        { name: 'Roast potatoes', recipeUrl: 'www.recipe.com', calories: 890, servings: 8, caloriesPerServing: 111, carbohydrates: 175, protein: 20, fat: 15, ingredientCount: 2 },
        { name: 'Persian Chicken', recipeUrl: 'www.recipe.com', calories: 4107, servings: 5, caloriesPerServing: 821, carbohydrates: 60, protein: 164, fat: 341, ingredientCount: 10 },
        { name: 'Chicken Piccata', recipeUrl: 'www.recipe.com', calories: 1651, servings: 4, caloriesPerServing: 413, carbohydrates: 57, protein: 85, fat: 120, ingredientCount: 11 },
        { name: 'Candied Sweet Potatoes', recipeUrl: 'www.recipe.com', calories: 2170, servings: 8, caloriesPerServing: 271, carbohydrates: 411, protein: 34, fat: 47, ingredientCount: 3 }
      ])

      return request(app).get('/api/v1/recipes/calorie_search').query({
        from: '9000',
        to: '10000'
      })
      .then(response => {
        expect(response.status).toBe(400)
        expect(response.body.message).toBe('No recipes found')
      })
    })
  })
})

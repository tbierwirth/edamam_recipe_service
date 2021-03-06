var app = require('../../app');
var shell = require('shelljs');
var request = require('supertest');
var recipe = require('../../models').Recipe;

describe('api', () => {
  beforeAll(() => {
  shell.exec('npx sequelize db:create --env test')
  shell.exec('npx sequelize db:migrate --env test')
  });

  afterAll(() => {
    shell.exec('npx sequelize db:migrate:undo:all --env test')
    });

  describe('Test POST api/v1/recipes', () => {
    test('should create recipes from Edamam', async () => {
      return await request(app).post('/api/v1/recipes').query({
        food_type: 'chicken'
      })
      .then(async response => {
        await expect(response.status).toBe(201)
        await recipe.findAll().then(async recipes => {
          await expect(recipes.length).toBe(10)
        })
      })
    })
    test('should return message if no recipes found', async () => {
      return await request(app).post('/api/v1/recipes').query({
        food_type: '231m3kld'
      })
      .then(response => {
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("No recipes found")
      })
    })
  })
  describe('Test GET /api/v1/recipes', () => {
    test('should return list of recipes and 200 status code', async () => {
      return await request(app).get("/api/v1/recipes").then(async response => {
        await expect(response.status).toBe(200)
        await expect(response.body[0].name).toBe("Chicken Vesuvio")
        await expect(response.body.length).toBe(10)
      })
    })
  })

  describe('Test GET /api/v1/recipes/food_search?q=food_type', () => {
    test('should return list of recipes with that food type', () => {
      return request(app).get("/api/v1/recipes/food_search").query({food_type: 'chicken'})
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(10)
      })
    })
    test('should return 400 if no recipes can be found with food type', () => {
      return request(app).get("/api/v1/recipes/food_search").query({food_type: 'rat'})
      .then(response => {
        expect(response.statusCode).toBe(400)
        expect(response.body['message']).toBe("No recipes found for food type.")
      })
    })
  })

  describe('Test GET /api/v1/recipes/sort?q=nutrient', () => {
    test('should return recipes sorted by amount of nutrient queried', () => {
      return recipe.bulkCreate([
        { name: 'Chicken Vesuvio', recipeUrl: 'www.recipe.com', calories: 4230, servings: 4, caloriesPerServing: 1080, carbohydrates: 178, protein: 23, fat: 275, ingredientCount: 11, food_type: 'chicken' },
        { name: 'Roast potatoes', recipeUrl: 'www.recipe.com', calories: 890, servings: 8, caloriesPerServing: 111, carbohydrates: 175, protein: 20, fat: 15, ingredientCount: 2, food_type: 'potatoes' },
        { name: 'Persian Chicken', recipeUrl: 'www.recipe.com', calories: 4107, servings: 5, caloriesPerServing: 821, carbohydrates: 60, protein: 164, fat: 271, ingredientCount: 10, food_type: 'chicken' },
        { name: 'Chicken Piccata', recipeUrl: 'www.recipe.com', calories: 1651, servings: 4, caloriesPerServing: 413, carbohydrates: 57, protein: 85, fat: 120, ingredientCount: 11, food_type: 'chicken' },
        { name: 'Candied Sweet Potatoes', recipeUrl: 'www.recipe.com', calories: 2170, servings: 8, caloriesPerServing: 271, carbohydrates: 411, protein: 34, fat: 47, ingredientCount: 3, food_type: 'potatoes' }
      ])
      return request(app).get("/api/v1/recipes/sort").query({ nutrient: 'protein'})
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body['name'].first).toBe('Persian Chicken')
        expect(response.body['name'].last).toBe('Roast potatoes')
      })

      return request(app).get("/api/v1/recipes/sort").query({ nutrient: 'fat'})
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body['name']).toBe('Chicken Vesuvio')
      })

      return request(app).get("/api/v1/recipes/sort").query({ nutrient: 'carbohydrates'})
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body['name']).toBe('Candied Sweet Potatoes')
      })
    })

    test('should return 400 status if nutrient type is not carbs, protein, or fat', () => {
      return recipe.bulkCreate([
        { name: 'Chicken Vesuvio', recipeUrl: 'www.recipe.com', calories: 4230, servings: 4, caloriesPerServing: 1080, carbohydrates: 178, protein: 23, fat: 275, ingredientCount: 11, food_type: 'chicken' },
        { name: 'Roast potatoes', recipeUrl: 'www.recipe.com', calories: 890, servings: 8, caloriesPerServing: 111, carbohydrates: 175, protein: 20, fat: 15, ingredientCount: 2, food_type: 'potatoes' },
        { name: 'Persian Chicken', recipeUrl: 'www.recipe.com', calories: 4107, servings: 5, caloriesPerServing: 821, carbohydrates: 60, protein: 164, fat: 271, ingredientCount: 10, food_type: 'chicken' },
        { name: 'Chicken Piccata', recipeUrl: 'www.recipe.com', calories: 1651, servings: 4, caloriesPerServing: 413, carbohydrates: 57, protein: 85, fat: 120, ingredientCount: 11, food_type: 'chicken' },
        { name: 'Candied Sweet Potatoes', recipeUrl: 'www.recipe.com', calories: 2170, servings: 8, caloriesPerServing: 271, carbohydrates: 411, protein: 34, fat: 47, ingredientCount: 3, food_type: 'potatoes' }
      ])
      return request(app).get("/api/v1/recipes/sort").query({ nutrient: 'coffee'})
      .then(response => {
        expect(response.status).toBe(400)
        expect(response.body['message']).toBe('Please choose nutrient from carbohydrates, fat, or protein')
      })
    })
  })
})

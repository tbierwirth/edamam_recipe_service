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
})

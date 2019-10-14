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
    test('should create recipes from Edamam', () => {
      return request(app).post('/api/v1/recipes').query({
        food_type: 'chicken'
      })
      .then(response => {
        expect(response.status).toBe(201)
        recipe.findAll().then(recipes => {
          expect(recipes.length).toBe(10)
        })
      })
    })
  })
})

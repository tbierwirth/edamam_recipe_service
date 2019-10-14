var app = require('../../app');
var shell = require('shelljs');
var request = require('supertest');
var recipes = require('../../models').Recipe;

describe('api', () => {
  beforeAll(() => {
    shell.exec('npx sequelize db:create --env test')
    shell.exec('npx sequelize db:migrate --env test')
  });

  afterAll(() => {
    shell.exec('npx sequelize db:migrate:undo:all --env test')
    });

    describe('Test GET /api/v1/recipes', () => {
      test('should return list of recipes and 200 status code', () => {
        let index = recipes.bulkCreate([
          { name: "Stroganoff", recipeUrl: "https://damndelicious.net/2019/04/08/one-pot-beef-stroganoff/", calories: 456, servings: 3, carbohydrates: 45, protein: 34, fat: 3, ingredientCount: 4, prepTime: 345 },
          { name: "Lasagna", recipeUrl: "https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/", calories: 56, servings: 1, carbohydrates: 89, protein: 3, fat: 9, ingredientCount: 4, prepTime: 456 },
          { name: "Stew", recipeUrl: "https://cooking.nytimes.com/recipes/4735-old-fashioned-beef-stew", calories: 6, servings: 3, carbohydrates: 745, protein: 4, fat: 78, ingredientCount: 7, prepTime: 342 }
        ])
        .then(index => {
          return request(app).get("/api/v1/recipes").then(response => {
            console.log()
            expect(response.status).toBe(200)
          })
        })
      })
    })

  // describe('Test POST /api/v1/recipes', () => {
  //   test('should return id of recipe posted and 201 status code', async () => {
  //     return request(app)
  //     .post('/api/v1/recipes')
  //     .query({ food_type: 'chicken' })
  //     .then(response => {
  //       expect(response.status).toBe(201)
  //     })
  //   })
  // });
});

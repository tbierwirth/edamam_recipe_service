var app = require('../../app');
var shell = require('shelljs');
var request = require('supertest');
var recipe = require('../../models').Recipe;

describe('api', () => {
  test('Test POST api/v1/recipes', () => {
    return request(app).post('/api/v1/recipes').query({
      food_type: 'chicken'
    })
    .then(response => {
      expect(response.status).toBe(201)
    })
  })
})

const fetch = require('cross-fetch');

class EdamamService {
  constructor(food) {
    this.food = food;
  }

  getRecipes() {
    const url = new URL(`https://api.edamam.com/search?q=${this.food}&app_id=${process.env.EDAMAM_API_ID}&app_key=${process.env.EDAMAM_API_KEY}&from=0&to=10`)
    return fetch(url).then(response => response.json())
  }
}
module.exports = {EdamamService: EdamamService}

# Edamam Recipe Service
This API microservice integrates with Edamam Recipe Search API and provides several endpoints to add recipes from Edamam, return recipes with a specific range of calories per serving and more.
## Setup
 - `npm install`
 - `npm sequelize db:create`
 - `npm sequelize db:migrate`
 - Add your Edamam API key and ID to a `.env` file in the root directory.
 - `npm start`
   - Access at `http://localhost:3000`

## Tech Stack
- Express 4.16.1
- Node.js 10.16.3
- PostgreSQL 11.3
- Sequelize 5.5.1

## Endpoints
#### Add recipes to database
  - Example Request
   - `POST /api/v1/recipes?food_type=chicken`
   - Requires a `food_type` param.
   - Returns all recipes added to the database

#### Return all recipes
  - Example Request
    - `GET /api/v1/recipes`
  - Example Response:
    ```
    {
        "name": "Chicken Vesuvio",
        "recipeUrl": "http://www.seriouseats.com/recipes/2011/12/chicken-vesuvio-recipe.html",
        "calories": 4230,
        "servings": 4,
        "carbohydrates": 178,
        "protein": 231,
        "fat": 275,
        "food_type": "chicken",
        "ingredientCount": 11
    },
    {
        "name": "Chicken Paprikash",
        "recipeUrl": "http://norecipes.com/recipe/chicken-paprikash/",
        "calories": 3033,
        "servings": 4,
        "carbohydrates": 48,
        "protein": 237,
        "fat": 208,
        "food_type": "chicken",
        "ingredientCount": 12
    }
    ```

#### Return recipes by food type
 - Example Request:
   - `GET /api/v1/recipes/food_search?food_type=chicken`
   - Requires a `food_type` param.
 - Example Response:
  ```
 {
    "name": "Chicken Vesuvio",
    "recipeUrl": "http://www.seriouseats.com/recipes/2011/12/chicken-vesuvio-recipe.html",
    "calories": 4230,
    "servings": 4
},
{
    "name": "Chicken Paprikash",
    "recipeUrl": "http://norecipes.com/recipe/chicken-paprikash/",
    "calories": 3033,
    "servings": 4
},
{
    "name": "Chicken Gravy",
    "recipeUrl": "http://www.marthastewart.com/332664/chicken-gravy",
    "calories": 1092,
    "servings": 6
}
```

#### Return recipes with a specific range of calories per serving
 - Example Request:
  - `GET /api/v1/recipes/calorie_search?from=500&to=800`
  - Requires `from` and `to` params.
 - Example Response:
  ```
  {
    "id": 2,
    "name": "Chicken Paprikash",
    "recipeUrl": "http://norecipes.com/recipe/chicken-paprikash/",
    "calories": 3033,
    "servings": 4,
    "caloriesPerServing": 758,
    "carbohydrates": 48,
    "protein": 237,
    "fat": 208,
    "food_type": "chicken",
    "ingredientCount": 12,
    "createdAt": "2019-10-16T20:09:57.062Z",
    "updatedAt": "2019-10-16T20:09:57.062Z"
},
{
    "id": 6,
    "name": "Kreplach (Chicken Dumplings)",
    "recipeUrl": "https://www.tastingtable.com/entry_detail/chefs_recipes/10154/Matzo_balls_watch_your_back.htm",
    "calories": 4279,
    "servings": 8,
    "caloriesPerServing": 535,
    "carbohydrates": 667,
    "protein": 217,
    "fat": 71,
    "food_type": "chicken",
    "ingredientCount": 9,
    "createdAt": "2019-10-16T20:09:57.164Z",
    "updatedAt": "2019-10-16T20:09:57.164Z"
}
  ```

#### Return recipes sorted by amount of nutrient type
- Example Request:
   - `GET /api/v1/recipes/sort?nutrient=protein`
   - Requires `nutrient` params. Carbohydrates, fat and protein are your options to sort by.
- Example Response:
```
  {
        "id": 21,
        "name": "Tarragon Chicken",
        "recipeUrl": "http://www.frenchrevolutionfood.com/2009/09/french-in-a-flash-tarragon-chicken-and-carrot-muffins-with-sweet-chevre-icing/",
        "calories": 9435,
        "servings": 4,
        "caloriesPerServing": 2359,
        "carbohydrates": 100,
        "protein": 670,
        "fat": 682,
        "food_type": "chicken",
        "ingredientCount": 11,
        "createdAt": "2019-10-16T22:31:01.281Z",
        "updatedAt": "2019-10-16T22:31:01.281Z"
    },
    {
        "id": 20,
        "name": "Chicken cacciatore",
        "recipeUrl": "http://www.bbc.co.uk/food/recipes/chickenalocacciatore_70349",
        "calories": 4447,
        "servings": 6,
        "caloriesPerServing": 741,
        "carbohydrates": 254,
        "protein": 262,
        "fat": 246,
        "food_type": "chicken",
        "ingredientCount": 14,
        "createdAt": "2019-10-16T22:31:01.276Z",
        "updatedAt": "2019-10-16T22:31:01.276Z"
    },
    {
        "id": 13,
        "name": "Chicken Paprikash",
        "recipeUrl": "http://norecipes.com/recipe/chicken-paprikash/",
        "calories": 3033,
        "servings": 4,
        "caloriesPerServing": 758,
        "carbohydrates": 48,
        "protein": 237,
        "fat": 208,
        "food_type": "chicken",
        "ingredientCount": 12,
        "createdAt": "2019-10-16T22:31:01.231Z",
        "updatedAt": "2019-10-16T22:31:01.231Z"
    }
```

#### Return average calories per serving of a food type
- Example Request:
 - `GET /api/v1/recipes/average_calories?food_type=pasta`
 - Requires food_type params.
- Example Response:
  ```
  {
    "average": 479
  }
  ```

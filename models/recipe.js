'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    name: DataTypes.STRING,
    recipeUrl: DataTypes.STRING,
    calories: DataTypes.INTEGER,
    servings: DataTypes.INTEGER,
    carbohydrates: DataTypes.INTEGER,
    protein: DataTypes.INTEGER,
    fat: DataTypes.INTEGER,
    ingredientCount: DataTypes.INTEGER
  }, {});
  Recipe.associate = function(models) {
    // associations can be defined here
  };
  return Recipe;
};

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      recipeUrl: {
        allowNull: false,
        type: Sequelize.STRING
      },
      calories: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      servings: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      carbohydrates: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      protein: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fat: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      ingredientCount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Recipes');
  }
};

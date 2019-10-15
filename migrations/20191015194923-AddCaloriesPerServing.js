'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Recipes',
      'caloriesPerServing',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Recipes', 'caloriesPerServing')
  }
};

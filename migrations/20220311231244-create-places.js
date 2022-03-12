'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('places', {
      id: Sequelize.UUID,
      name: Sequelize.STRING,
      city: Sequelize.STRING,
      street: Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('places');
  },
};

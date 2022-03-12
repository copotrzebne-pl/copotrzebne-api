'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('places');

    await queryInterface.createTable('places', {
      id: Sequelize.UUID,
      name: { type: Sequelize.STRING, allowNull: false },
      city: { type: Sequelize.STRING, allowNull: false },
      street: { type: Sequelize.STRING, allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      building_number: { type: Sequelize.STRING(50), allowNull: false },
      apartment: { type: Sequelize.STRING(50), allowNull: true },

      comment: { type: Sequelize.STRING, allowNull: true },

      email: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('places');

    await queryInterface.createTable('places', {
      id: Sequelize.UUID,
      name: Sequelize.STRING,
      city: Sequelize.STRING,
      street: Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('priorities', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: false,
      },
      name_pl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_ua: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('priorities');
  },
};

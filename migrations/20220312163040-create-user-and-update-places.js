'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('places', 'id');

    await queryInterface.addColumn('places', 'id', {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    });

    await queryInterface.addColumn('places', 'latitude', {
      allowNull: true,
      type: Sequelize.DECIMAL,
    });

    await queryInterface.addColumn('places', 'longitude', {
      allowNull: true,
      type: Sequelize.DECIMAL,
    });

    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      login: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hashed_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM(['admin', 'place_manager', 'service']),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('places', 'id', {
      type: Sequelize.UUID,
    });

    await queryInterface.dropTable('users');
  },
};

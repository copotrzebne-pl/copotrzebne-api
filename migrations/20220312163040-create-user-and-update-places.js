'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('places', 'id', { transaction });

      await queryInterface.addColumn(
        'places',
        'id',
        {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'places',
        'latitude',
        {
          allowNull: true,
          type: Sequelize.DECIMAL,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'places',
        'longitude',
        {
          allowNull: true,
          type: Sequelize.DECIMAL,
        },
        { transaction },
      );

      await queryInterface.createTable(
        'users',
        {
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
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'places',
        'id',
        {
          type: Sequelize.UUID,
        },
        { transaction },
      );

      await queryInterface.dropTable('users', { transaction });
    });
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'users',
        'id',
        {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          unique: true,
          autoIncrement: false,
          defaultValue: Sequelize.UUIDV4,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'login',
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'users',
        'id',
        {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          unique: false,
          autoIncrement: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'users',
        'login',
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
        },
        { transaction },
      );
    });
  },
};

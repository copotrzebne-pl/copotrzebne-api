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
      await queryInterface.sequelize.query('ALTER TABLE users DROP CONSTRAINT users_id_key', { transaction });
      await queryInterface.removeIndex('users', 'users_id_key', { transaction });

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

      await queryInterface.sequelize.query('ALTER TABLE users DROP CONSTRAINT users_login_key', { transaction });
      await queryInterface.removeIndex('users', 'users_login_key', { transaction });
    });
  },
};

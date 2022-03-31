'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'journals',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          action: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: [
              'login',
              'get_places',
              'edit_place',
              'add_comment',
              'edit_comment',
              'delete_comment',
              'add_demand',
              'edit_demand',
              'delete_demand',
              'delete_all_demands',
            ],
          },
          details: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
        },
        {
          transaction,
        },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('journals', { transaction });
    });
  },
};

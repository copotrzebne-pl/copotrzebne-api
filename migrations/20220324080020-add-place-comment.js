'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'comments',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          message: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          links: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            defaultValue: [],
            allowNull: true,
          },
          place_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'places',
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
          updated_at: {
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
      await queryInterface.dropTable('comments', { transaction });
    });
  },
};

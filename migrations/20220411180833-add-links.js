'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'links',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          comment_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'comments',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          homepage: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          facebook: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          signup: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          additional: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            defaultValue: [],
            allowNull: true,
          },
        },
        {
          transaction,
        },
      );

      await queryInterface.removeColumn('comments', 'links', {
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('links', { transaction });

      await queryInterface.addColumn(
        'comments',
        'links',
        {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          defaultValue: [],
          allowNull: true,
        },
        { transaction },
      );
    });
  },
};

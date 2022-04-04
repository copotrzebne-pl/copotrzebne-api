'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'opening_hours',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          day: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          open_time: {
            type: Sequelize.STRING(5),
            allowNull: false,
          },
          close_time: {
            type: Sequelize.STRING(5),
            allowNull: false,
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
        },
        {
          transaction,
        },
      );

      await queryInterface.removeColumn('places', 'working_hours', {
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('opening_hours', { transaction });

      await queryInterface.addColumn(
        'places',
        'working_hours',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );
    });
  },
};

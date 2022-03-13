'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addConstraint('places', {
        type: 'primary key',
        name: 'places_pkey',
        fields: ['id'],
        transaction,
      });

      await queryInterface.createTable(
        'demands',
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: false,
          },
          comment: {
            type: Sequelize.STRING,
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
          supply_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'supplies',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          priority_id: {
            type: Sequelize.UUID,
            references: {
              model: 'priorities',
              key: 'id',
            },
            onUpdate: 'set null',
            onDelete: 'set null',
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
        },
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('demands', { transaction });

      await queryInterface.removeConstraint('places', 'places_pkey', { transaction });
    });
  },
};

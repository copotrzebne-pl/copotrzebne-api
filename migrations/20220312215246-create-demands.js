'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
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
          },
          supply_id: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          priority_id: {
            type: Sequelize.UUID,
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

      await queryInterface.addConstraint('places', {
        type: 'primary key',
        name: 'places_pkey',
        fields: ['id'],
        transaction,
      });

      await queryInterface.addConstraint('demands', {
        type: 'foreign key',
        name: 'demands_placeId_fkey',
        fields: ['place_id'],
        references: {
          table: 'places',
          field: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        transaction,
      });

      await queryInterface.addConstraint('demands', {
        type: 'foreign key',
        name: 'demands_supplyId_fkey',
        fields: ['supply_id'],
        references: {
          table: 'supplies',
          field: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        transaction,
      });

      await queryInterface.addConstraint('demands', {
        type: 'foreign key',
        name: 'demands_priorityId_fkey',
        fields: ['priority_id'],
        references: {
          table: 'priorities',
          field: 'id',
        },
        onUpdate: 'set null',
        onDelete: 'set null',
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('demands', { transaction });

      await queryInterface.removeConstraint('places', 'places_pkey', { transaction });
    });
  },
};

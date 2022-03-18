'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'supply_categories',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          name_pl: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          name_ua: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          name_en: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        {
          transaction,
        },
      );

      await queryInterface.addColumn(
        'supplies',
        'supply_category_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addConstraint('supplies', {
        type: 'foreign key',
        name: 'supplies_supply_category_id_fkey',
        fields: ['supply_category_id'],
        references: {
          table: 'supply_categories',
          field: 'id',
        },
        onDelete: 'set null',
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint('supplies', 'supplies_supply_category_id_fkey', {
        transaction,
      });

      await queryInterface.removeColumn('supplies', 'supply_category_id', {
        transaction,
      });

      await queryInterface.dropTable('supply_categories', { transaction });
    });
  },
};

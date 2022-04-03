'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'categories',
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
        'category_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addConstraint('supplies', {
        type: 'foreign key',
        name: 'supplies_category_id_fkey',
        fields: ['category_id'],
        references: {
          table: 'categories',
          field: 'id',
        },
        onDelete: 'set null',
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint('supplies', 'supplies_category_id_fkey', {
        transaction,
      });

      await queryInterface.removeColumn('supplies', 'category_id', {
        transaction,
      });

      await queryInterface.dropTable('categories', { transaction });
    });
  },
};

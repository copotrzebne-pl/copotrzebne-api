'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [categories] = await queryInterface.sequelize.query(`select * from "categories"`, { transaction });

      await queryInterface.removeColumn('categories', 'name_pl', {
        transaction,
      });

      await queryInterface.removeColumn('categories', 'name_en', {
        transaction,
      });

      await queryInterface.removeColumn('categories', 'name_ua', {
        transaction,
      });

      await queryInterface.addColumn('categories', 'name', { type: Sequelize.JSONB, allowNull: true }, { transaction });

      for (const category of categories) {
        await queryInterface.bulkUpdate(
          'categories',
          { name: { pl: category.name_pl, en: category.name_en, ua: category.name_ua } },
          { id: category.id },
          { transaction },
        );
      }

      await queryInterface.changeColumn(
        'categories',
        'name',
        {
          type: Sequelize.JSONB,
          allowNull: false,
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [categories] = await queryInterface.sequelize.query(`select * from "categories"`, { transaction });

      await queryInterface.removeColumn('categories', 'name', {
        transaction,
      });

      await queryInterface.addColumn(
        'categories',
        'name_pl',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'categories',
        'name_en',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'categories',
        'name_ua',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      for (const category of categories) {
        await queryInterface.bulkUpdate(
          'categories',
          { name_pl: category.name.pl, name_en: category.name.en, name_ua: category.name.ua },
          { id: category.id },
          { transaction },
        );
      }

      await queryInterface.changeColumn(
        'categories',
        'name_pl',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'categories',
        'name_en',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'categories',
        'name_ua',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );
    });
  },
};

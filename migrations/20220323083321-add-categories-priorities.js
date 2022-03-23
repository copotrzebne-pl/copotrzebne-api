'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'categories',
        'priority',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 1,
        },
        {
          name_pl: 'żywność trwała',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 2,
        },
        {
          name_pl: 'żywność krótkotrwała',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 3,
        },
        {
          name_pl: 'środki higieny osobistej i chemia',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 4,
        },
        {
          name_pl: 'dzieci',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 5,
        },
        {
          name_pl: 'leki',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 6,
        },
        {
          name_pl: 'zwierzęta',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 7,
        },
        {
          name_pl: 'odzież i tekstylia',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 8,
        },
        {
          name_pl: 'inne',
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'categories',
        {
          priority: 9,
        },
        {
          name_pl: 'zupa dla Ukrainy',
        },
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('categories', 'priority', {
        transaction,
      });
    });
  },
};

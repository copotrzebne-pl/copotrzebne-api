'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'priorities',
        'importance',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.bulkUpdate(
        'priorities',
        { importance: 1 },
        { name_pl: 'pilnie potrzebne' },
        { transaction },
      );
      await queryInterface.bulkUpdate('priorities', { importance: 2 }, { name_pl: 'potrzebne' }, { transaction });

      await queryInterface.changeColumn(
        'priorities',
        'importance',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('priorities', 'importance', {
        transaction,
      });
    });
  },
};

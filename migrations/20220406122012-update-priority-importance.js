'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkUpdate(
        'priorities',
        { importance: 2 },
        { name_pl: 'pilnie potrzebne' },
        { transaction },
      );
      await queryInterface.bulkUpdate('priorities', { importance: 1 }, { name_pl: 'potrzebne' }, { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkUpdate(
        'priorities',
        { importance: 1 },
        { name_pl: 'pilnie potrzebne' },
        { transaction },
      );
      await queryInterface.bulkUpdate('priorities', { importance: 2 }, { name_pl: 'potrzebne' }, { transaction });
    });
  },
};

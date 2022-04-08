'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'places',
        'state',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.bulkUpdate('places', { state: 1 }, {}, { transaction });

      await queryInterface.changeColumn(
        'places',
        'state',
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
      await queryInterface.removeColumn('places', 'state', {
        transaction,
      });
    });
  },
};

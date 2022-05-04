'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('places', 'comment', 'additional_description', { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.renameColumn('places', 'additional_description', 'comment', { transaction });
    });
  },
};

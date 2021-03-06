'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.TEXT,
      });

      await queryInterface.sequelize.query('drop type enum_users_role;');

      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM(['admin', 'moderator', 'place_manager', 'auditor']),
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.TEXT,
      });

      await queryInterface.sequelize.query('drop type enum_users_role;');

      await queryInterface.changeColumn('users', 'role', {
        type: Sequelize.ENUM(['admin', 'moderator', 'place_manager']),
      });
    });
  },
};

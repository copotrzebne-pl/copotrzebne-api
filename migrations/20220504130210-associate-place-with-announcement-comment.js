'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'announcement_comments',
        'place_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'places',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('announcement_comments', 'place_id', {
        transaction,
      });
    });
  },
};

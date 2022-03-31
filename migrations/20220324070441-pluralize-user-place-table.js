'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [usersPlaces] = await queryInterface.sequelize.query(`select * from "user_place"`, { transaction });

      await queryInterface.dropTable('user_place', { transaction });

      await queryInterface.createTable(
        'users_places',
        {
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          place_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'places',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        },
        {
          uniqueKeys: {
            users_places_unique_index: {
              fields: ['user_id', 'place_id'],
            },
          },
          transaction,
        },
      );

      if (usersPlaces.length > 0) {
        await queryInterface.bulkInsert('users_places', usersPlaces, { transaction });
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [usersPlaces] = await queryInterface.sequelize.query(`select * from "users_places"`, { transaction });

      await queryInterface.dropTable('users_places', { transaction });

      await queryInterface.createTable(
        'user_place',
        {
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          place_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'places',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        },
        {
          uniqueKeys: {
            user_place_unique_index: {
              fields: ['user_id', 'place_id'],
            },
          },
          transaction,
        },
      );

      if (usersPlaces.length > 0) {
        await queryInterface.bulkInsert('user_place', usersPlaces, { transaction });
      }
    });
  },
};

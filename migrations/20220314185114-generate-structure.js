'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"', { transaction });

      await queryInterface.createTable(
        'places',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          name: { type: Sequelize.STRING, allowNull: false },
          city: { type: Sequelize.STRING, allowNull: false },
          street: { type: Sequelize.STRING, allowNull: false },
          building_number: { type: Sequelize.STRING(50), allowNull: false },

          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },

          apartment: { type: Sequelize.STRING(50), allowNull: true },

          comment: { type: Sequelize.STRING, allowNull: true },

          email: { type: Sequelize.STRING, allowNull: true },
          phone: { type: Sequelize.STRING, allowNull: true },

          latitude: {
            allowNull: true,
            type: Sequelize.DECIMAL,
          },
          longitude: {
            allowNull: true,
            type: Sequelize.DECIMAL,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          login: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          hashed_password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          role: {
            type: Sequelize.ENUM(['admin', 'place_manager', 'service']),
            allowNull: false,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now'),
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now'),
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'supplies',
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

      await queryInterface.createTable(
        'priorities',
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
        { transaction },
      );

      await queryInterface.createTable(
        'demands',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          comment: {
            type: Sequelize.STRING,
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
          supply_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'supplies',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          priority_id: {
            type: Sequelize.UUID,
            references: {
              model: 'priorities',
              key: 'id',
            },
            onUpdate: 'set null',
            onDelete: 'set null',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now'),
            allowNull: false,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('now'),
            allowNull: false,
          },
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('demands', { transaction });
      await queryInterface.dropTable('supplies', { transaction });
      await queryInterface.dropTable('priorities', { transaction });
      await queryInterface.dropTable('users', { transaction });
      await queryInterface.dropTable('places', { transaction });
    });
  },
};

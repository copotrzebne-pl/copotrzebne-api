'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('links', { transaction });
      await queryInterface.dropTable('comments', { transaction });

      await queryInterface.createTable(
        'place_links',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
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
          homepage: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          facebook: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          signup: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          fundraising: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        },
        {
          transaction,
        },
      );

      await queryInterface.createTable(
        'public_announcements',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
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
          title: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          message: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          contact_info: {
            type: Sequelize.STRING,
            allowNull: true,
          },
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
        },
        {
          transaction,
        },
      );

      await queryInterface.createTable(
        'internal_announcements',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
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
          title: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          message: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          contact_info: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          start_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          end_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
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
        },
        {
          transaction,
        },
      );

      await queryInterface.createTable(
        'internal_announcement_comments',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          internal_announcement_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'internal_announcements',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          message: {
            type: Sequelize.STRING,
            allowNull: true,
          },
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
        },
        {
          transaction,
        },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('place_links', { transaction });
      await queryInterface.dropTable('internal_announcement_comments', { transaction });
      await queryInterface.dropTable('public_announcements', { transaction });
      await queryInterface.dropTable('internal_announcements', { transaction });

      await queryInterface.createTable(
        'comments',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          message: {
            type: Sequelize.STRING,
            allowNull: false,
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
        },
        {
          transaction,
        },
      );

      await queryInterface.createTable(
        'links',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: false,
            defaultValue: Sequelize.fn('uuid_generate_v4'),
          },
          comment_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'comments',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          homepage: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          facebook: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          signup: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          additional: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            defaultValue: [],
            allowNull: true,
          },
        },
        {
          transaction,
        },
      );
    });
  },
};

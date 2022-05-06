'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [places] = await queryInterface.sequelize.query(`select * from "places"`, { transaction });

      await queryInterface.sequelize.query('ALTER TABLE "places" ALTER "name" TYPE JSONB USING to_json("name")', {
        transaction,
      });

      await queryInterface.sequelize.query(
        'ALTER TABLE "places" ALTER "name_slug" TYPE JSONB USING to_json("name_slug")',
        {
          transaction,
        },
      );

      for (const place of places) {
        await queryInterface.bulkUpdate(
          'places',
          { name: { pl: place.name, en: '', ua: '' }, name_slug: { pl: place.name_slug, en: '', ua: '' } },
          { id: place.id },
          { transaction },
        );
      }

      await queryInterface.changeColumn(
        'places',
        'name',
        {
          type: Sequelize.JSONB,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'places',
        'name_slug',
        {
          type: Sequelize.JSONB,
          allowNull: false,
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [places] = await queryInterface.sequelize.query(`select * from "places"`, { transaction });

      await queryInterface.changeColumn(
        'places',
        'name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'places',
        'name_slug',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      for (const place of places) {
        await queryInterface.bulkUpdate(
          'places',
          { name: place.name.pl, name_slug: place.name_slug.pl },
          { id: place.id },
          { transaction },
        );
      }

      await queryInterface.changeColumn(
        'places',
        'name',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'places',
        'name_slug',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );
    });
  },
};

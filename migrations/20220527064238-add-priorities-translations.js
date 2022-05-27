'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [priorities] = await queryInterface.sequelize.query(`select * from "priorities"`, { transaction });

      await queryInterface.removeColumn('priorities', 'name_pl', {
        transaction,
      });

      await queryInterface.removeColumn('priorities', 'name_en', {
        transaction,
      });

      await queryInterface.removeColumn('priorities', 'name_ua', {
        transaction,
      });

      await queryInterface.addColumn('priorities', 'name', { type: Sequelize.JSONB, allowNull: true }, { transaction });

      for (const priority of priorities) {
        await queryInterface.bulkUpdate(
          'priorities',
          { name: { pl: priority.name_pl, en: priority.name_en, ua: priority.name_ua } },
          { id: priority.id },
          { transaction },
        );
      }

      await queryInterface.changeColumn(
        'priorities',
        'name',
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
      const [priorities] = await queryInterface.sequelize.query(`select * from "priorities"`, { transaction });

      await queryInterface.removeColumn('priorities', 'name', {
        transaction,
      });

      await queryInterface.addColumn(
        'priorities',
        'name_pl',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'priorities',
        'name_en',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'priorities',
        'name_ua',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      for (const priority of priorities) {
        await queryInterface.bulkUpdate(
          'priorities',
          { name_pl: priority.name.pl, name_en: priority.name.en, name_ua: priority.name.ua },
          { id: priority.id },
          { transaction },
        );
      }

      await queryInterface.changeColumn(
        'priorities',
        'name_pl',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'priorities',
        'name_en',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.changeColumn(
        'priorities',
        'name_ua',
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction },
      );
    });
  },
};

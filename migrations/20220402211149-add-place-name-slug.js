'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'places',
        'name_slug',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      const [places] = await queryInterface.sequelize.query(`select * from "places"`, { transaction });

      for (const place of places) {
        await queryInterface.bulkUpdate(
          'places',
          { name_slug: slugify(place.name) },
          { id: place.id },
          { transaction },
        );
      }

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

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('places', 'name_slug', {
        transaction,
      });
    });
  },
};

function slugify(text) {
  let normalizedText = text.toString().toLowerCase().trim();

  const sets = [
    { to: 'a', from: '[Ą]' },
    { to: 'c', from: '[Ć]' },
    { to: 'e', from: '[Ę]' },
    { to: 'l', from: '[Ł]' },
    { to: 'n', from: '[Ń]' },
    { to: 'o', from: '[Ó]' },
    { to: 's', from: '[Ś]' },
    { to: 'z', from: '[ŹŻ]' },
    { to: '-', from: "[·/_,:;'()]" },
  ];

  sets.forEach((set) => {
    normalizedText = normalizedText.replace(new RegExp(set.from, 'gi'), set.to);
  });

  return normalizedText
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^-a-zа-я0-9]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

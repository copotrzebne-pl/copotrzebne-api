export function slugify(text: string): string {
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
    { to: '-', from: "[·/_,:;']" },
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

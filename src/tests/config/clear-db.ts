export default async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await global.umzug.down({ to: 0 });
  } catch (error) {
    console.log('Failed to cleanup DB after tests: ', error);
    throw error;
  }
};

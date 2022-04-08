import { Sequelize } from 'sequelize';
import Umzug from 'umzug';
import { Options } from 'sequelize/types/sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

const databaseConfig: Options = {
  dialect: 'postgres',
  username: String(process.env.API_DB_USERNAME || ''),
  password: String(process.env.API_DB_PWD) || '',
  database: String(process.env.API_DB_DATABASE || ''),
  host: String(process.env.API_DB_HOST || ''),
  port: parseInt(process.env.API_DB_PORT || '0'),
  logging: false,
};

const createDatabase = async (sequelize: Sequelize): Promise<void> => {
  try {
    await sequelize.query(
      `CREATE DATABASE ${sequelize.getQueryInterface().quoteIdentifier(databaseConfig.database as string)}`,
    );
  } catch (error) {
    if (error instanceof Error && error.message !== `database "${databaseConfig.database}" already exists`) {
      throw new Error(`Failed to create DB for tests \n${error}`);
    }
  }
};

const migrateDatabase = async (sequelize: Sequelize): Promise<void> => {
  try {
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelize,
      },
      migrations: {
        params: [sequelize.getQueryInterface(), Sequelize],
        path: 'migrations',
        pattern: /\.js$/,
      },
    });

    await umzug.up();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.umzug = umzug;
  } catch (err) {
    throw new Error(`Failed to migrate DB before tests \nError: ${err}`);
  }
};

const seedSupplies = async (sequelize: Sequelize) => {
  await sequelize.query(
    `insert into "categories" ("name_pl","name_ua","name_en") values ('inne', 'another', 'інший');`,
  );
  const [result] = await sequelize.query(`SELECT "id" FROM "categories" LIMIT 1`);
  const idResult = result as { id: string }[];
  const categoryId = idResult[0].id;

  await sequelize.query(
    `INSERT INTO supplies ("name_pl", "name_ua", "name_en", "category_id")
           VALUES ('miód', 'мед', 'honey', '${categoryId}'), ('witaminy', 'вітаміни', 'vitamins', '${categoryId}')`,
  );
};
const seedPriorities = async (sequelize: Sequelize) => {
  await sequelize.query(
    `INSERT INTO "priorities" ("name_pl", "name_ua", "name_en", "importance")
           VALUES ('potrzebne', 'необхідний', 'needed', 1)`,
  );
};

module.exports = async () => {
  try {
    const sequelize = new Sequelize(databaseConfig);

    await createDatabase(sequelize);
    await migrateDatabase(sequelize);
    await seedSupplies(sequelize);
    await seedPriorities(sequelize);
  } catch (error) {
    console.error('Failed to migrate DB for tests', error);
    throw error;
  }
};

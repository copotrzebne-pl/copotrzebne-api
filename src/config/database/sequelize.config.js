const path = require('path');
const dotenv = require('dotenv');

const envFileName = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(__dirname, `../../../${envFileName}`) });

module.exports = {
  development: {
    dialect: 'postgres',
    username: process.env.API_DB_USERNAME,
    password: process.env.API_DB_PWD,
    database: process.env.API_DB_DATABASE,
    host: process.env.API_DB_HOST,
    port: process.env.API_DB_PORT,
  },
  test: {
    dialect: 'postgres',
    username: process.env.API_DB_USERNAME,
    password: process.env.API_DB_PWD,
    database: process.env.API_DB_DATABASE,
    host: process.env.API_DB_HOST,
    port: process.env.API_DB_PORT,
  },
  production: {
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

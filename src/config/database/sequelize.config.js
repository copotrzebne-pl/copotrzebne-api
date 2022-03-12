// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

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
    use_env_variable: 'DATABASE_URL',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
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

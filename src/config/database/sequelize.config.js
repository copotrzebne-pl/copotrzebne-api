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
    username: process.env.API_DB_USERNAME,
    password: process.env.API_DB_PWD,
    database: process.env.API_DB_DATABASE,
    host: process.env.API_DB_HOST,
    port: process.env.API_DB_PORT,
  },
};

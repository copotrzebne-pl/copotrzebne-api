const url = require('url');

const dbUrl = url.parse(process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/postgres', true);

module.exports = {
  development: {
    dialect: 'postgres',
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname,
    host: dbUrl.hostname,
    port: dbUrl.port,
  },
  test: {
    dialect: 'postgres',
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname,
    host: dbUrl.hostname,
    port: dbUrl.port,
  },
  production: {
    dialect: 'postgres',
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname,
    host: dbUrl.hostname,
    port: dbUrl.port,
  },
};

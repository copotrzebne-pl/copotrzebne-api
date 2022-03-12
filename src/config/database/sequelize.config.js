const url = require('url');

const dbUrl = url.parse(process.env.DATABASE_URL, true);

module.exports = {
  development: {
    dialect: 'postgres',
    username: dbUrl.auth.split(':')[0],
    password: dbUrl.auth.split(':')[1],
    database: dbUrl.pathname.split('/')[1],
    host: dbUrl.hostname,
    port: dbUrl.port,
  },
  test: {
    dialect: 'postgres',
    username: dbUrl.auth.split(':')[0],
    password: dbUrl.auth.split(':')[1],
    database: dbUrl.pathname.split('/')[1],
    host: dbUrl.hostname,
    port: dbUrl.port,
  },
  production: {
    dialect: 'postgres',
    username: dbUrl.auth.split(':')[0],
    password: dbUrl.auth.split(':')[1],
    database: dbUrl.pathname.split('/')[1],
    host: dbUrl.hostname,
    port: dbUrl.port,
  },
};

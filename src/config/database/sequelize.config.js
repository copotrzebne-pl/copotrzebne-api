const url = require('url');

module.exports = {
  development: {
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
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

# copotrzebne-api

This is the API for copotrzebne.pl

# important TODOS:

1. Prepare Docker for hosting on heroku
2. Configure Sequelize, so it can generate migration files based on models (currently must be done by hand)
3. Host the app

# Start the project

1. Copy `.env.dist` to `.env` and fill in env variables
2. Install node modules
```bash
$ yarn install
```
3. Run the app

# Running the app

```bash
# watch mode with dockerized or local database
$ yarn start:docker:db
$ yarn start:dev
```

# Sequelize

## About Sequelize with Nest.js

https://docs.nestjs.com/techniques/database#sequelize-integration

## Generating database migrations

In order to generate migration for Sequelize ORM sequelize-cli is required.
The cli is included in dev modules.
After creating a new entity run command to generate a new db migration.

```bash
npx sequelize-cli migration:generate --name <migration-name>
```

## Running migrations

```bash
$ dotenv sequelize-cli db:migrate
```

## Example of migration

how to add column to existing table
```javascript
    await queryInterface.addColumn('places', 'building_number', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
```

# Dockerized DB and Adminer

To login into the adminer use credentials from `.env`
Host is the name of the db service from docker-compose - postgres.

Adminer is hosted on http://localhost:8080

![Adminer login](readme/adminer-login.png)

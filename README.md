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


# Dockerized DB and Adminer

To login into the adminer use credentials from `.env`
Host is the name of the db service from docker-compose - postgres.

Adminer is hosted on http://localhost:8080

![Adminer login](readme/adminer-login.png)

# Infrastructure and deployment

GitHub Actions are used for CI/CD.

Heroku is used for hosting - two apps per pipeline: beta and production.

## Continous Integration

`main.yml` workflow run test on each branch.

## Release to beta

`relsease.yml` workflow push app to Heroku using GIT if test sucessed on branch `master`.

## Promotion to production

App need to be promoted manually on Heroku, pipeline: `api.copotrzebne.pl`

## DB

PostgreSQL from Heroku is used.

`DATABASE_URL` contains connection string.

The value of `DATABASE_URL` config var can change at any time.
Do not rely on this value either inside or outside your Heroku app.

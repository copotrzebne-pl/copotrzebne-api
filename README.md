# CoPotrzebne API

This is the API for copotrzebne.pl

## Start the project

1. Copy `.env.dist` to `.env` and fill in env variables

    ```conf
    NODE_ENV=development
    PORT=3000
    API_DB_HOST=localhost
    API_DB_PORT=15432
    API_DB_USERNAME=postgres
    API_DB_PWD=postgres
    API_DB_DATABASE=postgres
    ```

2. Install node modules

    ```bash
    $ yarn install
    ```

3. Run the app

## Running the app

```bash
# watch mode with dockerized or local database
$ yarn start:docker:db
$ yarn start:dev
```

## Sequelize

### About Sequelize with Nest.js

https://docs.nestjs.com/techniques/database#sequelize-integration

### Creating database

```bash
yarn db:create
```

### Dropping database

```bash
yarn db:drop
```

### Generating database migrations

In order to generate migration for Sequelize ORM sequelize-cli is required.
The cli is included in dev modules.
After creating a new entity run command to generate a new db migration.

```bash
npx sequelize-cli migration:generate --name <migration-name>
```

### Running migrations

```bash
$ yarn db:migrate
```

### Example of migration

how to add column to existing table
```javascript
    await queryInterface.addColumn('places', 'building_number', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
```

## Dockerized DB and Adminer

To login into the adminer use credentials from `.env`
Host is the name of the db service from docker-compose - postgres.

Adminer is hosted on http://localhost:8080

![Adminer login](readme/adminer-login.png)

### How to connect to DB on AWS

To connect DB on AWS you need to create a Proxy using Convox CLI ([how to install and configure Convox CLI](https://github.com/copotrzebne-pl/infrastructure/wiki/Convox#convox-cli)).

Example:

```bash
convox resources proxy database -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro --port 65432
convox resources proxy database -a api-copotrzebne-pl -r copotrzebne-pl/pro --port 65432
```

To get username and password run command:

```bash
convox resources  -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro
convox resources  -a api-copotrzebne-pl -r copotrzebne-pl/pro
```

Read more: [Accessing Resources](https://docsv2.convox.com/management/resources)

### How to import or export data from DB

#### Pre requirements:

You need to have access to commands:

* `pg_dump` - to dump data
* `pg_restore` - to import data

On MAC you can install both commands using brew:

```bash
brew install libpq
```

#### How to dump DB from PRO

Create tunnel to database in Terminal#1.

```bash
convox resources proxy database -a api-copotrzebne-pl -r copotrzebne-pl/pro --port 65432
```

Using Terminal#2 dump database to a file:

```bash
pg_dump -U app -W -F t  app -p 65432 -h localhost > file_name
```

#### How to import data to local DB

Run command:

```bash
yarn db:import file_name
```

#### How to import data to Dev DB

Create tunnel to database in Terminal#1.

```bash
convox resources proxy database -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro --port 55432
```

Using Terminal #2 import data to DB on DEV:

```bash
pg_restore -d app file_name -c -U app -p 55432 -h localhost --no-owner  --no-privileges
```

## Health checks

Health check are implemented using [Terminus](https://github.com/nestjs/terminus)
is available on path `/health`.

Read more:

* [Healthcheck (Terminus)](https://docs.nestjs.com/recipes/terminus)
* [NestJS Health Check with Terminus – HTTP, DB, Redis & Custom Checks](https://progressivecoder.com/nestjs-health-check-terminus/)

## Infrastructure and deployment

GitHub Actions are used for CI/CD.

Convox is used to host applications - one rack created on AWS pro to minimise costs (apps for pro and dev are run on
rack `copotrzebne-pl/pro`).

API is covered by Cloud Front responsible for caching.

Database is created by Convox using [Resources](https://docsv2.convox.com/application/resources) - is defined
in [`convox.yml`](./convox.yml) file

Configuration per environment is kept as [Environment variables](https://docsv2.convox.com/application/environment) -
you can edit them using command `convox env edit`:

- `DB_INSTANCE_TYPE`
- `DB_STORAGE`
- `DB_ENCRYPTED` - disabled for all envs to minimize costs
- `DB_MULTI_AZ` - enabled only for production to minimize costs

### Continuous Integration

`main.yml` workflow run test on each branch.

### Deployment to Convox

Workflows:

* `deploy-dev.yml` is responsible for deployment to Dev Convox Rack.
* `deploy-pro.yml` is responsible for deployment to Pro Convox Rack.

Docker image is build by Convox on AWS.

During deployment, when docker image was build, DB migration is run by Convox as one time task.
To achieve that a few additional files are added to Dockerimage (more details in `Dockerfile`).

### Logs

To display logs use one of command in CLI:

```bash
convox logs -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro
convox logs -a api-copotrzebne-pl -r copotrzebne-pl/pro
```

### Scaling

App could be scaled manually using Convox CLI: `convox scale`.

Example:

```bash
# To change number of instances
convox scale web --count <count>  -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro

# To change CPU
convox scale web --cpu <cpu>  -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro

# To change memory
convox scale web  --memory <memory>  -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro

# To change all values at once
convox scale web --count <count>  --cpu <cpu> --memory <memory>  -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro
```

`Scale` section from `convox.yml` is responsible only for initial scaling during app creation.
To scale app please use CLI described above.

#### Secrets and Configuration

Secrets and configuration are manage by [Convox](https://docsv2.convox.com/application/environment).

To edit secrets you can use Convox CLI:

```bash
convox env edit -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro
convox env edit -a api-copotrzebne-pl -r copotrzebne-pl/pro
```

#### AWS Permissions

Permission to AWS resources are set by IAM Policy document created by infrastructure.

Convox is responsible for instance configuration - app does not have to get any dedicated permissions
(key, secret, ...), allowed by policy AWS resources could just be accessed.

Because apps are hosted on the same AWS account (the same Convox rack) for both environemts (dev and pro)
the same policy document is used:

* `arn:aws:iam::432456784825:policy/terraform-20220423053450753600000001`

To set `IamPolicy` run command: 

```bash
convox apps params set IamPolicy=${IamPolicy} -a dev-api-copotrzebne-pl -r copotrzebne-pl/pro
convox apps params set IamPolicy=${IamPolicy} -a api-copotrzebne-pl -r copotrzebne-pl/pro
```

Read more: [Convox \ App Parameters](https://docsv2.convox.com/reference/app-parameters#iampolicy)

### Transactions

We are using [Sequelize managed transactions](https://sequelize.org/master/manual/transactions.html)
and the standard flow looks like this:
- we inject global sequelize instance into controller 
- we open new sequelize transaction inside controller method

```typescript
await this.sequelize.transaction(async (transaction) => {
  /* ... */
});
```

- now we can write all business logic inside the above callback, and it will be wrapped inside the transaction
- every service method that is operating on database should accept transaction as first parameter
- we can now use as many services as we want inside the controller and in case of any error, the whole transaction will roll back automatically

## Testing

### E2E tests

To run e2e tests first you need to run test db container:

```shell
$ yarn start:docker:test-db
```

When db is running, you can run e2e tests many times. Tested api connects to the test db.
Before tests migrations are runned.
After tests db migrations are reverted to clean the db.

Run tests with the command:

```shell
$ yarn test:e2e
```

Add E2E tests files into src/tests/<module>/

### Unit testing

To run unit tests:

```shell
$ yarn test
```

To write unit test, name the file as <something-tested>.spec.ts.
Add unit tests files into src/<module>/<functionality>/

## User Roles

### Admin

Should have access to everything

### Service

Have access to fetch data only - for generating static frontend

### Place Manager

Can access only his own places

## Authorization

To authorize user, use AuthGuard and define allowed roles using SetMetaData.
AuthGuard verifies the session and roles.

```javascript
class SomeController {
   @SetMetadata(MetadataKey.ALLOWED_ROLES, [UserRole.PLACE_MANAGER, UserRole.ADMIN])
   @UseGuards(AuthGuard)
   @Get('/') methodForGet() {}
}
```

To authorize user pass JWT via authorization header.
Header has a following content: `Bearer <jwt_token>`

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcrypt';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { UserRole } from '../../../users/types/user-role.enum';
import { retryWithSleep } from '../../test-helpers/retry-with-sleep';

describe('AuthenticationController (e2e)', () => {
  describe('POST /login', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;

    const login = 'user@schibsted.com';
    const password = 'strong!pass';
    let hashedPassword: string;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      app.useGlobalPipes(new ValidationPipe());

      await app.init();
      dbHelper = new DatabaseHelper(module);

      hashedPassword = await hash(password, process.env.API_PASSWORD_SALT || '');
    });

    afterAll(async () => {
      await app.close();
    });

    afterEach(async () => {
      await dbHelper.usersRepository.destroy({ where: { login } });
    });

    it('returns jwt for correct credentials', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.PLACE_MANAGER });

      // WHEN
      const { body } = await request(app.getHttpServer())
        .post('/login')
        .send({
          login,
          password,
        })
        .expect(201);

      // THEN
      expect(body).toEqual({ jwt: expect.any(String) });
      done();
    });

    it('returns 403 for known user with wrong password', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({
        login,
        hashedPassword,
        role: UserRole.PLACE_MANAGER,
      });

      // WHEN
      const { body } = await request(app.getHttpServer())
        .post('/login')
        .send({
          login,
          password: '000000',
        })
        .expect(403);

      // THEN
      expect(body).toEqual({ message: 'FAILED_TO_LOGIN', statusCode: 403 });
      done();
    });

    it('returns 403 for unknown user', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer())
        .post('/login')
        .send({
          login: 'test@schibsted.com',
          password: '123456',
        })
        .expect(403);

      // THEN
      expect(body).toEqual({ message: 'FAILED_TO_LOGIN', statusCode: 403 });
      done();
    });

    it('returns 400 for invalid post body', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer()).post('/login').expect(400);

      // THEN
      expect(body).toEqual({
        error: 'Bad Request',
        message: [
          'login should not be empty',
          'login must be a string',
          'password should not be empty',
          'password must be a string',
        ],
        statusCode: 400,
      });
      done();
    });

    it('saves journal log after login', async (done) => {
      // GIVEN
      const uniqueLogin = 'unique_for_login';
      await dbHelper.usersRepository.create({
        login: uniqueLogin,
        hashedPassword,
        role: UserRole.PLACE_MANAGER,
      });

      // WHEN
      await request(app.getHttpServer()).post('/login').send({
        login: uniqueLogin,
        password,
      });

      await retryWithSleep(async () => {
        return (await dbHelper.journalsRepository.count({ where: { user: uniqueLogin } })) === 1;
      });

      const [journal] = await dbHelper.journalsRepository.findAll({ where: { user: uniqueLogin } });

      // THEN
      expect(journal.toJSON()).toMatchObject({
        action: 'login',
        createdAt: expect.any(Date),
        details: null,
        id: expect.any(String),
        user: uniqueLogin,
      });

      done();
    });
  });
});

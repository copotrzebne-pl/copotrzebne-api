import request from 'supertest';
import { hash } from 'bcrypt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRole } from '../../../users/types/user-role.enum';
import { retryWithSleep } from '../../test-helpers/retry-with-sleep';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { AppModule } from '../../../app.module';
import { Place } from '../../../places/models/place.model';
import { PlaceState } from '../../../places/types/place.state.enum';

// TODO: add test which checks that demands are removed (seed supplies and priorities before all tests)
describe('PlacesController (e2e)', () => {
  describe('DELETE /places/:id/demands', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;

    const login = 'user2022';
    const password = 'strong-pass';
    let hashedPassword: string;

    let place: Place;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      app.useGlobalPipes(new ValidationPipe());

      await app.init();
      dbHelper = new DatabaseHelper(module);

      hashedPassword = await hash(password, process.env.API_PASSWORD_SALT || '');

      place = await dbHelper.placeRepository.create({
        name: 'Super org sp zoo',
        city: 'Gdansk',
        street: 'Pawia',
        buildingNumber: '5a',
        nameSlug: 'super-org',
        state: PlaceState.ACTIVE,
        lastUpdatedAt: new Date(),
      });
    });

    afterAll(async () => {
      await dbHelper.placeRepository.destroy({ where: { id: place.id } });
      await app.close();
    });

    afterEach(async () => {
      await dbHelper.usersRepository.destroy({ where: { login } });
    });

    it('returns 403 when using without credentials', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer()).delete(`/places/${place.id}/demands`).expect(403);

      // THEN
      expect(body).toEqual({ message: 'Forbidden resource', statusCode: 403 });
      done();
    });

    it('returns 403 if user cannot manage place', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.PLACE_MANAGER });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password }).expect(201);

      const { body } = await request(app.getHttpServer())
        .delete(`/places/${place.id}/demands`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(403);

      // THEN
      expect(body).toEqual({ message: 'METHOD_FORBIDDEN', statusCode: 403 });
      done();
    });

    it('returns 204 for admin who is not assigned to place', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.ADMIN });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password }).expect(201);

      const { body } = await request(app.getHttpServer())
        .delete(`/places/${place.id}/demands`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(204);

      expect(body).toEqual({});

      done();
    });

    it('returns 204 for assigned place manager', async (done) => {
      // GIVEN
      const user = await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.PLACE_MANAGER });
      await dbHelper.usersPlacesRepository.create({ userId: user.id, placeId: place.id });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password }).expect(201);

      const { body } = await request(app.getHttpServer())
        .delete(`/places/${place.id}/demands`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(204);

      // THEN
      expect(body).toEqual({});

      done();
    });

    it('logs to journal after success', async (done) => {
      // GIVEN
      const uniqueLogin = 'unique_login_delete_demands';
      const user = await dbHelper.usersRepository.create({
        login: uniqueLogin,
        hashedPassword,
        role: UserRole.PLACE_MANAGER,
      });
      await dbHelper.usersPlacesRepository.create({ userId: user.id, placeId: place.id });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login: uniqueLogin, password }).expect(201);

      await request(app.getHttpServer())
        .delete(`/places/${place.id}/demands`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(204);

      await retryWithSleep(async () => {
        return (await dbHelper.journalsRepository.count({ where: { user: uniqueLogin } })) === 2;
      });

      const [journal] = await dbHelper.journalsRepository.findAll({
        where: { action: 'delete_all_demands', user: uniqueLogin },
      });

      // THEN
      expect(journal.toJSON()).toMatchObject({
        action: 'delete_all_demands',
        user: uniqueLogin,
        details: `All demands removed from place ${place.id}`,
        id: expect.any(String),
        createdAt: expect.any(Date),
      });

      done();
    });
  });
});

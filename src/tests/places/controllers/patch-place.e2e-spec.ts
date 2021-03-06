import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcrypt';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { UserRole } from '../../../users/types/user-role.enum';
import { Place } from '../../../places/models/place.model';
import { retryWithSleep } from '../../test-helpers/retry-with-sleep';
import { PlaceState } from '../../../places/types/place.state.enum';

describe('PlacesController (e2e)', () => {
  describe('PATCH /places/:id', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;
    const login = 'user123';
    const password = 'superpass111';
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
        name: { pl: 'Patched org PL', en: 'Patched org EN', ua: 'Patched org UA' },
        city: 'Gdansk',
        street: 'Pawia',
        buildingNumber: '5a',
        nameSlug: 'my-org',
        state: PlaceState.ACTIVE,
        bankAccount: '78 1370 1011 7522 3905 2498 0200',
        bankAccountDescription: 'Payment title: Some title',
        resources: null,
        lastUpdatedAt: '2022-04-09T00:00:00.000Z',
      });
    });

    afterAll(async () => {
      await app.close();
    });

    afterEach(async () => {
      // remove user so it can be created with other role
      await dbHelper.usersRepository.destroy({ where: { login } });
    });

    it('returns 200 for assigned PLACE_MANAGER', async (done) => {
      // GIVEN
      const user = await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.PLACE_MANAGER });
      await dbHelper.usersPlacesRepository.create({ placeId: place.id, userId: user.id });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password });

      const { body } = await request(app.getHttpServer())
        .patch(`/places/${place.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .send({
          name: { pl: 'New Name PL', en: '', ua: '' },
        })
        .expect(200);

      // THEN
      expect(body).toMatchObject({
        apartment: null,
        buildingNumber: '5a',
        city: 'Gdansk',
        additionalDescription: null,
        createdAt: expect.any(String),
        email: null,
        id: expect.any(String),
        lastUpdatedAt: null,
        latitude: null,
        longitude: null,
        name: { pl: 'New Name PL', en: '', ua: '' },
        nameSlug: { pl: 'new-name-pl', en: '', ua: '' },
        phone: null,
        street: 'Pawia',
        updatedAt: expect.any(String),
        workingHours: null,
        bankAccount: '78 1370 1011 7522 3905 2498 0200',
        bankAccountDescription: 'Payment title: Some title',
        resources: null,
        placeLink: null,
      });

      done();
    });

    it('returns 200 for every ADMIN', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.ADMIN });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password });

      const { body } = await request(app.getHttpServer())
        .patch(`/places/${place.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .send({
          name: { pl: 'New Name PL', en: 'New Name EN', ua: 'New Name UA' },
          apartment: '2',
          street: 'Long street',
          additionalDescription: 'Test description',
          city: 'Krakow',
          email: 'email',
          latitude: 11,
          longitude: 12,
          phone: '123',
          workingHours: 'From 9 to 10',
          lastUpdatedAt: '2022-04-08T21:44:00.940Z',
          bankAccount: '78 1370 1011 7522 3905 2498 0200',
          bankAccountDescription: 'Payment title: Title',
          resources: 'Some resources',
        })
        .expect(200);

      // THEN
      expect(body).toEqual({
        apartment: '2',
        buildingNumber: '5a',
        city: 'Krakow',
        additionalDescription: 'Test description',
        createdAt: expect.any(String),
        email: 'email',
        id: expect.any(String),
        lastUpdatedAt: null,
        latitude: '11',
        longitude: '12',
        name: { pl: 'New Name PL', en: 'New Name EN', ua: 'New Name UA' },
        nameSlug: { pl: 'new-name-pl', en: 'new-name-en', ua: 'new-name-ua' },
        phone: '123',
        street: 'Long street',
        updatedAt: expect.any(String),
        workingHours: 'From 9 to 10',
        bankAccount: '78 1370 1011 7522 3905 2498 0200',
        bankAccountDescription: 'Payment title: Title',
        resources: 'Some resources',
        priority: 0,
        state: 1,
        placeLink: null,
        transitions: [
          {
            endState: 2,
            name: 'DEACTIVATE',
            startState: 1,
          },
        ],
      });

      done();
    });

    it('returns 403 for requests without credentials', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer()).patch(`/places/123`).expect(403);

      // THEN
      expect(body).toEqual({ message: 'Forbidden resource', statusCode: 403 });

      done();
    });

    // TODO: look deeper what kind of error is returned and if it works as intended
    xit('returns 400 for invalid body', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.ADMIN });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password });

      const { body } = await request(app.getHttpServer())
        .patch(`/places/123`)
        .set({ authorization: `Bearer ${jwt}` })
        .send({})
        .expect(400);

      // THEN
      expect(body).toEqual({ message: [], statusCode: 400 });

      done();
    });

    it('logs in journal on success', async (done) => {
      // GIVEN
      const uniqueLogin = 'unique_login_for_patch_place';
      const user = await dbHelper.usersRepository.create({
        login: uniqueLogin,
        hashedPassword,
        role: UserRole.PLACE_MANAGER,
      });
      await dbHelper.usersPlacesRepository.create({ userId: user.id, placeId: place.id });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login: uniqueLogin, password });

      await request(app.getHttpServer())
        .patch(`/places/${place.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(200);

      // THEN
      await retryWithSleep(async () => {
        return (await dbHelper.journalsRepository.count({ where: { user: uniqueLogin, action: 'edit_place' } })) === 1;
      });

      const [journal] = await dbHelper.journalsRepository.findAll({
        where: { user: uniqueLogin, action: 'edit_place' },
      });

      expect(journal.toJSON()).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(Date),
        action: 'edit_place',
        user: uniqueLogin,
        details: `Place ${place.id} updated by user with role place_manager`,
      });

      done();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcrypt';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { UserRole } from '../../../users/types/user-role.enum';
import { Place } from '../../../places/models/place.model';

describe('PlacesController (e2e)', () => {
  describe('DELETE /places/:id', () => {
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
    });

    beforeEach(async () => {
      place = await dbHelper.placeRepository.create({
        name: 'My org',
        city: 'Gdansk',
        street: 'Pawia',
        buildingNumber: '5a',
        nameSlug: 'my-org',
      });
    });

    afterAll(async () => {
      await app.close();
    });

    afterEach(async () => {
      await dbHelper.usersRepository.destroy({ where: { login } });
      await dbHelper.placeRepository.destroy({ where: { id: place.id } });
    });

    it('returns 204 and removes place', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.ADMIN });
      const placesCount = await dbHelper.placeRepository.count();

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password });

      const { body } = await request(app.getHttpServer())
        .delete(`/places/${place.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(204);

      const newPlacesCount = await dbHelper.placeRepository.count();
      const deletedPlace = await dbHelper.placeRepository.findByPk(place.id);

      // THEN
      expect(body).toEqual({});
      expect(newPlacesCount).toEqual(placesCount - 1);
      expect(deletedPlace).toBe(null);

      done();
    });

    it('returns 403 for requests without credentials', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer()).delete(`/places/${place.id}`).expect(403);

      // THEN
      expect(body).toEqual({ message: 'Forbidden resource', statusCode: 403 });

      done();
    });

    it('returns 403 for PLACE_MANAGER role', async (done) => {
      // GIVEN
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.PLACE_MANAGER });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password });

      const { body } = await request(app.getHttpServer())
        .delete(`/places/${place.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(403);

      // THEN
      expect(body).toEqual({ message: 'Forbidden resource', statusCode: 403 });

      done();
    });

    it('returns 403 for SERVICE role', async (done) => {
      // GIVEN
      // create place manager
      await dbHelper.usersRepository.create({ login, hashedPassword, role: UserRole.SERVICE });

      // WHEN
      const {
        body: { jwt },
      } = await request(app.getHttpServer()).post(`/login`).send({ login, password });

      const { body } = await request(app.getHttpServer())
        .delete(`/places/${place.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(403);

      // THEN
      expect(body).toEqual({ message: 'Forbidden resource', statusCode: 403 });

      done();
    });
  });
});

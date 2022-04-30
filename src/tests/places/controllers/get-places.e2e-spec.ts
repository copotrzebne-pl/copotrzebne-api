import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { PlaceState } from '../../../places/types/place.state.enum';
import { PlaceTransitionName } from '../../../places/types/place.transition-name.enum';

describe('PlacesController (e2e)', () => {
  describe('GET /places', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      app.useGlobalPipes(new ValidationPipe());

      await app.init();
      dbHelper = new DatabaseHelper(module);

      dbHelper.placeRepository.destroy({ where: {} });
    });

    afterAll(async () => {
      await app.close();
    });

    it('returns an empty list of places', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer()).get('/places').expect(200);

      // THEN
      expect(body).toEqual([]);
      done();
    });

    it('returns all active places', async (done) => {
      // GIVEN
      const place = await dbHelper.placeRepository.create({
        name: 'ZHP Test',
        city: 'Krakow',
        street: 'Pawia',
        buildingNumber: '5a',
        apartment: '1',
        additionalDescription: 'Test description',
        createdAt: '2022-03-26T15:36:50.650Z',
        updatedAt: '2022-04-03T08:06:21.097Z',
        email: 'test-email@email.com',
        latitude: 56,
        longitude: 58,
        phone: '888-111-222',
        workingHours: 'Codziennie 6:30-23:30',
        nameSlug: 'zhp-test',
        state: PlaceState.ACTIVE,
        lastUpdatedAt: '2022-04-08T21:44:00.940Z',
        bankAccount: '78 1370 1011 7522 3905 2498 0200',
      });

      // WHEN
      const { body } = await request(app.getHttpServer()).get('/places').expect(200);

      // THEN
      expect(body).toEqual([
        {
          apartment: '1',
          buildingNumber: '5a',
          city: 'Krakow',
          additionalDescription: 'Test description',
          createdAt: body[0].createdAt,
          email: 'test-email@email.com',
          id: body[0].id,
          lastUpdatedAt: '2022-04-08T21:44:00.940Z',
          latitude: '56',
          longitude: '58',
          name: 'ZHP Test',
          phone: '888-111-222',
          street: 'Pawia',
          updatedAt: body[0].updatedAt,
          workingHours: 'Codziennie 6:30-23:30',
          bankAccount: '78 1370 1011 7522 3905 2498 0200',
          nameSlug: 'zhp-test',
          demands: [],
          priority: 0,
          state: 1,
          transitions: [
            { startState: PlaceState.ACTIVE, endState: PlaceState.INACTIVE, name: PlaceTransitionName.DEACTIVATE },
          ],
        },
      ]);

      expect(typeof body[0].createdAt).toBe('string');
      expect(typeof body[0].updatedAt).toBe('string');
      expect(typeof body[0].id).toBe('string');

      await dbHelper.placeRepository.destroy({ where: { id: place.id } });
      done();
    });
  });
});

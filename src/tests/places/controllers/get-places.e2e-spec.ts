import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { PlaceState } from '../../../places/types/place.state.enum';

describe('PlacesController (e2e)', () => {
  describe('GET /places', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      await app.init();
      dbHelper = new DatabaseHelper(module);
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
      await dbHelper.placeRepository.create({
        name: 'ZHP Test',
        city: 'Krakow',
        street: 'Pawia',
        buildingNumber: '5a',
        apartment: '1',
        comment: 'Test comment',
        createdAt: '2022-03-26T15:36:50.650Z',
        updatedAt: '2022-04-03T08:06:21.097Z',
        email: 'test-email@email.com',
        latitude: 56,
        longitude: 58,
        phone: '888-111-222',
        workingHours: 'Codziennie 6:30-23:30',
        nameSlug: 'zhp-test',
        state: 1,
      });

      // WHEN
      const { body } = await request(app.getHttpServer()).get('/places').expect(200);

      // THEN
      expect(body).toEqual([
        {
          apartment: '1',
          buildingNumber: '5a',
          city: 'Krakow',
          comment: 'Test comment',
          createdAt: body[0].createdAt,
          email: 'test-email@email.com',
          id: body[0].id,
          lastUpdatedAt: null,
          latitude: '56',
          longitude: '58',
          name: 'ZHP Test',
          phone: '888-111-222',
          street: 'Pawia',
          updatedAt: body[0].updatedAt,
          workingHours: 'Codziennie 6:30-23:30',
          nameSlug: 'zhp-test',
          demands: [],
          priority: 0,
          state: 1,
          transitions: [{ startState: PlaceState.ACTIVE, endState: PlaceState.INACTIVE, name: 'DEACTIVATE' }],
        },
      ]);

      expect(typeof body[0].createdAt).toBe('string');
      expect(typeof body[0].updatedAt).toBe('string');
      expect(typeof body[0].id).toBe('string');

      done();
    });
  });
});

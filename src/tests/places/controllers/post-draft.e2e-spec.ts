import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { PlaceState } from '../../../places/types/place.state.enum';

describe('PlacesController (e2e)', () => {
  describe('POST /places/draft', () => {
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
    });

    afterAll(async () => {
      await app.close();
    });

    it('creates place and user drafts for anonymous user', async (done) => {
      // GIVEN
      const payload = {
        name: 'Draft org',
        street: 'Pawia',
        buildingNumber: '22',
        city: 'Krakow',
        lastUpdatedAt: '2022-04-09T00:00:00.000Z',
        userEmail: 'adrian@schibsted.com',
      };
      const placesCount = await dbHelper.placeRepository.count();

      // WHEN
      const { body } = await request(app.getHttpServer()).post(`/places/draft`).send(payload).expect(201);

      const newPlacesCount = await dbHelper.placeRepository.count();
      const draftUserCount = await dbHelper.usersDraftsRepository.count({ where: { email: payload.userEmail } });

      // THEN
      expect(body).toMatchObject({
        apartment: null,
        buildingNumber: '22',
        city: 'Krakow',
        comment: null,
        createdAt: expect.any(String),
        email: null,
        id: expect.any(String),
        lastUpdatedAt: '2022-04-09T00:00:00.000Z',
        latitude: null,
        longitude: null,
        name: 'Draft org',
        nameSlug: 'draft-org',
        phone: null,
        street: 'Pawia',
        updatedAt: expect.any(String),
        workingHours: null,
        state: PlaceState.INACTIVE,
      });

      expect(newPlacesCount).toEqual(placesCount + 1);
      expect(draftUserCount).toEqual(1);

      done();
    });

    it('fails when input incorrect', async (done) => {
      // GIVEN
      const payload = { name: '' };

      // WHEN
      const { body } = await request(app.getHttpServer()).post(`/places/draft`).send(payload).expect(400);

      // THEN
      expect(body).toEqual({
        statusCode: 400,
        message: [
          'userEmail should not be empty',
          'userEmail must be an email',
          'name should not be empty',
          'city should not be empty',
          'city must be a string',
          'street should not be empty',
          'street must be a string',
          'buildingNumber should not be empty',
          'buildingNumber must be a string',
        ],
      });

      done();
    });
  });
});

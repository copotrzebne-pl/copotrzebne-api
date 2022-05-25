import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { PlaceState } from '../../../places/types/place.state.enum';
import { Place } from '../../../places/models/place.model';

describe('PlacesController (e2e)', () => {
  describe('GET /places/:id', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;
    let place: Place;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      app.useGlobalPipes(new ValidationPipe());

      await app.init();
      dbHelper = new DatabaseHelper(module);

      dbHelper.placeRepository.destroy({ where: {} });

      place = await dbHelper.placeRepository.create({
        name: { pl: 'ZHP Test PL', en: 'ZHP Test EN', ua: 'ZHP Test UA' },
        city: 'Krakow',
        street: 'Pawia',
        buildingNumber: '5a',
        apartment: '1',
        additionalDescription: 'Test description',
        email: 'test-email@email.com',
        latitude: 56,
        longitude: 58,
        phone: '888-111-222',
        workingHours: 'Codziennie 6:30-23:30',
        nameSlug: { pl: 'zhp-test-pl', en: 'zhp-test-en', ua: 'zhp-test-ua' },
        state: PlaceState.ACTIVE,
        lastUpdatedAt: '2022-04-08T21:44:00.940Z',
        bankAccount: '78 1370 1011 7522 3905 2498 0200',
        bankAccountDescription: 'Payment title: Title',
        resources: 'Resources',
      });

      await dbHelper.placeRepository.create({
        name: { pl: 'Other Place PL', en: 'Other Place EN', ua: 'Other Place UA' },
        city: 'Gdynia',
        street: 'Dluga',
        buildingNumber: '1',
        apartment: null,
        additionalDescription: 'Test description',
        email: 'test-22@email.com',
        latitude: null,
        longitude: null,
        phone: '888-221-222',
        workingHours: 'Codziennie 6:00-11:11',
        nameSlug: { pl: 'other-place-pl', en: 'other-place-en', ua: 'other-place-ua' },
        state: PlaceState.ACTIVE,
        lastUpdatedAt: '2022-04-08T21:44:00.940Z',
      });
    });

    afterAll(async () => {
      await app.close();
    });

    it('returns place by id', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer()).get(`/places/${place.id}`).expect(200);

      // THEN
      expect(body).toEqual({
        id: expect.any(String),
        name: { pl: 'ZHP Test PL', en: 'ZHP Test EN', ua: 'ZHP Test UA' },
        city: 'Krakow',
        street: 'Pawia',
        buildingNumber: '5a',
        apartment: '1',
        additionalDescription: 'Test description',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        email: 'test-email@email.com',
        latitude: '56',
        longitude: '58',
        phone: '888-111-222',
        workingHours: 'Codziennie 6:30-23:30',
        nameSlug: { pl: 'zhp-test-pl', en: 'zhp-test-en', ua: 'zhp-test-ua' },
        state: PlaceState.ACTIVE,
        lastUpdatedAt: '2022-04-08T21:44:00.940Z',
        transitions: [{ endState: 2, startState: 1, name: 'DEACTIVATE' }],
        priority: 0,
        bankAccount: '78 1370 1011 7522 3905 2498 0200',
        bankAccountDescription: 'Payment title: Title',
        resources: 'Resources',
        placeLink: null,
        demands: [],
        publicAnnouncements: [],
      });
      done();
    });

    it('returns place by slug', async (done) => {
      // WHEN
      const { body } = await request(app.getHttpServer()).get(`/places/other-place-pl`).expect(200);

      // THEN
      expect(body).toEqual({
        id: expect.any(String),
        name: { pl: 'Other Place PL', en: 'Other Place EN', ua: 'Other Place UA' },
        city: 'Gdynia',
        street: 'Dluga',
        buildingNumber: '1',
        apartment: null,
        additionalDescription: 'Test description',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        email: 'test-22@email.com',
        latitude: null,
        longitude: null,
        phone: '888-221-222',
        workingHours: 'Codziennie 6:00-11:11',
        nameSlug: { pl: 'other-place-pl', en: 'other-place-en', ua: 'other-place-ua' },
        state: PlaceState.ACTIVE,
        lastUpdatedAt: '2022-04-08T21:44:00.940Z',
        transitions: [{ endState: 2, startState: 1, name: 'DEACTIVATE' }],
        priority: 0,
        bankAccount: null,
        bankAccountDescription: null,
        resources: null,
        placeLink: null,
        demands: [],
        publicAnnouncements: [],
      });
      done();
    });
  });
});

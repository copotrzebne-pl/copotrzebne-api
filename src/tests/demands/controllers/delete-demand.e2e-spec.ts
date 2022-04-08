import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcrypt';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { UserRole } from '../../../users/types/user-role.enum';
import { Place } from '../../../places/models/place.model';
import { retryWithSleep } from '../../test-helpers/retry-with-sleep';
import { Supply } from '../../../supplies/models/supply.model';
import { Priority } from '../../../priorities/models/priority.model';
import { Demand } from '../../../demands/models/demand.model';
import { PlaceState } from '../../../places/types/place.state.enum';

describe('DemandsController (e2e)', () => {
  describe('DELETE /demands/:id', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;

    const login = 'user123';
    const password = 'superpass111';
    let hashedPassword: string;

    let place: Place;
    let demand: Demand;

    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      app.useGlobalPipes(new ValidationPipe());

      await app.init();
      dbHelper = new DatabaseHelper(module);

      hashedPassword = await hash(password, process.env.API_PASSWORD_SALT || '');

      const supply = (await dbHelper.suppliesRepository.findOne()) as Supply;
      const priority = (await dbHelper.prioritiesRepository.findOne()) as Priority;

      place = await dbHelper.placeRepository.create({
        name: 'Demand delete test org',
        city: 'Gdansk',
        street: 'Pawia',
        buildingNumber: '5a',
        nameSlug: 'demand-test-org',
        state: PlaceState.ACTIVE,
      });

      demand = await dbHelper.demandsRepository.create({
        placeId: place.id,
        priorityId: priority.id,
        supplyId: supply.id,
      });
    });

    afterAll(async () => {
      await dbHelper.placeRepository.destroy({ where: { id: place.id } });
      await app.close();
    });

    afterEach(async () => {
      await dbHelper.usersRepository.destroy({ where: { login } });
    });

    it('logs in journal on success', async (done) => {
      // GIVEN
      const uniqueLogin = 'delete_demand_unique_login';
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
        .delete(`/demands/${demand.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(204);

      // THEN
      await retryWithSleep(async () => {
        return (
          (await dbHelper.journalsRepository.count({ where: { user: uniqueLogin, action: 'delete_demand' } })) === 1
        );
      });

      const [journal] = await dbHelper.journalsRepository.findAll({
        where: { user: uniqueLogin, action: 'delete_demand' },
      });

      expect(journal.toJSON()).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(Date),
        action: 'delete_demand',
        user: uniqueLogin,
        details: `Demand ${demand.id} deleted from place ${place.id}`,
      });
      done();
    });
  });
});

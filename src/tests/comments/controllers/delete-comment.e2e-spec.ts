import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcrypt';

import { AppModule } from '../../../app.module';
import { DatabaseHelper } from '../../test-helpers/database-helper';
import { UserRole } from '../../../users/types/user-role.enum';
import { Place } from '../../../places/models/place.model';
import { Comment } from '../../../comments/models/comment.model';
import { retryWithSleep } from '../../test-helpers/retry-with-sleep';
import { PlaceState } from '../../../places/types/place.state.enum';

describe('CommentsController (e2e)', () => {
  describe('DELETE /comments/:id', () => {
    let app: INestApplication;
    let dbHelper: DatabaseHelper;

    const login = 'user123';
    const password = 'superpass111';
    let hashedPassword: string;

    let place: Place;
    let comment: Comment;

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
        name: 'Patch comment test',
        city: 'Gdansk',
        street: 'Pawia',
        buildingNumber: '5a',
        nameSlug: 'my-org',
        state: PlaceState.ACTIVE,
        lastUpdatedAt: new Date(),
        openingHours: [{ day: 1, openTime: '08:00', closeTime: '16:00' }],
      });
    });

    beforeEach(async () => {
      comment = await dbHelper.commentsRepository.create({
        placeId: place.id,
        title: 'Comment',
        message: 'New Comment',
        links: [],
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
      const uniqueLogin = 'delete_comment_unique_login';
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
        .delete(`/comments/${comment.id}`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(204);

      // THEN
      await retryWithSleep(async () => {
        return (
          (await dbHelper.journalsRepository.count({ where: { user: uniqueLogin, action: 'delete_comment' } })) === 1
        );
      });

      const [journal] = await dbHelper.journalsRepository.findAll({
        where: { user: uniqueLogin, action: 'delete_comment' },
      });

      expect(journal.toJSON()).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(Date),
        action: 'delete_comment',
        user: uniqueLogin,
        details: `Comment ${comment.id} removed from place ${place.id}`,
      });
      done();
    });
  });
});

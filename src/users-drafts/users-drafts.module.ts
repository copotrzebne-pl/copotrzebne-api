import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserDraft } from './models/user-draft.model';
import { UsersDraftsService } from './services/users-drafts.service';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([UserDraft])],
  providers: [UsersDraftsService],
  exports: [UsersDraftsService],
})
export class UsersDraftsModule {}

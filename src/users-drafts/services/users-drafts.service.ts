import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { UserDraft } from '../models/user-draft.model';

export class UsersDraftsService {
  constructor(
    @InjectModel(UserDraft)
    private readonly usersDraftsRepository: typeof UserDraft,
  ) {}

  public createUserDraft(
    transaction: Transaction,
    { email, placeId }: { email: string; placeId: string },
  ): Promise<UserDraft> {
    return this.usersDraftsRepository.create({ email, placeId }, { transaction });
  }
}

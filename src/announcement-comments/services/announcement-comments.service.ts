import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AnnouncementComment } from '../models/announcement-comment.model';
import { Transaction } from 'sequelize';
import NotFoundError from '../../error/not-found.error';
import { UpdateAnnouncementCommentDto } from '../dto/update-announcement-comment.dto';
import { CreateAnnouncementCommentDto } from '../dto/create-announcement-comment.dto';

@Injectable()
export class AnnouncementCommentsService {
  constructor(
    @InjectModel(AnnouncementComment)
    private readonly announcementCommentModel: typeof AnnouncementComment,
  ) {}

  public async getCommentById(transaction: Transaction, id: string): Promise<AnnouncementComment | null> {
    return await AnnouncementComment.findByPk(id, { transaction });
  }

  public async createComment(
    transaction: Transaction,
    commentDto: CreateAnnouncementCommentDto,
  ): Promise<AnnouncementComment | null> {
    return await this.announcementCommentModel.create({ ...commentDto }, { transaction });
  }

  public async updateComment(
    transaction: Transaction,
    id: string,
    commentDto: UpdateAnnouncementCommentDto,
  ): Promise<AnnouncementComment | null> {
    await this.announcementCommentModel.update({ ...commentDto }, { where: { id }, transaction });
    return await this.getCommentById(transaction, id);
  }

  public async deleteComment(transaction: Transaction, id: string): Promise<void> {
    const comment = await this.announcementCommentModel.findByPk(id, { transaction });

    if (!comment) {
      throw new NotFoundError(`COMMENT_NOT_FOUND`);
    }

    await comment.destroy({ transaction });
  }
}

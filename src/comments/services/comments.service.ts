import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../models/comment.model';
import { Transaction } from 'sequelize';
import { PlacesService } from '../../places/services/places.service';
import NotFoundError from '../../error/not-found.error';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
    private readonly placesService: PlacesService,
  ) {}

  public async getCommentById(transaction: Transaction, id: string): Promise<Comment | null> {
    return await Comment.findByPk(id, { transaction });
  }

  public async getCommentsForPlace(transaction: Transaction, placeId: string): Promise<Comment[]> {
    const place = await this.placesService.getPlaceById(transaction, placeId);

    if (!place) {
      throw new NotFoundError('PLACE_NOT_FOUND');
    }

    return await Comment.findAll({ where: { placeId }, order: [['updated_at', 'DESC']], transaction });
  }

  public async createComment(transaction: Transaction, commentDto: CreateCommentDto): Promise<Comment> {
    return await this.commentModel.create({ ...commentDto }, { transaction });
  }

  public async updateComment(
    transaction: Transaction,
    id: string,
    commentDto: UpdateCommentDto,
  ): Promise<Comment | null> {
    await this.commentModel.update({ ...commentDto }, { where: { id }, transaction });
    return await this.getCommentById(transaction, id);
  }

  public async deleteComment(transaction: Transaction, id: string): Promise<void> {
    const comment = await Comment.findByPk(id, { transaction });

    if (!comment) {
      throw new NotFoundError(`COMMENT_NOT_FOUND`);
    }

    await comment.destroy({ transaction });
  }
}

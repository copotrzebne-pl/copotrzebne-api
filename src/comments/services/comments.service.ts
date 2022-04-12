import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../models/comment.model';
import { Link } from '../../links/models/link.model';
import { Transaction } from 'sequelize';
import { PlacesService } from '../../places/services/places.service';
import NotFoundError from '../../error/not-found.error';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { LinkDto } from '../../links/dto/link.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentModel: typeof Comment,
    @InjectModel(Link)
    private readonly linkModel: typeof Link,
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

  public async createComment(transaction: Transaction, commentDto: CreateCommentDto): Promise<Comment | null> {
    const comment = await this.commentModel.create({ ...commentDto }, { transaction });
    if (commentDto.link) {
      await this.createLinkForComment(transaction, comment.id, commentDto.link);
    }

    return await this.getCommentById(transaction, comment.id);
  }

  public async updateComment(
    transaction: Transaction,
    id: string,
    commentDto: UpdateCommentDto,
  ): Promise<Comment | null> {
    await this.commentModel.update({ ...commentDto }, { where: { id }, transaction });

    if (commentDto.link) {
      const linkForComment = await this.getLinkForComment(transaction, id);

      if (linkForComment) {
        await this.updateLinkForComment(transaction, id, commentDto.link);
      } else {
        await this.createLinkForComment(transaction, id, commentDto.link);
      }
    }

    return await this.getCommentById(transaction, id);
  }

  public async deleteComment(transaction: Transaction, id: string): Promise<void> {
    const comment = await Comment.findByPk(id, { transaction });

    if (!comment) {
      throw new NotFoundError(`COMMENT_NOT_FOUND`);
    }

    await comment.destroy({ transaction });
  }

  private async createLinkForComment(transaction: Transaction, commentId: string, linkDto: LinkDto): Promise<Link> {
    return await this.linkModel.create({ ...linkDto, commentId }, { transaction });
  }

  private async updateLinkForComment(
    transaction: Transaction,
    commentId: string,
    linkDto: LinkDto,
  ): Promise<Link | null> {
    await this.linkModel.update({ ...linkDto }, { where: { commentId }, transaction });
    return await this.getLinkForComment(transaction, commentId);
  }

  private async getLinkForComment(transaction: Transaction, commentId: string): Promise<Link | null> {
    return await this.linkModel.findOne({ where: { commentId }, transaction });
  }
}

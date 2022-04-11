import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comments/models/comment.model';

@Table({ tableName: 'links', underscored: true })
export class Link extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.STRING })
  homepage!: string;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.STRING })
  facebook!: string;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.STRING })
  signup!: string[];

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  additional!: string[];

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Comment)
  commentId!: string;

  @BelongsTo(() => Comment)
  comment!: Comment;
}

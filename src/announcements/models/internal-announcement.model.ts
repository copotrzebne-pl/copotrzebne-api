import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../../places/models/place.model';
import { AnnouncementComment } from '../../announcement-comments/models/announcement-comment.model';

@DefaultScope(() => ({
  include: [AnnouncementComment],
}))
@Table({ tableName: 'internal_announcements', underscored: true })
export class InternalAnnouncement extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.STRING })
  title!: string;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.STRING })
  message!: string;

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.STRING })
  contactInfo!: string | null;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.DATE })
  startDate!: Date | null;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.DATE })
  endDate!: Date | null;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string;

  @BelongsTo(() => Place)
  place!: Place;

  @HasMany(() => AnnouncementComment)
  announcementComments!: AnnouncementComment[];
}

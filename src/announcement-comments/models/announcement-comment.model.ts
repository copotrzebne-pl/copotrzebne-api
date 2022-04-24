import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { InternalAnnouncement } from '../../announcements/models/internal-announcement.model';

@Table({ tableName: 'announcement_comments', underscored: true })
export class AnnouncementComment extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  message!: string;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => InternalAnnouncement)
  internalAnnouncementId!: string;

  @BelongsTo(() => InternalAnnouncement)
  internalAnnouncement!: InternalAnnouncement;
}

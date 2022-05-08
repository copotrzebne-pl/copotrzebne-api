import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../../places/models/place.model';

@Table({ tableName: 'public_announcements', underscored: true })
export class PublicAnnouncement extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.STRING })
  title!: string | null;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.STRING })
  message!: string;

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.STRING })
  contactInfo!: string | null;

  @ApiProperty()
  @Column({ type: DataType.DATE })
  createdAt!: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE })
  updatedAt!: Date;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string;

  @BelongsTo(() => Place)
  place!: Place;
}

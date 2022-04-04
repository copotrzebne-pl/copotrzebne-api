import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../../places/models/place.model';

@Table({ tableName: 'opening_hours', underscored: true, timestamps: false })
export class OpeningHours extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.INTEGER })
  day!: number;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING(5), validate: { is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ } })
  openTime!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING(5), validate: { is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ } })
  closeTime!: string;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: true, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string;

  @ApiProperty({ type: () => Place, nullable: false })
  @BelongsTo(() => Place)
  place!: Place;
}

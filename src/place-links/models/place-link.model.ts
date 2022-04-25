import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../../places/models/place.model';

@Table({ tableName: 'place_links', underscored: true, timestamps: false })
export class PlaceLink extends Model {
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
  signup!: string;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.STRING })
  fundraising!: string;

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string;

  @BelongsTo(() => Place)
  place!: Place;
}

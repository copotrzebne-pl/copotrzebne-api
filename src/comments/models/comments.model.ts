import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../../places/models/places.model';

@Table({ tableName: 'comments', underscored: true })
export class Comment extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  title!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  message!: string;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  links!: string[];

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string | null;

  @ApiProperty({ type: Place, nullable: true })
  @BelongsTo(() => Place)
  place!: Place | null;
}

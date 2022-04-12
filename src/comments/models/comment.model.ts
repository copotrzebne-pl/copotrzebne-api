import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasOne,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Place } from '../../places/models/place.model';
import { Link } from '../../links/models/link.model';

@DefaultScope(() => ({ include: Link }))
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

  @ApiProperty({ type: 'string', nullable: false })
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string;

  @BelongsTo(() => Place)
  place!: Place;

  @HasOne(() => Link)
  link!: Link;
}

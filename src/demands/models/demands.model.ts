import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { Supply } from '../../supplies/models/supplies.model';
import { Priority } from '../../priorities/models/priorities.model';
import { Place } from '../../places/models/places.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'demands', underscored: true })
export class Demand extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.STRING })
  comment!: string | null;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Supply)
  supplyId!: string;

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.UUID })
  @ForeignKey(() => Priority)
  priorityId!: string | null;

  @ApiProperty()
  @Column({ type: DataType.DATE })
  createdAt!: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE })
  updatedAt!: Date;

  @ApiProperty({ type: Place, nullable: true })
  @BelongsTo(() => Place)
  place!: Place | null;

  @ApiProperty({ type: Supply, nullable: true })
  @BelongsTo(() => Supply)
  supply!: Supply | null;

  @ApiProperty({ type: Priority, nullable: true })
  @BelongsTo(() => Priority)
  priority!: Priority | null;
}

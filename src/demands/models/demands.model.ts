import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Supply } from '../../supplies/models/supplies.model';
import { Priority } from '../../priorities/models/priorities.model';
import { Place } from '../../places/models/places.model';

@Table({ tableName: 'demands', underscored: true })
export class Demand extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ allowNull: true, type: DataType.STRING })
  comment!: string | null;

  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Place)
  placeId!: string;

  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => Supply)
  supplyId!: string;

  @Column({ allowNull: true, type: DataType.UUID })
  @ForeignKey(() => Priority)
  priorityId!: string | null;

  @BelongsTo(() => Place)
  place!: Place | null;

  @BelongsTo(() => Supply)
  supply!: Supply | null;

  @BelongsTo(() => Priority)
  priority!: Priority | null;
}

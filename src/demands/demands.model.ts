import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Supply } from '../supplies/supplies.model';
import { Priority } from '../priorities/priorities.model';
import { Place } from '../places/places.model';

@Table({ tableName: 'supplies', underscored: true })
export class Demand extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  id!: string;

  @Column({ allowNull: true, type: DataType.STRING })
  comment!: string | null;

  @BelongsTo(() => Place)
  place!: Place | null;

  @BelongsTo(() => Supply)
  supply!: Supply | null;

  @BelongsTo(() => Priority)
  priority!: Priority | null;
}

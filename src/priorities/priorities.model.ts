import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Demand } from '../demands/demands.model';

@Table({ tableName: 'supplies', underscored: true })
export class Priority extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  namePL!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameUA!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameEN!: string;

  @HasMany(() => Demand)
  demands!: Demand[];
}

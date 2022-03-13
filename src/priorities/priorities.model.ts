import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Demand } from '../demands/demands.model';

@Table({ tableName: 'supplies', underscored: true })
export class Priority extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  namePl!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameUa!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameEn!: string;

  @HasMany(() => Demand)
  demands!: Demand[];
}

import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Demand } from '../demands/demands.model';

@Table({ tableName: 'places', underscored: true })
export class Place extends Model {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  city!: string;

  @Column({ allowNull: false })
  street!: string;

  @Column({ allowNull: false })
  buildingNumber!: string;

  @Column({ allowNull: true, type: DataType.STRING(50) })
  apartment!: string | null;

  @Column({ allowNull: true, type: DataType.STRING })
  comment!: string | null;

  @Column({ allowNull: true, type: DataType.STRING })
  email!: string | null;

  @Column({ allowNull: true, type: DataType.STRING })
  phone!: string | null;

  @HasMany(() => Demand)
  demands!: Demand[];
}

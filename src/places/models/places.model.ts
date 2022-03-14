import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demands.model';

@Table({ tableName: 'places', underscored: true })
export class Place extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ allowNull: false })
  name!: string;

  @Column({ allowNull: false })
  city!: string;

  @Column({ allowNull: false })
  street!: string;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  buildingNumber!: string;

  @Column({ allowNull: true, type: DataType.STRING(50) })
  apartment!: string | null;

  @Column({ allowNull: true, type: DataType.STRING })
  comment!: string | null;

  @Column({ allowNull: true, type: DataType.STRING })
  email!: string | null;

  @Column({ allowNull: true, type: DataType.STRING })
  phone!: string | null;

  @Column({ allowNull: true, type: DataType.DECIMAL })
  latitude!: number | null;

  @Column({ allowNull: true, type: DataType.DECIMAL })
  longitude!: number | null;

  @HasMany(() => Demand)
  demands!: Demand[];
}

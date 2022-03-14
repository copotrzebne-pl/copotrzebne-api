import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demands.model';

@Table({ tableName: 'supplies', underscored: true })
export class Supply extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  namePl!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameUa!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameEn!: string;

  @HasMany(() => Demand)
  demand!: Demand[];
}

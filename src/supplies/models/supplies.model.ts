import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demands.model';

@Table({ tableName: 'supplies', underscored: true })
export class Supply extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  namePl!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameUa!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameEn!: string;

  @HasOne(() => Demand)
  demand!: Demand | null;
}

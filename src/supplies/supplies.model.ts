import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Demand } from '../demands/demands.model';

@Table({ tableName: 'supplies', underscored: true })
export class Supply extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  namePL!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameUA!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  nameGB!: string;

  @HasOne(() => Demand)
  demand!: Demand | null;
}

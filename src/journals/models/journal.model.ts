import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';

import { User } from '../../users/models/user.model';
import { Action } from '../types/action.enum';

@Table({ tableName: 'journals', underscored: true, timestamps: true, updatedAt: false })
export class Journal extends Model {
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @Column({ allowNull: false, type: DataType.ENUM, values: Object.values(Action) })
  action!: string;

  @Column({ allowNull: true, type: DataType.STRING })
  details!: string;

  @Column({ allowNull: false, type: DataType.UUID })
  @ForeignKey(() => User)
  userId!: string;

  @BelongsTo(() => User)
  user?: User;
}
